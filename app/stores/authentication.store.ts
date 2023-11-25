import { create } from 'zustand'

export const useAuthenticationStore = create<AuthenticationState>((set, get) => ({
  authToken: undefined,
  authEmail: '',
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
    set({ authEmail: value.replace(/ /g, '') })
  },
  logout() {
    set({ authToken: undefined, authEmail: '' })
  },
}))

// ================================================================================================

export interface AuthenticationState {
  authToken?: string
  authEmail: string
  // actions
  isAuthenticated: () => boolean
  setAuthToken: (value?: string) => void
  setAuthEmail: (value: string) => void
  logout: () => void
}
