import {
  Divider,
  Icon,
  List,
  ListItem,
  Radio,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageProps, ImageStyle, ViewStyle } from 'react-native'

import { Badge, Screen } from '~/components'
import { AppStackScreenProps } from '~/navigators'

const CloseIcon = (props: ImageProps) => {
  const { marginHorizontal: _, ...style } = props.style as ImageStyle
  return <Icon {...props} style={style} name="close" />
}

const data = [
  { lang: 'en', title: `EN • English` },
  { lang: 'ko', title: `KO • 한국인` },
  { lang: 'fr', title: `FR • Français` },
  { lang: 'ar', title: `AR • عربيي` },
]

export const LanguageScreen: FC<AppStackScreenProps<'LanguageModal'>> = ({ navigation }) => {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lang: string) =>
    lang === i18n.language
      ? navigation.goBack()
      : i18n.changeLanguage(lang).then(() => navigation.goBack())

  const renderCloseAction = () => (
    <TopNavigationAction icon={CloseIcon} onPress={() => navigation.goBack()} />
  )

  const renderCurrentLang = () => (
    <Badge status="info" style={styles.lang}>
      {i18n.language.toUpperCase()}
    </Badge>
  )

  const renderItem = ({ item }: { item: IListItem }): React.ReactElement => {
    return (
      <ListItem
        title={item.title}
        onPress={() => changeLanguage(item.lang)}
        accessoryRight={
          <Radio checked={item.lang === i18n.language} onChange={() => changeLanguage(item.lang)} />
        }
      />
    )
  }

  return (
    <Screen preset="fixed">
      <TopNavigation
        accessoryLeft={renderCloseAction}
        accessoryRight={renderCurrentLang}
        title={t('common.languages')}
      />
      <Divider />
      <List data={data} renderItem={renderItem} />
    </Screen>
  )
}

const styles = {
  lang: {
    marginRight: 12,
  } as ViewStyle,
}

// ================================================================================================

interface IListItem {
  title: string
  lang: string
}
