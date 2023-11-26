
import { useTheme } from '@ui-kitten/components'
import theme from './theme.json'

export function useAppTheme() {
  return useTheme() as unknown as AppTheme
}

// ================================================================================================

export type AppTheme = typeof theme
