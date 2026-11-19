import type { Role } from './types'

export function formatRoles(roles: Role[]): string {
  return roles.map((role) => role.name).join(', ')
}

export function errorMessage(detail: unknown): string {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((item: { loc?: unknown[]; msg?: string }) =>
        item.loc ? `${item.loc.at(-1)}: ${item.msg}` : String(item.msg),
      )
      .join('; ')
  }
  return 'Error inesperado'
}
