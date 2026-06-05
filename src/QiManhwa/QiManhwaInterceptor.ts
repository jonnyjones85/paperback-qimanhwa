// Injects auth via Authorization: Bearer (Paperback does NOT forward a manual
// Cookie header; the Komga official source proves Authorization IS forwarded),
// and AUTO-REFRESHES the access token. Records small diagnostics into state so a
// failure surfaces a readable reason in the chapter error.
//
// Auth (verified live on qimanhwa):
//   Content: GET .../chapters/...        Authorization: Bearer <accessToken> (15-min)
//   Refresh: POST .../auth/refresh       Authorization: Bearer <refreshToken> (7-day, ROTATES)
//            -> 200 {accessToken, refreshToken} in the BODY.
import { SourceInterceptor, Request, Response, SourceStateManager, RequestManager } from '@paperback/types'
import { STATE } from './QiManhwaSettings'

const BASE = 'https://qimanhwa.com'
const API  = 'https://api.qimanhwa.com/api/v1'
const ACCESS_TTL_MS = 14 * 60 * 1000

// Baked-in seed (personal build). Rotates into the keychain on first refresh.
const SEED_REFRESH = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWp3enZ2ZnQwMmNsdWV3NnRibnh2ZjR2IiwiaWF0IjoxNzgwNjg2Mjg5LCJleHAiOjE3ODEyOTEwODl9.FAOKU-33n9_v78JqLYZuvzb4njTRhnhY361UmhhenNs'

export class QiManhwaInterceptor implements SourceInterceptor {
  authManager!: RequestManager
  private refreshing?: Promise<void>

  constructor(private sm: SourceStateManager) {}

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

    if (request.url.includes('/auth/refresh')) {
      const { tok } = await this.currentRefresh()
      if (tok) request.headers['Authorization'] = `Bearer ${tok}`
      return request
    }

    if (request.url.includes('api.qimanhwa.com')) {
      let dbg = ''
      try {
        let at = (await this.sm.keychain.retrieve(STATE.ACCESS)) as string
        const exp = (await this.sm.retrieve(STATE.ACCESS_EXP)) as number ?? 0
        if (!at || Date.now() >= exp) { dbg += 'needRefresh;'; await this.ensureRefresh(); at = (await this.sm.keychain.retrieve(STATE.ACCESS)) as string }
        if (at) { request.headers['Authorization'] = `Bearer ${at}`; dbg += 'authSent=Y' }
        else { dbg += 'authSent=N' }
      } catch (e) {
        dbg += 'reqEXC=' + String(e).slice(0, 50)
      }
      await this.sm.store(STATE.DEBUG_REQ, dbg)
    }
    return request
  }

  async interceptResponse(response: Response): Promise<Response> {
    return response
  }

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
    if (!this.authManager) { await this.sm.store(STATE.DEBUG_RF, 'NO_AUTHMGR'); throw new Error('no authManager') }
    const { fromKeychain } = await this.currentRefresh()
    const req = App.createRequest({ url: `${API}/auth/refresh`, method: 'POST' })

    let res
    try { res = await this.authManager.schedule(req, 1) }
    catch (e) { await this.sm.store(STATE.DEBUG_RF, 'schEXC=' + String(e).slice(0, 70)); throw e }

    if (res.status >= 200 && res.status < 300) {
      const j = JSON.parse(res.data ?? '{}')
      if (j.accessToken) await this.sm.keychain.store(STATE.ACCESS, j.accessToken)
      if (j.refreshToken) await this.sm.keychain.store(STATE.REFRESH, j.refreshToken)
      await this.sm.store(STATE.ACCESS_EXP, Date.now() + ACCESS_TTL_MS)
      await this.sm.store(STATE.DEBUG_RF, `rf=${res.status} gotAT=${j.accessToken ? 'Y' : 'N'} seed=${fromKeychain ? 'N' : 'Y'}`)
      return
    }

    await this.sm.store(STATE.DEBUG_RF, `rf=${res.status} seed=${fromKeychain ? 'N' : 'Y'}`)
    if (!triedSeed && fromKeychain && SEED_REFRESH) {
      await this.sm.keychain.store(STATE.REFRESH, undefined)
      return this.doRefresh(true)
    }

    await this.sm.keychain.store(STATE.ACCESS, undefined)
    await this.sm.store(STATE.ACCESS_EXP, 0)
    throw new Error(`refresh failed HTTP ${res.status}`)
  }
}
