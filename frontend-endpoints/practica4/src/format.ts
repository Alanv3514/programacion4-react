import type { Role } from './types'

export function formatRoles(roles: Role[]): string {
  return roles.map((role) => role.name).join(', ')
}
