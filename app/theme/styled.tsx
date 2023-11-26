import { Text, TextProps } from '@ui-kitten/components'
import { ComponentType, forwardRef } from 'react'
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
>(WrappedComponent: Type, styleBuilder: (theme: AppTheme, props: ComponentProps) => Style) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  // let Component: any = (props) => {
  //   const theme = useAppTheme()
  //   const internalStyles = styleBuilder(theme, props)
  //   return <>
  //       <Text>{JSON.stringify(instanceof WrappedComponent)}</Text>
  //   <WrappedComponent {...props} style={[internalStyles, props.style] as StyleProp<Style>} />
  //   </>
  // }
  // eslint-disable-next-line react/display-name
  const Component = forwardRef<typeof WrappedComponent, ComponentProps>((forwardProps, ref) => {
    const theme = useAppTheme()
    const internalStyles = styleBuilder(theme, forwardProps)
    return (
      <WrappedComponent
        {...(forwardProps as any)}
        style={[internalStyles, forwardProps.style] as StyleProp<Style>}
        ref={WrappedComponent.propTypes ? ref : null}
      />
    )
  })
  console.log(WrappedComponent.prototype?.isReactComponent)
  Component.displayName = `withStyled(${displayName})` // as ComponentProps['style']<refer Style>

  return Component as unknown as IfEquals<Props, ComponentProps, Type, ComponentType<Props>>
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
