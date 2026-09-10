import { apiFetch } from '../../lib/api'
import type { AuthUser, LoginCredentials, LoginResponse } from './authTypes'

export function login(credentials: LoginCredentials) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
}

export function getCurrentUser(token: string) {
  return apiFetch<AuthUser>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function refreshToken(token: string) {
  return apiFetch<LoginResponse>('/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken: token,
      expiresInMins: 1,
    }),
  })
}
