import { Text, TextProps } from '@ui-kitten/components'
import { ImageStyle, TextStyle } from 'react-native'

import { useAppTheme } from '~/theme'

export function Badge(props: BadgeProps) {
  const { status } = props
  const theme = useAppTheme()
  const { tintColor: _, width: __, ...style } = (props.style || {}) as ImageStyle

  return (
    <Text
      category="label"
      {...props}
      style={[style, $badgeStyle, { borderColor: theme[`color-${status}-default`] }]}
    />
  )
}

const $badgeStyle: TextStyle = {
  paddingHorizontal: 4,
  borderRadius: 4,
  borderWidth: 2,
  width: 'auto',
}

// ================================================================================================

export interface BadgeProps extends TextProps {}
