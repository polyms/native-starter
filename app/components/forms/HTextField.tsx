import { TxKeyPath, isRTL } from '~/i18n'

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
  ViewStyle,
} from 'react-native'
import styled from 'styled-components/native'

import { useAppTheme } from '~/theme'

import { Text, TextProps } from '../Text'

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
        <LabelText
          preset="formLabel"
          text={label}
          tx={labelTx}
          txOptions={labelTxOptions}
          {...labelTextProps}
        />
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
          placeholderTextColor={theme.light.secondaryColor}
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
        <HelpText
          preset="formHelper"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...helperTextProps}
        />
      )}
      {error && <ErrorText text={error.message} tx={(error.message || error.type) as TxKeyPath} />}
    </TouchableOpacity>
  )
}

const Wrapper = styled.View<FieldState>`
  flex-direction: row;
  align-items: flex-start;
  justifycontent: center;
  border-width: 1px;
  border-radius: 4px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.light.secondaryBg : theme.light.bodyBg};
  border-color: ${({ theme, focus, invalid }) => {
    if (invalid) return theme.light.formInvalidBorderColor
    if (focus) return theme.light.primary
    return theme.light.gray500
  }};
  overflow: hidden;
  padding: 8px;
`

const FocusLine = styled.View<FieldState>`
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  width: 4px;
  opacity: 0.7;
  border-radius: 2px;
  background-color: ${({ theme, focus, invalid }) => {
    if (invalid) return theme.light.formInvalidBorderColor
    if (focus) return theme.light.primary
    return 'transparent'
  }};
`

const AccessoryView = styled.View`
  min-height: 24px;
  justify-content: center;
  align-items: center;
  padding-left: 4px;
`

const InputControl = styled(TextInput)`
  flex: 1;
  font-size: 16px;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 0;
  align-self: stretch;
  font-family: spaceGroteskRegular;
  min-height: ${(props) => (props.multiline ? '112px' : '24px')};
`

const LabelText = styled(Text)`
  margin-top: 4px;
  margin-bottom: 4px;
`

const HelpText = styled(Text)`
  margin-top: 2px;
  color: ${({ theme }) => theme.light.secondaryColor};
`

const ErrorText = styled(Text)`
  margin-top: 2px;
  color: ${({ theme }) => theme.light.formInvalidColor};
`

// ================================================================================================

type FieldState = {
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
