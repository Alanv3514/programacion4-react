import type { User } from '../api/types'
import { initials } from '../utils/format'

interface Props {
  user: User
  selected: boolean
  deleting: boolean
  onSelect: (id: number) => void
  onDelete: (user: User) => void
}

export function UserRow({ user, selected, deleting, onSelect, onDelete }: Props) {
  return (
    <li className={selected ? 'user-row selected' : 'user-row'}>
      <button
        type="button"
        className="user-select"
        aria-current={selected || undefined}
        onClick={() => onSelect(user.id)}
      >
        <span className="avatar" aria-hidden="true">
          {initials(user.name)}
        </span>
        <span>{user.name}</span>
      </button>
      <button
        type="button"
        className="btn-danger"
        onClick={() => onDelete(user)}
        disabled={deleting}
        aria-label={`Borrar a ${user.name}`}
      >
        {deleting ? 'Borrando...' : 'Borrar'}
      </button>
    </li>
  )
}
