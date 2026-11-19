import { apiFetch } from './client'
import type { CreatedResponse, MessageResponse, User, UserDetail, UserPayload } from './types'

export const COUNTRIES = [
  { id: 1, name: 'Argentina' },
  { id: 2, name: 'Brasil' },
]

export const getUsers = () => apiFetch<User[]>('/user')

export const getUser = (id: number) => apiFetch<UserDetail>(`/user/${id}`)

export const getMyId = () => apiFetch<{ id: number }>('/user/me/id')

export const getMe = () => getMyId().then(({ id }) => getUser(id))

export const searchUsers = (name: string) =>
  apiFetch<User[]>(`/user/search/${encodeURIComponent(name)}`)

export const getAdults = () => apiFetch<User[]>('/user_mayores')

export const createUser = (user: UserPayload) =>
  apiFetch<CreatedResponse>('/user', { method: 'POST', body: user })

export const deleteUser = (id: number) =>
  apiFetch<MessageResponse>(`/user/${id}`, { method: 'DELETE' })
