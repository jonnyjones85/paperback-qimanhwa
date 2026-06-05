// Injects auth + required headers on EVERY request (incl. chapter images), and
// AUTO-REFRESHES the access token using the refresh token.
//
// Auth model (reverse-engineered live from the qimanhwa Angular app):
//   - api.qimanhwa.com reads the JWT from the `accessToken` cookie (15-min life).
//   - When it expires, POST https://api.qimanhwa.com/api/v1/auth/refresh with the
//     `refreshToken` cookie -> 200 {accessToken, refreshToken} in the BODY.
//   - The refresh token ROTATES on every call, so we persist the new one each time.
//
// PERSONAL BUILD: a seed refresh token is baked in (SEED_REFRESH) so no pasting is
// needed. On first use it refreshes, rotates, and the new token is kept in the
// keychain from then on. A pasted token in Settings (if any) always wins over the seed.
import { SourceInterceptor, Request, Response, SourceStateManager, RequestManager } from '@paperback/types'
import { STATE } from './QiManhwaSettings'

const BASE = 'https://qimanhwa.com'
const API  = 'https://api.qimanhwa.com/api/v1'
const ACCESS_TTL_MS = 14 * 60 * 1000   // refresh ~1 min before the 15-min token dies

// Baked-in seed (personal build). Rotates into the keychain on first refresh.
// Re-publish a fresh value here if it ever fully lapses (>7 days untouched).
const SEED_REFRESH = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWp3enZ2ZnQwMmNsdWV3NnRibnh2ZjR2IiwiaWF0IjoxNzgwNjgzODQyLCJleHAiOjE3ODEyODg2NDJ9.mqEM3G1LNE-fxaaBwi1g1jdm3OfGEihss8XBaTPAwmA'

export class QiManhwaInterceptor implements SourceInterceptor {
  // Set by the Source after construction — a SEPARATE manager for the refresh call
  // so we never re-enter the main request queue from inside interceptRequest.
  authManager!: RequestManager
  private refreshing?: Promise<void>

  constructor(private sm: SourceStateManager) {}

  private addCookie(request: Request, cookie: string): void {
    const headers = (request.headers ?? {}) as Record<string, string>
    const existing = headers['Cookie'] ?? headers['cookie'] ?? ''
    headers['Cookie'] = existing ? `${existing}; ${cookie}` : cookie
    request.headers = headers
  }

  // Pasted keychain token wins; otherwise fall back to the baked-in seed.
  private async currentRefresh(): Promise<{ tok: string; fromKeychain: boolean }> {
    const kc = (await this.sm.keychain.retrieve(STATE.REFRESH)) as string
    if (kc && kc.length > 0) return { tok: kc, fromKeychain: true }
    return { tok: SEED_REFRESH, fromKeychain: false }
  }

  async interceptRequest(request: Request): Promise<Request> {
    request.headers = {
      ...(request.headers ?? {}),
      'Accept':         'application/json, text/plain, */*',
      'Referer':        `${BASE}/`,
      'Origin':         BASE,                 // API is a sibling subdomain -> CORS same-site
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site'
    }

    // The refresh call itself: attach the refresh token, do NOT try to refresh again.
    if (request.url.includes('/auth/refresh')) {
      const { tok } = await this.currentRefresh()
      if (tok) this.addCookie(request, `refreshToken=${tok}`)
      return request
    }

    // Any API request: ensure a valid access token, then attach it.
    if (request.url.includes('api.qimanhwa.com')) {
      const { tok } = await this.currentRefresh()
      if (tok) {
        let at = (await this.sm.keychain.retrieve(STATE.ACCESS)) as string
        const exp = (await this.sm.retrieve(STATE.ACCESS_EXP)) as number ?? 0
        if (!at || Date.now() >= exp) {
          await this.ensureRefresh()
          at = (await this.sm.keychain.retrieve(STATE.ACCESS)) as string
        }
        if (at) this.addCookie(request, `accessToken=${at}`)
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

    // The keychain token was dead — fall back to the baked-in seed once.
    if (!triedSeed && fromKeychain && SEED_REFRESH) {
      await this.sm.keychain.store(STATE.REFRESH, undefined)
      return this.doRefresh(true)
    }

    // Everything expired. Wipe and surface a clear message.
    await this.sm.keychain.store(STATE.ACCESS, undefined)
    await this.sm.store(STATE.ACCESS_EXP, 0)
    throw new Error(
      `QiManhwa: token refresh failed (HTTP ${res.status}). The login token lapsed — ` +
      `ask for a fresh build, or paste a new Refresh Token in this source's Settings.`)
  }
}
