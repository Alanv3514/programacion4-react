import type { User } from './types'

interface Props {
  user: User
  deleting: boolean
  onSelect: (id: number) => void
  onDelete: (user: User) => void
}

export function UserRow({ user, deleting, onSelect, onDelete }: Props) {
  return (
    <li>
      <button type="button" className="user-name" onClick={() => onSelect(user.id)}>
        {user.name}
      </button>
      <button
        type="button"
        className="danger"
        onClick={() => onDelete(user)}
        disabled={deleting}
      >
        {deleting ? 'Borrando...' : 'Borrar'}
      </button>
    </li>
  )
}
