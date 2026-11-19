import { getAdults, getUsers, searchUsers } from '../api/users'
import type { NewUser, User } from '../api/types'

export type ListView =
  | { kind: 'all' }
  | { kind: 'search'; name: string }
  | { kind: 'adults' }

export const ALL: ListView = { kind: 'all' }
const ADULT_AGE = 18

export function fetchList(view: ListView): Promise<User[]> {
  switch (view.kind) {
    case 'all':
      return getUsers()
    case 'search':
      return searchUsers(view.name)
    case 'adults':
      return getAdults()
  }
}

export function sameView(a: ListView, b: ListView): boolean {
  if (a.kind === 'search' && b.kind === 'search') return a.name === b.name
  return a.kind === b.kind
}

export function matchesView(user: NewUser, view: ListView): boolean {
  switch (view.kind) {
    case 'all':
      return true
    case 'search':
      return user.name.toLowerCase().includes(view.name.toLowerCase())
    case 'adults':
      return user.age >= ADULT_AGE
  }
}

export function emptyMessage(view: ListView): string {
  switch (view.kind) {
    case 'all':
      return 'No hay usuarios.'
    case 'search':
      return `No hay usuarios que coincidan con “${view.name}”.`
    case 'adults':
      return 'No hay usuarios mayores de edad.'
  }
}
