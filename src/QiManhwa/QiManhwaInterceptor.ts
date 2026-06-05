// Attaches Cloudflare clearance + the site session cookie + required headers to
// EVERY request, INCLUDING chapter image fetches. In Paperback 0.8 there is no
// separate getImageRequest — all per-request mutation happens here.
import { SourceInterceptor, Request, Response, SourceStateManager } from '@paperback/types'
import { STATE } from './QiManhwaSettings'

const BASE = 'https://qimanhwa.com'

export class QiManhwaInterceptor implements SourceInterceptor {
  constructor(private sm: SourceStateManager) {}

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

    // UA must match the browser that logged in / solved Cloudflare.
    const ua = (await this.sm.retrieve(STATE.USER_AGENT)) as string
    if (ua) request.headers['User-Agent'] = ua

    // Inject the site session cookie on every request (pages list + images).
    const cookie = (await this.sm.keychain.retrieve(STATE.SESSION_COOKIE)) as string
    if (cookie) {
      const existing = request.headers['Cookie'] ?? request.headers['cookie'] ?? ''
      request.headers['Cookie'] = existing ? `${existing}; ${cookie}` : cookie
    }
    return request
  }

  async interceptResponse(response: Response): Promise<Response> {
    return response   // no-op; could detect a login-page HTML body on a JSON route to warn of expiry
  }
}
