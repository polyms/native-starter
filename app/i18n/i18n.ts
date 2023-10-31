import * as Localization from 'expo-localization'
import { I18nManager } from 'react-native'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// if English isn't your default language, move Translations to the appropriate language file.
import en, { Translations } from './en'
import ar from './ar'
import ko from './ko'
import fr from './fr'

const locales = Localization.getLocales() // This method is guaranteed to return at least one array item.

/**
 * we need always include "*-US" for some valid language codes because when you change the system language,
 * the language code is the suffixed with "-US". i.e. if a device is set to English ("en"),
 * if you change to another language and then return to English language code is now "en-US".
 */
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      ar: { translation: ar },
      en: { translation: en },
      'en-US': { translation: en },
      ko: { translation: ko },
      fr: { translation: fr },
    },
    lng: 'en', // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',
    locales,

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  })

export default i18n

// handle RTL languages
export const isRTL = () => i18n.dir() === 'rtl'
I18nManager.allowRTL(isRTL())
I18nManager.forceRTL(isRTL())

/**
 * Builds up valid keypaths for translations.
 */
export type TxKeyPath = RecursiveKeyOf<Translations>

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[]
  ? Text
  : TValue extends object
  ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
  : Text
