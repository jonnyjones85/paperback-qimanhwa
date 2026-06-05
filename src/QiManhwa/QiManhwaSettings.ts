// Settings form (getSourceMenu). Where the user pastes their site session cookie.
// Secrets (the cookie) go to the keychain.
import { SourceStateManager, DUISection } from '@paperback/types'

export const STATE = {
  SESSION_COOKIE: 'session_cookie',   // keychain (secret)
  USER_AGENT:     'user_agent',        // plain (must match the UA that solved CF/login)
  SHOW_LOCKED:    'show_locked'        // plain (bool)
}

export async function getSourceMenu(sm: SourceStateManager): Promise<DUISection> {
  return App.createDUISection({
    id: 'qimanhwa-settings',
    header: 'QiManhwa Account',
    isHidden: false,
    rows: async () => [

      // Paste the qimanhwa SITE session cookie here (masked).
      App.createDUISecureInputField({
        id: STATE.SESSION_COOKIE,
        label: 'Session Cookie',
        value: App.createDUIBinding({
          get: async () => (await sm.keychain.retrieve(STATE.SESSION_COOKIE)) as string ?? '',
          set: async (v) => { await sm.keychain.store(STATE.SESSION_COOKIE, (v ?? '').trim()) }
        })
      }),

      // The UA the cookie was issued to (Cloudflare binds cf_clearance <-> UA).
      App.createDUIInputField({
        id: STATE.USER_AGENT,
        label: 'Browser User-Agent',
        value: App.createDUIBinding({
          get: async () => (await sm.retrieve(STATE.USER_AGENT)) as string ?? '',
          set: async (v) => { await sm.store(STATE.USER_AGENT, (v ?? '').trim()) }
        })
      }),

      // Show coin-locked chapters in the list.
      App.createDUISwitch({
        id: STATE.SHOW_LOCKED,
        label: 'Show locked (premium) chapters',
        value: App.createDUIBinding({
          get: async () => (await sm.retrieve(STATE.SHOW_LOCKED)) as boolean ?? false,
          set: async (v) => { await sm.store(STATE.SHOW_LOCKED, v) }
        })
      }),

      App.createDUIButton({
        id: 'logout',
        label: 'Clear Session',
        onTap: async () => { await sm.keychain.store(STATE.SESSION_COOKIE, undefined) }
      })

      // NOTE: deliberately NO App.createDUIOAuthButton. That primitive is for clean
      // authorize+token API providers (Anilist/MAL). It CANNOT capture a site's own
      // session cookie after Discord SSO. See README "Why Discord can't be automated".
    ]
  })
}
