import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Text } from '@ui-kitten/components'
import { FC, useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TextStyle, ViewStyle } from 'react-native'
import * as y from 'yup'

import { HTextFieldAccessoryProps, Icon, Screen } from '~/components'
import { HTextField } from '~/components/forms'
import { AppStackScreenProps } from '~/navigators'
import { useAuthenticationStore } from '~/stores/authentication.store'
import { spacing, useAppTheme } from '~/theme'

const schema = y.object({
  email: y.string().required('Email is required').email('Invalid email format'),
  password: y
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export type FormType = y.InferType<typeof schema>

export const LoginScreen: FC<LoginScreenProps> = (_props) => {
  const { t } = useTranslation()
  const theme = useAppTheme()
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
    (props: HTextFieldAccessoryProps) => {
      return (
        <Icon
          {...props}
          icon={isAuthPasswordHidden ? 'view' : 'hidden'}
          color={theme['color-basic-600']}
          containerStyle={props.style}
          size={20}
          onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
        />
      )
    },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={['top', 'bottom']}
    >
      <Text style={$signIn} category="h1" testID="login-heading">
        {t('loginScreen.signIn')}
      </Text>
      <Text style={$enterDetails} category="s1">
        {t('loginScreen.enterDetails')}
      </Text>
      {submitCount > 2 && (
        <Text category="c1" style={$hint} status="danger">
          {t('loginScreen.hint')}
        </Text>
      )}

      <HTextField
        name="email"
        control={control}
        containerStyle={$textField}
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
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen.passwordFieldLabel"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        onSubmitEditing={handleSubmit(login)}
        accessoryRight={PasswordRightAccessory}
        // accessoryRight={(props) => (
        //   <TouchableWithoutFeedback onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}>
        //     <UIIcon {...props} name={!isAuthPasswordHidden ? 'eye-off' : 'eye'} />
        //   </TouchableWithoutFeedback>
        // )}
        // onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <Button testID="login-button" size="large" status="basic" onPress={handleSubmit(login)}>
        {t('loginScreen.tapToSignIn')}
      </Button>
    </Screen>
  )
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $hint: TextStyle = {
  marginBottom: spacing.md,
  opacity: 0.8,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

// ================================================================================================

interface LoginScreenProps extends AppStackScreenProps<'Login'> {}
