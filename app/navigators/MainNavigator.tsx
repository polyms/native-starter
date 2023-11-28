import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps } from '@react-navigation/native'
import { Icon } from '@ui-kitten/components'
import { useTranslation } from 'react-i18next'
import { Pressable, TextStyle, ViewStyle } from 'react-native'

import { DemoCommunityScreen, DemoShowroomScreen, SettingsScreen } from '../screens'
import { DemoPodcastListScreen } from '../screens/DemoPodcastListScreen'
import { spacing, styled, typography, useAppTheme } from '../theme'
import { AppStackParamList, AppStackScreenProps } from './AppNavigator'

const Tab = createBottomTabNavigator<DemoTabParamList>()

export function MainNavigator() {
  const { t } = useTranslation()
  const theme = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: $tabBar,
        tabBarActiveTintColor: theme['color-warning-active'],
        tabBarInactiveTintColor: theme['text-basic-color'],
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
        tabBarButton(props) {
          return (
            <Pressable {...props}>
              {props.accessibilityState.selected && <FocusBorder />}
              {props.children}
            </Pressable>
          )
        },
      }}
    >
      <Tab.Screen
        name="DemoShowroom"
        component={DemoShowroomScreen}
        options={{
          tabBarLabel: t('mainNavigator.componentsTab'),
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="components"
              style={{ tintColor: color, height: size, width: size }}
              pack="assets"
            />
          ),
        }}
      />

      <Tab.Screen
        name="DemoCommunity"
        component={DemoCommunityScreen}
        options={{
          tabBarLabel: t('mainNavigator.communityTab'),
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="community"
              style={{ tintColor: color, height: size, width: size }}
              pack="assets"
            />
          ),
        }}
      />

      <Tab.Screen
        name="DemoPodcastList"
        component={DemoPodcastListScreen}
        options={{
          tabBarAccessibilityLabel: t('mainNavigator.podcastListTab'),
          tabBarLabel: t('mainNavigator.podcastListTab'),
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="podcast"
              style={{ tintColor: color, height: size, width: size }}
              pack="assets"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        navigationKey="Settings"
        options={{
          tabBarLabel: t('mainNavigator.settingsTab'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings-2-outline" fill={color} width={size} height={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const FocusBorder = styled.View((theme) => ({
  backgroundColor: theme['color-warning-default'],
  position: 'absolute',
  top: -3,
  left: '10%',
  right: '10%',
  height: 4,
  borderRadius: 4,
}))

const $tabBar: ViewStyle = {
  borderTopWidth: 2,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.xs,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: spacing.lg,
  flex: 1,
}

// @demo remove-file

// ================================================================================================

export type DemoTabParamList = {
  Settings: undefined
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoPodcastList: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>
