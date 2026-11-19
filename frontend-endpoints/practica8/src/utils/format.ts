import type { Role } from '../api/types'

export function formatRoles(roles: Role[]): string {
  return roles.map((role) => role.name).join(', ')
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}
