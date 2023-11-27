import './i18n'
import './utils/ignoreWarnings'

import * as eva from '@eva-design/eva'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { useFonts } from 'expo-font'
import * as Linking from 'expo-linking'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'

import { AssetIconsPack } from './components/asset-icons'
import Config from './config'
import { AppNavigator, useNavigationPersistence } from './navigators'
import { ErrorBoundary } from './screens/ErrorScreen/ErrorBoundary'
import { useAppStore } from './stores/app.store'
import theme, { customFontsToLoad, mapping } from './theme'
import * as storage from './utils/storage'

/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
}

export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE'

// Web linking configuration
const prefix = Linking.createURL('/')
const config = {
  screens: {
    Login: {
      path: '',
    },
    Welcome: 'welcome',
    Demo: {
      screens: {
        DemoShowroom: {
          path: 'showroom/:queryIndex?/:itemIndex?',
        },
        DemoDebug: 'debug',
        DemoPodcastList: 'podcast',
        DemoCommunity: 'community',
      },
    },
  },
}
const queryClient = new QueryClient()

/**
 * This is the root component of our app.
 */
function App(props: AppProps) {
  const { hideSplashScreen } = props
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)
  const hydrated = useHydration()

  const [areFontsLoaded] = useFonts(customFontsToLoad)

  useEffect(() => {
    setTimeout(hideSplashScreen, 500)
  }, [])

  // const { rehydrated } = useInitialRootStore(() => {
  //   // This runs after the root store has been initialized and rehydrated.

  //   // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
  //   // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
  //   // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
  //   // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
  //   setTimeout(hideSplashScreen, 500)
  // })

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!hydrated || !isNavigationStateRestored || !areFontsLoaded) return null

  const linking = {
    prefixes: [prefix],
    config,
  }

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <QueryClientProvider client={queryClient}>
          <IconRegistry icons={[EvaIconsPack, AssetIconsPack]} />

          <ApplicationProvider {...eva} theme={{ ...eva.light, ...mapping.strict, ...theme }}>
            <AppNavigator
              linking={linking}
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
          </ApplicationProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App

const useHydration = () => {
  const [hydrated, setHydrated] = useState(false)
  const { i18n } = useTranslation()

  useEffect(() => {
    // Note: This is just in case you want to take into account manual rehydration.
    // You can remove the following line if you don't need it.
    const unsubHydrate = useAppStore.persist.onHydrate(() => setHydrated(false))

    const unsubFinishHydration = useAppStore.persist.onFinishHydration(() => setHydrated(true))

    setHydrated(useAppStore.persist.hasHydrated())

    return () => {
      unsubHydrate()
      unsubFinishHydration()
    }
  }, [])

  useEffect(() => {
    if (hydrated) {
      const { lang } = useAppStore.getState()
      if (lang !== i18n.language) i18n.changeLanguage(lang)
    }
  }, [hydrated])

  return hydrated
}

// ================================================================================================

interface AppProps {
  hideSplashScreen: () => Promise<void>
}
