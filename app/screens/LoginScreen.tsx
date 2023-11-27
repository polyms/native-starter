import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Icon, Text } from '@ui-kitten/components'
import { FC, useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TouchableWithoutFeedback } from 'react-native'
import * as y from 'yup'

import { Screen } from '~/components'
import { HTextField } from '~/components/forms'
import { AppStackScreenProps } from '~/navigators'
import { useAuthenticationStore } from '~/stores/authentication.store'
import { spacing, useAppTheme, useStyles } from '~/theme'

const schema = y.object({
  email: y.string().required('Email is required').email('Invalid email format'),
  password: y
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export const LoginScreen: FC<LoginScreenProps> = (_props) => {
  const { t } = useTranslation()
  const theme = useAppTheme()
  const styles = withStyles()
  const { authEmail, setAuthEmail, setAuthToken } = useAuthenticationStore()
  const {
    control,
    handleSubmit,
    reset,
    formState: { submitCount },
  } = useForm<FormType>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      email: authEmail || 'user@polyms.app',
      password: 'polymsIsAwes0m3',
    },
  })

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)

  // useEffect(() => {
  //   // Return a "cleanup" function that React will run when the component unmounts
  //   return () => {
  //     setAuthPassword('')
  //     setAuthEmail('')
  //   }
  // }, [])

  const login: SubmitHandler<FormType> = (data) => {
    console.info('Login: ', data)

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    reset()

    // We'll mock this with a fake token.
    setAuthEmail(data.email)
    setAuthToken(String(Date.now()))
  }

  const PasswordRightAccessory = useCallback(
    () => (
      <TouchableWithoutFeedback onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}>
        <Icon
          name={isAuthPasswordHidden ? 'eye-outline' : 'eye-off-outline'}
          width={24}
          height={24}
          fill={theme['color-basic-600']}
        />
      </TouchableWithoutFeedback>
    ),
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="auto"
      backgroundColor={theme['background-basic-color-3']}
      contentContainerStyle={styles.screenContentContainer}
      safeAreaEdges={['top', 'bottom']}
    >
      <Text style={styles.signIn} category="h1" testID="login-heading">
        {t('loginScreen.signIn')}
      </Text>
      <Text style={styles.enterDetails} category="s1">
        {t('loginScreen.enterDetails')}
      </Text>
      {submitCount > 2 && (
        <Text category="c1" style={styles.hint} status="danger">
          {t('loginScreen.hint')}
        </Text>
      )}

      <HTextField
        name="email"
        control={control}
        containerStyle={styles.textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
      />

      <HTextField
        name="password"
        control={control}
        containerStyle={styles.textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen.passwordFieldLabel"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        onSubmitEditing={handleSubmit(login)}
        accessoryRight={PasswordRightAccessory}
        // onSubmitEditing={() => authPasswordInput.current?.focus()}
      />
      <Button testID="login-button" size="large" status="basic" onPress={handleSubmit(login)}>
        {t('loginScreen.tapToSignIn')}
      </Button>
    </Screen>
  )
}

const withStyles = () =>
  useStyles(() => ({
    screenContentContainer: {
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.lg,
    },
    signIn: {
      marginBottom: spacing.sm,
    },
    enterDetails: {
      marginBottom: spacing.lg,
    },
    hint: {
      marginBottom: spacing.md,
      opacity: 0.8,
    },
    textField: {
      marginBottom: spacing.lg,
    },
  }))

// ================================================================================================

interface LoginScreenProps extends AppStackScreenProps<'Login'> {}

export type FormType = y.InferType<typeof schema>
