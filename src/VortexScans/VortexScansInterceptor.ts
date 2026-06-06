// Authenticates every api.vortexscans.org request with the better-auth session
// cookie. The site's bearer plugin is OFF, so a Bearer header is ignored — auth
// works ONLY as the cookie "__Secure-vthemeauth.session_token" carrying the
// URL-DECODED session-token value (verified live: decoded => authenticated,
// url-encoded => rejected). Paperback forwards request.cookies (a manual Cookie
// header is dropped), so we attach it there. On each response we capture a rotated
// token from Set-Cookie so the session self-extends while it is used.
import { SourceInterceptor, Request, Response, SourceStateManager } from '@paperback/types'
import { STATE } from './VortexScansSettings'

const BASE = 'https://vortexscans.org'
const COOKIE_NAME = '__Secure-vthemeauth.session_token'
const COOKIE_DOMAIN = 'vortexscans.org'

// Baked-in session token (personal build) so it works with no typing. Overridable
// in Settings. NOTE: this is public in the served bundle and expires if unused for
// ~7 days; paste a fresh one in Settings if browsing stops returning your account.
const SEED_TOKEN = 'XcIMDAd63zkMkm6M7P47z3EVsDs8pz87.jzjyzKOFqVTzGP7LNqSuwTtSZ6F2J5QHi/1PYeWakbA='

export class VortexScansInterceptor implements SourceInterceptor {
  constructor(private sm: SourceStateManager) {}

  private async token(): Promise<string> {
    const t = (await this.sm.keychain.retrieve(STATE.SESSION)) as string
    return (t && t.length) ? t : SEED_TOKEN
  }

  async interceptRequest(request: Request): Promise<Request> {
    request.headers = {
      ...(request.headers ?? {}),
      'Accept':  'application/json, text/plain, */*',
      'Referer': `${BASE}/`,
      'Origin':  BASE
    }

    if (request.url.includes('api.vortexscans.org')) {
      try {
        const tok = await this.token()
        if (tok) {
          request.cookies = [
            ...(request.cookies ?? []),
            App.createCookie({ name: COOKIE_NAME, value: tok, domain: COOKIE_DOMAIN, path: '/' })
          ]
          await this.sm.store(STATE.DEBUG_REQ, 'cookieAttached')
        } else {
          await this.sm.store(STATE.DEBUG_REQ, 'noToken')
        }
      } catch (e) {
        await this.sm.store(STATE.DEBUG_REQ, 'reqEXC=' + String(e).slice(0, 60))
      }
    }
    return request
  }

  async interceptResponse(response: Response): Promise<Response> {
    try {
      const h = response.headers ?? {}
      let raw: string | undefined
      for (const k of Object.keys(h)) {
        if (k.toLowerCase() === 'set-cookie') {
          const v = h[k]
          raw = Array.isArray(v) ? v.join('\n') : String(v)
          break
        }
      }
      if (raw && raw.includes(COOKIE_NAME)) {
        const m = raw.match(new RegExp(`${COOKIE_NAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;\\n]+)`))
        if (m && m[1]) {
          let val = m[1].trim()
          try { val = decodeURIComponent(val) } catch { /* keep as-is */ }
          if (val && val !== 'deleted' && val.length > 10) {
            await this.sm.keychain.store(STATE.SESSION, val)
            await this.sm.store(STATE.DEBUG_RESP, 'rotated')
          }
        }
      }
    } catch (e) {
      await this.sm.store(STATE.DEBUG_RESP, 'respEXC=' + String(e).slice(0, 60))
    }
    return response
  }
}
