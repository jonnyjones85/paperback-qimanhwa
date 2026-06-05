// Injects auth via the Authorization: Bearer header on EVERY api request, and
// AUTO-REFRESHES the access token. (Paperback does NOT reliably forward a
// manually-set Cookie header, so auth MUST go through Authorization — verified
// live: the qimanhwa API returns owned premium chapters only when the JWT is
// sent as `Authorization: Bearer <token>`.)
//
// Auth model (reverse-engineered live from qimanhwa):
//   - Content: GET .../series/.../chapters/...  with  Authorization: Bearer <accessToken> (15-min JWT).
//   - Refresh: POST .../auth/refresh  with  Authorization: Bearer <refreshToken> (7-day JWT)
//             -> 200 {accessToken, refreshToken} in the BODY. The refresh token ROTATES.
//
// PERSONAL BUILD: a seed refresh token is baked in (SEED_REFRESH) so no pasting.
// On first use it refreshes, rotates, and the new token lives in the keychain.
import { SourceInterceptor, Request, Response, SourceStateManager, RequestManager } from '@paperback/types'
import { STATE } from './QiManhwaSettings'

const BASE = 'https://qimanhwa.com'
const API  = 'https://api.qimanhwa.com/api/v1'
const ACCESS_TTL_MS = 14 * 60 * 1000   // refresh ~1 min before the 15-min token dies

// Baked-in seed (personal build). Rotates into the keychain on first refresh.
// Re-publish a fresh value here if it ever fully lapses (>7 days untouched).
const SEED_REFRESH = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWp3enZ2ZnQwMmNsdWV3NnRibnh2ZjR2IiwiaWF0IjoxNzgwNjg1NzcxLCJleHAiOjE3ODEyOTA1NzF9.BXnfI41ifCdRnDfFceqteKNl9WajeeF0soarPJr2LCI'

export class QiManhwaInterceptor implements SourceInterceptor {
  // Set by the Source after construction — a SEPARATE manager for the refresh call
  // so we never re-enter the main request queue from inside interceptRequest.
  authManager!: RequestManager
  private refreshing?: Promise<void>

  constructor(private sm: SourceStateManager) {}

  // Pasted keychain token wins; otherwise fall back to the baked-in seed.
  private async currentRefresh(): Promise<{ tok: string; fromKeychain: boolean }> {
    const kc = (await this.sm.keychain.retrieve(STATE.REFRESH)) as string
    if (kc && kc.length > 0) return { tok: kc, fromKeychain: true }
    return { tok: SEED_REFRESH, fromKeychain: false }
  }

  async interceptRequest(request: Request): Promise<Request> {
    request.headers = {
      ...(request.headers ?? {}),
      'Accept':  'application/json, text/plain, */*',
      'Referer': `${BASE}/`,
      'Origin':  BASE
    }

    // The refresh call itself: send the refresh token as a Bearer; do NOT refresh again.
    if (request.url.includes('/auth/refresh')) {
      const { tok } = await this.currentRefresh()
      if (tok) request.headers['Authorization'] = `Bearer ${tok}`
      return request
    }

    // Any API request: ensure a valid access token, then send it as a Bearer.
    // Failure is non-fatal: free content still loads unauthenticated.
    if (request.url.includes('api.qimanhwa.com')) {
      try {
        let at = (await this.sm.keychain.retrieve(STATE.ACCESS)) as string
        const exp = (await this.sm.retrieve(STATE.ACCESS_EXP)) as number ?? 0
        if (!at || Date.now() >= exp) {
          await this.ensureRefresh()
          at = (await this.sm.keychain.retrieve(STATE.ACCESS)) as string
        }
        if (at) request.headers['Authorization'] = `Bearer ${at}`
      } catch (e) {
        // token unavailable (e.g. seed lapsed) — proceed unauthenticated so free
        // chapters keep working; premium chapters will surface a clear error.
      }
    }
    return request
  }

  async interceptResponse(response: Response): Promise<Response> {
    return response
  }

  // Single-flight: many parallel requests share one refresh.
  private ensureRefresh(): Promise<void> {
    if (!this.refreshing) {
      this.refreshing = this.doRefresh(false).then(
        () => { this.refreshing = undefined },
        (e) => { this.refreshing = undefined; throw e }
      )
    }
    return this.refreshing
  }

  private async doRefresh(triedSeed: boolean): Promise<void> {
    const { fromKeychain } = await this.currentRefresh()
    const req = App.createRequest({ url: `${API}/auth/refresh`, method: 'POST' })
    const res = await this.authManager.schedule(req, 1)

    if (res.status >= 200 && res.status < 300) {
      const j = JSON.parse(res.data ?? '{}')
      if (j.accessToken) await this.sm.keychain.store(STATE.ACCESS, j.accessToken)
      if (j.refreshToken) await this.sm.keychain.store(STATE.REFRESH, j.refreshToken) // rotation
      await this.sm.store(STATE.ACCESS_EXP, Date.now() + ACCESS_TTL_MS)
      return
    }

    // Keychain token was dead — fall back to the baked-in seed once.
    if (!triedSeed && fromKeychain && SEED_REFRESH) {
      await this.sm.keychain.store(STATE.REFRESH, undefined)
      return this.doRefresh(true)
    }

    await this.sm.keychain.store(STATE.ACCESS, undefined)
    await this.sm.store(STATE.ACCESS_EXP, 0)
    throw new Error(
      `QiManhwa: token refresh failed (HTTP ${res.status}). The login token lapsed — ` +
      `ask for a fresh build, or paste a new Refresh Token in this source's Settings.`)
  }
}
