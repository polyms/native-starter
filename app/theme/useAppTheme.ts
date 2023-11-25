import { useTheme } from 'styled-components/native'

import theme from './theme.json'

export function useAppTheme() {
  return useTheme() as AppTheme
}

// ================================================================================================

export type AppTheme = typeof theme
