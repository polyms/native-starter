import { isRTL } from '~/i18n'

import { Button, Text } from '@ui-kitten/components'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

// @demo remove-current-line
import { AppStackScreenProps } from '~/navigators'
import { useAuthenticationStore } from '~/stores/authentication.store'
// @demo remove-current-line
import { AppTheme, spacing, useStyles } from '~/theme'
import { useHeader } from '~/utils/useHeader'
// @demo remove-current-line
import { useSafeAreaInsetsStyle } from '~/utils/useSafeAreaInsetsStyle'

import welcomeLogo from '../../assets/images/logo.png'
import welcomeFace from '../../assets/images/welcome-face.png'

export const WelcomeScreen = (
  { navigation }: WelcomeScreenProps, // @demo remove-current-line
) => {
  const styles = withStyles()
  const { t } = useTranslation()
  // @demo remove-block-start
  const { logout } = useAuthenticationStore()

  function goNext() {
    navigation.navigate('Main', { screen: 'Settings' })
  }

  useHeader(
    {
      rightTx: 'common.logOut',
      onRightPress: logout,
    },
    [logout],
  )
  // @demo remove-block-end

  const $bottomContainerInsets = useSafeAreaInsetsStyle(['bottom'])

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image style={styles.welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <Text category="h1" style={styles.welcomeHeading}>
          {t('welcomeScreen.readyForLaunch')}
        </Text>
        <Text category="s1">{t('welcomeScreen.exciting')}</Text>

        <Image style={styles.welcomeFace} source={welcomeFace} resizeMode="contain" />
      </View>

      <View style={[styles.bottomContainer, $bottomContainerInsets]}>
        <Text category="c1" style={styles.postScript}>
          {t('welcomeScreen.postscript')}
        </Text>
        {/* @demo remove-block-start */}
        <Button testID="next-screen-button" status="basic" size="large" onPress={goNext}>
          {t('welcomeScreen.letsGo')}
        </Button>
        {/* @demo remove-block-end */}
      </View>
    </View>
  )
}

const withStyles = () =>
  useStyles((theme: AppTheme) => ({
    container: {
      flex: 1,
      backgroundColor: theme['background-basic-color-3'],
    },
    topContainer: {
      flexShrink: 1,
      flexGrow: 1,
      flexBasis: '57%',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    bottomContainer: {
      flexShrink: 1,
      flexGrow: 0,
      flexBasis: '43%',
      backgroundColor: theme['color-basic-100'],
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: spacing.lg,
      justifyContent: 'space-around',
    },
    welcomeLogo: {
      height: 130,
      width: '100%',
      marginBottom: spacing.xl,
    },
    welcomeFace: {
      height: 169,
      width: 269,
      position: 'absolute',
      bottom: -47,
      right: -80,
      transform: [{ scaleX: isRTL() ? -1 : 1 }],
    },
    welcomeHeading: {
      marginBottom: spacing.md,
    },
    postScript: {
      lineHeight: 26,
    },
  }))

// ================================================================================================

interface WelcomeScreenProps extends AppStackScreenProps<'Welcome'> {}
