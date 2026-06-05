// Login settings. Email + password (defaults baked in for this personal build, so
// it works with no typing). The extension logs in itself and auto-refreshes.
import { SourceStateManager, DUISection } from '@paperback/types'

export const STATE = {
  EMAIL:      'email',          // plain — login email (default baked in interceptor)
  PASSWORD:   'password',       // keychain (secret) — login password (default baked)
  REFRESH:    'refresh_token',  // keychain — rotating 7-day token (obtained at runtime)
  ACCESS:     'access_token',   // keychain — 15-min token (auto-minted)
  ACCESS_EXP: 'access_exp',     // plain (number, epoch ms)
  SHOW_LOCKED:'show_locked',    // plain (bool)
  DEBUG_REQ:  'debug_req',      // plain — diagnostics
  DEBUG_RF:   'debug_rf'        // plain — diagnostics
}

async function clearTokens(sm: SourceStateManager): Promise<void> {
  await sm.keychain.store(STATE.ACCESS, undefined)
  await sm.keychain.store(STATE.REFRESH, undefined)
  await sm.store(STATE.ACCESS_EXP, 0)
}

export async function getSourceMenu(sm: SourceStateManager): Promise<DUISection> {
  return App.createDUISection({
    id: 'qimanhwa-settings',
    header: 'QiManhwa Login',
    isHidden: false,
    rows: async () => [

      App.createDUIInputField({
        id: STATE.EMAIL,
        label: 'Email',
        value: App.createDUIBinding({
          get: async () => (await sm.retrieve(STATE.EMAIL)) as string ?? '',
          set: async (v) => { await sm.store(STATE.EMAIL, (v ?? '').trim()); await clearTokens(sm) }
        })
      }),

      App.createDUISecureInputField({
        id: STATE.PASSWORD,
        label: 'Password',
        value: App.createDUIBinding({
          get: async () => (await sm.keychain.retrieve(STATE.PASSWORD)) as string ?? '',
          set: async (v) => { await sm.keychain.store(STATE.PASSWORD, (v ?? '').trim()); await clearTokens(sm) }
        })
      }),

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
        label: 'Re-login (clear saved tokens)',
        onTap: async () => { await clearTokens(sm) }
      })
    ]
  })
}
