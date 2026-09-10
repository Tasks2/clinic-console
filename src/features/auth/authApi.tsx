// import { apiFetch } from '../../lib/api'
// import type {AuthUser,LoginCredentials,LoginResponse,} from './authTypes'

// export async function login(
//   credentials: LoginCredentials,
// ): Promise<LoginResponse> {
//   return apiFetch('/auth/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(credentials),
//   })
// }

// export async function getCurrentUser(): Promise<AuthUser> {
//   return apiFetch('/auth/me', {
//     method: 'GET',
//   })
// }

// export async function refreshToken(
//   refreshToken: string,
// ): Promise<LoginResponse> {
//   return apiFetch('/auth/refresh', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       refreshToken,
//       expiresInMins: 30,
//     }),
//   })
// }

import { apiFetch } from '../../lib/api'
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from './authTypes'

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