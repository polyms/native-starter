import { ImageStyle, TextStyle, ViewStyle } from 'react-native'

import { AppTheme, useAppTheme } from './useAppTheme'

export const useStyles = <T extends Record<string, ViewStyle | ImageStyle | TextStyle>>(
  styleBuilder: (theme: AppTheme) => T,
) => {
  const theme = useAppTheme()
  return styleBuilder(theme)
}
