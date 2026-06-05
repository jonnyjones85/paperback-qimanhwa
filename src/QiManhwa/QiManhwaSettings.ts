// Settings form. The user pastes ONE thing: their 7-day Refresh Token (from a
// browser login). The extension uses it to mint short-lived access tokens and
// rolls the refresh token forward automatically (the API rotates it each refresh).
import { SourceStateManager, DUISection } from '@paperback/types'

export const STATE = {
  REFRESH:    'refresh_token',  // keychain (secret) — the 7-day token, rotated on each refresh
  ACCESS:     'access_token',   // keychain (secret) — the 15-min token, auto-minted
  ACCESS_EXP: 'access_exp',     // plain (number, epoch ms) — when to refresh
  SHOW_LOCKED:'show_locked',    // plain (bool)
  DEBUG_REQ:  'debug_req',      // plain — last request auth state (for diagnostics)
  DEBUG_RF:   'debug_rf'        // plain — last refresh outcome (for diagnostics)
}

export async function getSourceMenu(sm: SourceStateManager): Promise<DUISection> {
  return App.createDUISection({
    id: 'qimanhwa-settings',
    header: 'QiManhwa Account',
    isHidden: false,
    rows: async () => [

      // Paste your 7-day refreshToken here (see README for how to grab it).
      App.createDUISecureInputField({
        id: STATE.REFRESH,
        label: 'Refresh Token',
        value: App.createDUIBinding({
          get: async () => (await sm.keychain.retrieve(STATE.REFRESH)) as string ?? '',
          set: async (v) => {
            await sm.keychain.store(STATE.REFRESH, (v ?? '').trim())
            // new refresh token -> force a fresh access token on next request
            await sm.keychain.store(STATE.ACCESS, undefined)
            await sm.store(STATE.ACCESS_EXP, 0)
          }
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
        id: 'logout',
        label: 'Clear Login',
        onTap: async () => {
          await sm.keychain.store(STATE.REFRESH, undefined)
          await sm.keychain.store(STATE.ACCESS, undefined)
          await sm.store(STATE.ACCESS_EXP, 0)
        }
      })
    ]
  })
}
