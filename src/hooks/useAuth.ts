// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react'
import { APP_CONFIG } from '../constants'

interface Profile {
  id: string
  nickname: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  website?: string | null
  telegram?: string | null
  youtube?: string | null
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'AUTHOR' | 'MODERATOR' | 'ADMIN'
  profile: Profile | null
}

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isAuthenticated: false,
  })

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`${APP_CONFIG.apiUrl}/user/me`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setState({
          user: data.user,
          profile: data.user.profile,
          loading: false,
          isAuthenticated: true,
        })
      } else {
        setState({
          user: null,
          profile: null,
          loading: false,
          isAuthenticated: false,
        })
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setState({
        user: null,
        profile: null,
        loading: false,
        isAuthenticated: false,
      })
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    await fetchUser()
  }, [fetchUser])

  const logout = useCallback(async () => {
    try {
      await fetch(`${APP_CONFIG.apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      setState({
        user: null,
        profile: null,
        loading: false,
        isAuthenticated: false,
      })
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return {
    ...state,
    refreshProfile,
    logout,
  }
}
