import { Button, Divider, Icon, List, ListItem, Text } from '@ui-kitten/components'
import * as Application from 'expo-application'
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageStyle, Linking, Text as RNText } from 'react-native'

import { Screen } from '~/components'
import { Badge } from '~/components/Badge'
import { DemoTabScreenProps } from '~/navigators/MainNavigator'
import { useAuthenticationStore } from '~/stores/authentication.store'
import { spacing, useStyles } from '~/theme'

function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
}

const iconMap = {
  'App Id': 'cube-outline',
  'App Name': 'info-outline',
  'App Version': 'copy-outline',
  'App Build Version': 'layers-outline',
}

export const SettingsScreen: FC<DemoTabScreenProps<'Settings'>> = ({ navigation }) => {
  const { logout } = useAuthenticationStore()
  const styles = withStyles()
  const { t, i18n } = useTranslation()

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
        const { marginHorizontal } = props.style as ImageStyle
        return <RNText style={{ marginHorizontal }}>{item.value}</RNText>
      }}
    />
  )

  return (
    <Screen preset="scroll" safeAreaEdges={['top']}>
      <Text style={styles.title} category="h1">
        {t('settingsScreen.title')}
      </Text>

      <Divider />

      <List data={data} renderItem={renderItem} scrollEnabled={false} />

      <ListItem
        title="Hermes Enabled"
        accessoryLeft={(props) => {
          const { tintColor: _, ...style } = props.style as ImageStyle
          return <Icon name="hermes" {...props} style={style} pack="assets" />
        }}
        accessoryRight={<Badge status="info">{String(usingHermes).toUpperCase()}</Badge>}
      />

      <Divider />

      <ListItem
        title={t('settingsScreen.language')}
        onPress={() => navigation.navigate('LanguageModal')}
        accessoryLeft={(props) => {
          return <Icon name="globe-outline" {...props} />
        }}
        // accessoryRight={<Badge>{i18n.language.toUpperCase()}</Badge>}
        accessoryRight={(props) => {
          const { marginHorizontal, ...style } = props.style as ImageStyle
          return (
            <>
              <RNText style={{ marginHorizontal }}>{i18n.language.toUpperCase()}</RNText>
              <Icon style={style} name="chevron-right" />
            </>
          )
        }}
      />

      <ListItem
        title={t('settingsScreen.reportBugs')}
        onPress={() => openLinkInBrowser('https://github.com/polyms/native-starter/issues')}
        accessoryLeft={(props) => {
          const { tintColor: _, ...style } = props.style as ImageStyle
          return <Icon name="ladybug" {...props} style={style} pack="assets" />
        }}
      />

      <Button
        size="large"
        appearance="outline"
        status="danger"
        style={styles.logout}
        onPress={logout}
      >
        {t('common.logOut')}
      </Button>
    </Screen>
  )
}

const withStyles = () =>
  useStyles(() => ({
    list: {
      flexGrow: 0,
    },
    title: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.xl,
      marginBottom: spacing.xs,
    },
    logout: {
      marginTop: spacing.xl,
      marginHorizontal: spacing.md,
    },
  }))

// ================================================================================================

interface IListItem {
  title: string
  description?: string
  value: string
}
