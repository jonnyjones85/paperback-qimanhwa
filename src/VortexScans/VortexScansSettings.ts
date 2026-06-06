// Login settings for Vortexscans. Auth is a better-auth SESSION TOKEN sent as the
// cookie "__Secure-vthemeauth.session_token" (the site's bearer plugin is OFF, so
// only cookie auth works). A default token is baked in for zero-typing; paste a
// fresh one here if it ever expires. The extension auto-rotates it while it's used.
import { SourceStateManager, DUISection } from '@paperback/types'

export const STATE = {
  SESSION:     'session_token',   // keychain (secret) — better-auth session token value (URL-decoded)
  SHOW_LOCKED: 'show_locked',     // plain (bool)
  DEBUG_REQ:   'debug_req',       // plain — diagnostics
  DEBUG_RESP:  'debug_resp'       // plain — diagnostics
}

export async function getSourceMenu(sm: SourceStateManager): Promise<DUISection> {
  return App.createDUISection({
    id: 'vortexscans-settings',
    header: 'Vortex Scans Login',
    isHidden: false,
    rows: async () => [

      App.createDUISecureInputField({
        id: STATE.SESSION,
        label: 'Session token',
        value: App.createDUIBinding({
          get: async () => (await sm.keychain.retrieve(STATE.SESSION)) as string ?? '',
          set: async (v) => { await sm.keychain.store(STATE.SESSION, (v ?? '').trim()) }
        })
      }),

      App.createDUISwitch({
        id: STATE.SHOW_LOCKED,
        label: 'Show locked (paid) chapters',
        value: App.createDUIBinding({
          get: async () => (await sm.retrieve(STATE.SHOW_LOCKED)) as boolean ?? false,
          set: async (v) => { await sm.store(STATE.SHOW_LOCKED, v) }
        })
      }),

      App.createDUIButton({
        id: 'clear_session',
        label: 'Clear session token',
        onTap: async () => { await sm.keychain.store(STATE.SESSION, undefined) }
      })
    ]
  })
}
