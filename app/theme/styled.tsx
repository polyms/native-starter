import { Text, TextProps } from '@ui-kitten/components'
import { ComponentType } from 'react'
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { AppTheme, useAppTheme } from './useAppTheme'

export function styled<
  ComponentProps extends { style?: StyleProp<Style> | undefined },
  Style extends ViewStyle = ViewStyle,
  Type extends ComponentType<ComponentProps> = ComponentType<ComponentProps>,
  Props extends ComponentProps = ComponentProps,
>(WrappedComponent: Type, styleBuilder: (theme: AppTheme, props: Props) => Style) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const Component = (props) => {
    const theme = useAppTheme()
    const internalStyles = styleBuilder(theme, props)
    return <WrappedComponent {...props} style={[internalStyles, props.style] as StyleProp<Style>} />
  }
  Component.displayName = `withStyled(${displayName})` // as ComponentProps['style']<refer Style>

  return Component as IfEquals<Props, ComponentProps, Type, ComponentType<Props>>
}

styled.View = function styledView<T = ViewProps>(
  styleBuilder: (theme: AppTheme, props: T) => ViewStyle,
) {
  return styled<ViewProps, ViewStyle, typeof View, T>(View, styleBuilder)
}

styled.TextInput = function styledTextInput<T = TextInputProps>(
  styleBuilder: (theme: AppTheme, props: T) => TextStyle,
) {
  return styled<TextInputProps, TextStyle, typeof TextInput, T>(TextInput, styleBuilder)
}

styled.Text = function styledText<T = TextProps>(
  styleBuilder: (theme: AppTheme, props: T) => TextStyle,
) {
  return styled<TextProps, TextStyle, typeof Text, T>(Text, styleBuilder)
}

// ================================================================================================

type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
  G,
>() => G extends U ? 1 : 2
  ? Y
  : N
