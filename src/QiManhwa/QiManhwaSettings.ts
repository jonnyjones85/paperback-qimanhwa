// Settings. The account login is baked into the interceptor (single personal
// account, self-healing, no captcha), so there is intentionally NO email/password
// override field — a saved override used to silently shadow the working baked login
// and break it. Re-login just wipes tokens (and any legacy saved override) so the
// next request re-authenticates with the baked credentials.
import { SourceStateManager, DUISection } from '@paperback/types'

export const STATE = {
  EMAIL:      'email',          // legacy key — no longer used/read; wiped on re-login
  PASSWORD:   'password',       // legacy key — no longer used/read; wiped on re-login
  REFRESH:    'refresh_token',  // keychain — rotating 7-day token (obtained at runtime)
  ACCESS:     'access_token',   // keychain — 15-min token (auto-minted)
  ACCESS_EXP: 'access_exp',     // plain (number, epoch ms)
  SHOW_LOCKED:'show_locked',    // plain (bool)
  DEBUG_REQ:  'debug_req',      // plain — diagnostics
  DEBUG_RF:   'debug_rf'        // plain — diagnostics
}

async function resetAuth(sm: SourceStateManager): Promise<void> {
  await sm.keychain.store(STATE.ACCESS, undefined)
  await sm.keychain.store(STATE.REFRESH, undefined)
  await sm.store(STATE.ACCESS_EXP, 0)
  // Wipe any legacy email/password override that may have been saved before the
  // fields were removed (those would otherwise have to be cleared by hand).
  await sm.store(STATE.EMAIL, undefined)
  await sm.keychain.store(STATE.PASSWORD, undefined)
}

export async function getSourceMenu(sm: SourceStateManager): Promise<DUISection> {
  return App.createDUISection({
    id: 'qimanhwa-settings',
    header: 'QiManhwa',
    isHidden: false,
    rows: async () => [

      App.createDUISwitch({
        id: STATE.SHOW_LOCKED,
        label: 'Show locked (premium) chapters',
        value: App.createDUIBinding({
          get: async () => (await sm.retrieve(STATE.SHOW_LOCKED)) as boolean ?? false,
          set: async (v) => { await sm.store(STATE.SHOW_LOCKED, v) }
        })
      }),

      App.createDUIButton({
        id: 'relogin',
        label: 'Re-login (reset to built-in account)',
        onTap: async () => { await resetAuth(sm) }
      })
    ]
  })
}
