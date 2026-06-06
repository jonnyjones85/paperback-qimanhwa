// Authenticates every API request with Authorization: Bearer <accessToken>, and
// keeps a valid token by: (1) using the cached access token, else (2) refreshing
// with the rotating refresh token, else (3) LOGGING IN with email+password.
// Login is its own independent session, so it never conflicts with a browser
// session and self-heals indefinitely. Verified live on qimanhwa:
//   POST /auth/login  {email,password}            -> 200 {accessToken, refreshToken}
//   POST /auth/refresh  (Authorization: Bearer rt) -> 200 {accessToken, refreshToken}
//   GET  .../chapters/...  (Authorization: Bearer at) -> owned chapters return images
import { SourceInterceptor, Request, Response, SourceStateManager, RequestManager } from '@paperback/types'
import { STATE } from './QiManhwaSettings'

const BASE = 'https://qimanhwa.com'
const API  = 'https://api.qimanhwa.com/api/v1'
const ACCESS_TTL_MS = 14 * 60 * 1000

// Baked-in account (personal build) so it works with no typing. Overridable in Settings.
const SEED_EMAIL    = 'diabatekele@gmail.com'
const SEED_PASSWORD = 'runboc-zahhy1-gYztuk'

export class QiManhwaInterceptor implements SourceInterceptor {
  authManager!: RequestManager
  private authing?: Promise<void>

  constructor(private sm: SourceStateManager) {}

  private async creds(): Promise<{ email: string; password: string }> {
    // Single baked-in account, no Settings override (removed — a saved override
    // used to silently shadow this working login and break it).
    return { email: SEED_EMAIL, password: SEED_PASSWORD }
  }

  private async currentRefresh(): Promise<string> {
    return ((await this.sm.keychain.retrieve(STATE.REFRESH)) as string) ?? ''
  }

  async interceptRequest(request: Request): Promise<Request> {
    request.headers = {
      ...(request.headers ?? {}),
      'Accept':  'application/json, text/plain, */*',
      'Referer': `${BASE}/`,
      'Origin':  BASE
    }

    // Login carries credentials in the body — no auth header, no auth recursion.
    if (request.url.includes('/auth/login')) return request

    // Refresh carries the refresh token as a Bearer.
    if (request.url.includes('/auth/refresh')) {
      const rt = await this.currentRefresh()
      if (rt) request.headers['Authorization'] = `Bearer ${rt}`
      return request
    }

    // Every other API request: ensure a valid access token, attach as Bearer.
    if (request.url.includes('api.qimanhwa.com')) {
      let dbg = ''
      try {
        let at = (await this.sm.keychain.retrieve(STATE.ACCESS)) as string
        const exp = (await this.sm.retrieve(STATE.ACCESS_EXP)) as number ?? 0
        if (!at || Date.now() >= exp) { dbg += 'needAuth;'; await this.ensureAuth(); at = (await this.sm.keychain.retrieve(STATE.ACCESS)) as string }
        if (at) { request.headers['Authorization'] = `Bearer ${at}`; dbg += 'authSent=Y' }
        else { dbg += 'authSent=N' }
      } catch (e) {
        dbg += 'reqEXC=' + String(e).slice(0, 60)
      }
      await this.sm.store(STATE.DEBUG_REQ, dbg)
    }
    return request
  }

  async interceptResponse(response: Response): Promise<Response> {
    return response
  }

  // Single-flight auth: refresh if we can, otherwise log in.
  private ensureAuth(): Promise<void> {
    if (!this.authing) {
      this.authing = this.doAuth().then(
        () => { this.authing = undefined },
        (e) => { this.authing = undefined; throw e }
      )
    }
    return this.authing
  }

  private async doAuth(): Promise<void> {
    if (!this.authManager) { await this.sm.store(STATE.DEBUG_RF, 'NO_AUTHMGR'); throw new Error('no authManager') }
    const rt = await this.currentRefresh()
    if (rt) {
      if (await this.tryRefresh()) return   // fast path
    }
    await this.doLogin()                     // primary / self-heal
  }

  private async store(j: any, how: string): Promise<void> {
    if (j.accessToken) await this.sm.keychain.store(STATE.ACCESS, j.accessToken)
    if (j.refreshToken) await this.sm.keychain.store(STATE.REFRESH, j.refreshToken)
    await this.sm.store(STATE.ACCESS_EXP, Date.now() + ACCESS_TTL_MS)
    await this.sm.store(STATE.DEBUG_RF, `${how} gotAT=${j.accessToken ? 'Y' : 'N'}`)
  }

  private async tryRefresh(): Promise<boolean> {
    const req = App.createRequest({ url: `${API}/auth/refresh`, method: 'POST' })
    let res
    try { res = await this.authManager.schedule(req, 1) }
    catch (e) { await this.sm.store(STATE.DEBUG_RF, 'refreshEXC=' + String(e).slice(0, 60)); return false }
    if (res.status >= 200 && res.status < 300) { await this.store(JSON.parse(res.data ?? '{}'), `refresh=${res.status}`); return true }
    await this.sm.store(STATE.DEBUG_RF, `refresh=${res.status}`)
    return false
  }

  private async doLogin(): Promise<void> {
    const { email, password } = await this.creds()
    const req = App.createRequest({
      url: `${API}/auth/login`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ email, password })
    })
    const res = await this.authManager.schedule(req, 1)
    if (res.status >= 200 && res.status < 300) { await this.store(JSON.parse(res.data ?? '{}'), `login=${res.status}`); return }
    await this.sm.keychain.store(STATE.ACCESS, undefined)
    await this.sm.store(STATE.ACCESS_EXP, 0)
    await this.sm.store(STATE.DEBUG_RF, `login=${res.status}`)
    throw new Error(`login failed HTTP ${res.status} — check Email/Password in Settings`)
  }
}
