import type { UserDetail } from '../api/types'
import { formatRoles } from '../utils/format'

interface Props {
  me: UserDetail | null
  onLogout: () => void
}

export function Topbar({ me, onLogout }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <h1>
          Hola, {me?.name ?? '…'}
          {me && me.roles.length > 0 && (
            <span className="muted"> ({formatRoles(me.roles)})</span>
          )}
        </h1>
        <button className="btn-secondary" type="button" onClick={onLogout}>
          Salir
        </button>
      </div>
    </header>
  )
}
