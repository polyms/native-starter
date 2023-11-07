import { create } from 'zustand'

const getValidationError = (authEmail: string) => {
  if (authEmail.length === 0) return "can't be blank"
  if (authEmail.length < 6) return 'must be at least 6 characters'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return 'must be a valid email address'
  return ''
}

export const useAuthenticationStore = create<AuthenticationState>((set, get) => ({
  authToken: undefined,
  authEmail: '',
  validationError: undefined,
  // actions
  isAuthenticated: () => {
    return !!get().authToken
  },
  setAuthToken(value?: string) {
    set({
      authToken: value,
    })
  },
  setAuthEmail(value: string) {
    set({ authEmail: value.replace(/ /g, ''), validationError: getValidationError(value) })
  },
  logout() {
    set({ authToken: undefined, authEmail: '' })
  },
}))

// ================================================================================================

export interface AuthenticationState {
  authToken?: string
  authEmail: string
  validationError?: string
  // actions
  isAuthenticated: () => boolean
  setAuthToken: (value?: string) => void
  setAuthEmail: (value: string) => void
  logout: () => void
}
