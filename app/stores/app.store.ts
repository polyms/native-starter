import i18n from '~/i18n'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { I18nManager } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      lang: 'en',
      changeLanguage: (lang: string) => {
        console.info('Change language from %s to %s', i18n.language, lang)
        if (i18n.language === lang) return

        i18n.changeLanguage(lang).then(() => {
          set({ lang })
          I18nManager.forceRTL(i18n.dir(lang) === 'rtl')
          // if (__DEV__) NativeModules.DevSettings.reload()
          // else RNRestart.restart()
        })
      },
    }),
    {
      name: 'App',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

// ================================================================================================

export interface AppState {
  lang: string
  // actions
  changeLanguage: (lang: string) => void
}
