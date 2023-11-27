import { isRTL } from '~/i18n'

import { ComponentType, useImperativeHandle, useRef, useState } from 'react'
import { FieldValues, UseControllerProps, useController } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  ImageProps,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { styled, useAppTheme } from '~/theme'

import { TextProps } from '../Text'

/**
 * A component that allows for the entering and editing of text.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-TextField.md)
 */
export const HTextField = function TextField(
  props: UseControllerProps<FieldValues> & HTextFieldProps,
) {
  const {
    labelTx,
    label,
    labelTxOptions,
    placeholderTx,
    placeholder,
    placeholderTxOptions,
    helper,
    helperTx,
    helperTxOptions,
    accessoryRight: AccessoryRight,
    accessoryLeft: AccessoryLeft,
    helperTextProps,
    labelTextProps,
    style: $inputStyle,
    containerStyle,
    inputWrapperStyle,
    disabled,
    ...inputProps
  } = props
  const {
    field,
    fieldState: { invalid, error },
  } = useController(props)
  const theme = useAppTheme()

  const input = useRef<TextInput>()
  const [isFocus, setFocus] = useState(false)
  const { t } = useTranslation()

  const placeholderContent = placeholderTx ? t(placeholderTx, placeholderTxOptions) : placeholder

  function focusInput() {
    if (disabled) return

    input.current?.focus()
  }

  useImperativeHandle(field.ref, () => input.current)

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={containerStyle}
      onPress={focusInput}
      accessibilityState={{ disabled }}
    >
      {!!(label || labelTx) && (
        <LabelText category="label" {...labelTextProps}>
          {labelTx ? t(labelTx, labelTxOptions) : label}
        </LabelText>
      )}

      <Wrapper style={inputWrapperStyle} invalid={invalid} focus={isFocus} disabled={disabled}>
        {isFocus && <FocusLine invalid={invalid} focus={isFocus} />}

        {!!AccessoryLeft && (
          <AccessoryView>
            <AccessoryLeft disabled={disabled} multiline={inputProps.multiline} invalid={invalid} />
          </AccessoryView>
        )}

        <InputControl
          ref={input}
          value={field.value}
          onChangeText={field.onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => {
            setFocus(false)
            field.onBlur()
          }}
          underlineColorAndroid="transparent" // 'rgba(0, 0, 0, 0)'
          textAlignVertical="top"
          placeholder={placeholderContent}
          placeholderTextColor={theme['color-basic-500']}
          textAlign={isRTL() ? 'right' : 'left'}
          {...inputProps}
          editable={!disabled}
          style={$inputStyle}
        />

        {!!AccessoryRight && (
          <AccessoryView>
            <AccessoryRight
              disabled={disabled}
              multiline={inputProps.multiline}
              invalid={invalid}
            />
          </AccessoryView>
        )}
      </Wrapper>
      {!!(helper || helperTx) && (
        <HelpText category="c2" appearance="hint" {...helperTextProps}>
          {helperTx ? t(helperTx, helperTxOptions) : helper}
        </HelpText>
      )}
      {error && <HelpText status="danger">{t(error.message || error.type)}</HelpText>}
    </TouchableOpacity>
  )
}

const Wrapper = styled.View<FieldState>((theme, { disabled, focus, invalid }) => ({
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifycontent: 'center',
  borderWidth: 1,
  borderRadius: 4,
  backgroundColor: disabled ? theme['color-basic-disabled'] : theme['background-basic-color-1'],
  borderColor: (() => {
    if (invalid) return theme['color-danger-default-border']
    if (focus) return theme['color-primary-default-border']
    return theme['color-basic-transparent-default-border']
  })(),
  overflow: 'hidden',
  padding: 8,
}))

const FocusLine = styled.View<FieldState>((theme, { focus, invalid }) => ({
  position: 'absolute',
  top: 2,
  bottom: 2,
  left: 2,
  width: 4,
  opacity: 0.7,
  borderRadius: 2,
  backgroundColor: (() => {
    if (invalid) return theme['color-danger-default-border']
    if (focus) return theme['color-primary-default-border']
    return 'transparent'
  })(),
}))

const AccessoryView = styled.View(() => ({
  minHeight: 24,
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: 4,
}))

const InputControl = styled.TextInput((theme, { multiline }) => ({
  flex: 1,
  fontSize: 16,
  paddingLeft: 4,
  paddingRight: 4,
  paddingTop: 0,
  alignSelf: 'stretch',
  fontFamily: theme['text-font-family'],
  minHeight: multiline ? 112 : 24,
}))

const LabelText = styled.Text(() => ({
  marginTop: 4,
  marginBottom: 4,
}))

const HelpText = styled.Text(() => ({
  marginTop: 2,
}))

// ================================================================================================

interface FieldState extends ViewProps {
  invalid: boolean
  focus: boolean
  disabled?: boolean
}

export interface HTextFieldAccessoryProps extends Omit<ImageProps, 'source'> {
  multiline: boolean
  disabled: boolean
  invalid: boolean
}

export interface HTextFieldProps
  extends Omit<TextInputProps, 'ref' | 'value' | 'onChange' | 'onBlur' | 'editable'> {
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps['text']
  /**
   * Label text which is looked up via i18n.
   */
  labelTx?: TextProps['tx']
  /**
   * Optional label options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  labelTxOptions?: TextProps['txOptions']
  /**
   * Pass any additional props directly to the label Text component.
   */
  labelTextProps?: TextProps
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: TextProps['text']
  /**
   * Helper text which is looked up via i18n.
   */
  helperTx?: TextProps['tx']
  /**
   * Optional helper options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  helperTxOptions?: TextProps['txOptions']
  /**
   * Pass any additional props directly to the helper Text component.
   */
  helperTextProps?: TextProps
  /**
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: TextProps['text']
  /**
   * Placeholder text which is looked up via i18n.
   */
  placeholderTx?: TextProps['tx']
  /**
   * Optional placeholder options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  placeholderTxOptions?: TextProps['txOptions']
  /**
   * Optional input style override.
   */
  style?: StyleProp<TextStyle>
  /**
   * Style overrides for the container
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Style overrides for the input wrapper
   */
  inputWrapperStyle?: StyleProp<ViewStyle>
  /**
   * An optional component to render on the right side of the input.
   * Example: `accessoryRight={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  accessoryRight?: ComponentType<HTextFieldAccessoryProps>
  /**
   * An optional component to render on the left side of the input.
   * Example: `accessoryLeft={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  accessoryLeft?: ComponentType<HTextFieldAccessoryProps>
}
