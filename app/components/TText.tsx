import { TxKeyPath } from '~/i18n'

import classNames from 'classnames'
import { TOptions } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Text, TextProps } from 'react-native'

const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
}

const textWeights = {
  light: 'font-light font-sg-light',
  normal: 'font-normal font-sg-normal',
  medium: 'font-medium font-sg-medium',
  semiBold: 'font-semiBold font-sg-semiBold',
  bold: 'font-bold font-sg-bold',
}

export function TText({
  tx,
  txOptions,
  text,
  children,
  className,
  size = 'base',
  weight = 'normal',
  ...rest
}: TTextProps) {
  const { t } = useTranslation()
  const i18nText = tx && t(tx, txOptions)
  const content = i18nText || text || children

  return (
    <Text className={classNames(className, textSizes[size], textWeights[weight])} {...rest}>
      {content}
    </Text>
  )
}

// ================================================================================================

export interface TTextProps extends TextProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TOptions

  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'

  weight?: 'light' | 'normal' | 'medium' | 'semiBold' | 'bold'
}
