import { Divider, Icon, List, ListItem, Text } from '@ui-kitten/components'
import * as Application from 'expo-application'
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageStyle, Linking, Text as RNText, TextStyle } from 'react-native'

import { Screen } from '~/components'
import { DemoTabScreenProps } from '~/navigators/MainNavigator'
import { useAuthenticationStore } from '~/stores/authentication.store'
import { spacing, useAppTheme, useStyles } from '~/theme'

function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
}

const iconMap = {
  'App Id': 'cube-outline',
  'App Name': 'info-outline',
  'App Version': 'copy-outline',
  'App Build Version': 'layers-outline',
}

export const SettingsScreen: FC<DemoTabScreenProps<'Settings'>> = (_props) => {
  const { logout } = useAuthenticationStore()
  const styles = withStyles()
  const theme = useAppTheme()
  const { t } = useTranslation()

  const usingHermes = typeof HermesInternal === 'object' && HermesInternal !== null

  const data = useMemo<IListItem[]>(
    () => [
      { title: 'App Id', value: Application.applicationId },
      { title: 'App Name', value: Application.applicationName },
      { title: 'App Version', value: Application.nativeApplicationVersion },
      { title: 'App Build Version', value: Application.nativeBuildVersion },
    ],
    [],
  )

  const renderItem = ({ item }: { item: IListItem; index: number }): React.ReactElement => (
    <ListItem
      title={item.title}
      accessoryLeft={(props) => <Icon {...props} name={iconMap[item.title]} />}
      accessoryRight={(props) => {
        const { tintColor: _, width: __, ...style } = props.style as ImageStyle
        return (
          <RNText {...props} style={style}>
            {item.value}
          </RNText>
        )
      }}
    />
  )

  return (
    <Screen preset="scroll" safeAreaEdges={['top']} contentContainerStyle={styles.container}>
      <Text style={styles.title} category="h1">
        {t('settingsScreen.title')}
      </Text>

      <Divider />

      <List data={data} renderItem={renderItem} />

      <ListItem
        title="Hermes Enabled"
        accessoryLeft={(props) => {
          const { tintColor: _, ...style } = props.style as ImageStyle
          return <Icon name="hermes" {...props} style={style} pack="assets" />
        }}
        accessoryRight={(props) => {
          const { tintColor: _, width: __, ...style } = props.style as ImageStyle
          return (
            <Text category="label" status="info" {...props} style={[style, styles.badge]}>
              {String(usingHermes).toUpperCase()}
            </Text>
          )
        }}
      />

      <Divider />

      <ListItem
        title={t('settingsScreen.reportBugs')}
        onPress={() => openLinkInBrowser('https://github.com/polyms/native-starter/issues')}
        accessoryLeft={(props) => {
          const { tintColor: _, ...style } = props.style as ImageStyle
          return <Icon name="ladybug" {...props} style={style} pack="assets" />
        }}
      />

      <Divider />

      <ListItem
        title={(evaProps) => (
          <Text
            {...evaProps}
            style={[...(evaProps.style as TextStyle[]), { color: theme['text-danger-color'] }]}
          >
            {t('common.logOut')}
          </Text>
        )}
        onPress={logout}
        accessoryLeft={(props) => (
          <Icon name="log-out" {...props} fill={theme['text-danger-color']} />
        )}
      />
    </Screen>
  )
}

const withStyles = () =>
  useStyles((theme) => ({
    container: {
      paddingTop: spacing.lg + spacing.xl,
      paddingBottom: spacing.xxl,
    },
    title: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xxl,
    },
    badge: {
      paddingHorizontal: 4,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme['color-info-500'],
      width: 'auto',
    },
  }))

// ================================================================================================

interface IListItem {
  title: string
  description?: string
  value: string
}
