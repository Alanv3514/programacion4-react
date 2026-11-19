import { useEffect, useState } from 'react'
import { CreateUserForm } from './CreateUserForm'
import { formatRoles } from './format'
import type { NewUser, User, UserDetail as UserDetailData } from './types'
import { SearchForm } from './SearchForm'
import { UserDetail } from './UserDetail'

type ListView =
  | { kind: 'all' }
  | { kind: 'search'; name: string }
  | { kind: 'adults' }

const ALL: ListView = { kind: 'all' }
const ADULT_AGE = 18

function listUrl(view: ListView): string {
  const api = import.meta.env.VITE_API_URL
  switch (view.kind) {
    case 'all':
      return `${api}/user`
    case 'search':
      return `${api}/user/search/${encodeURIComponent(view.name)}`
    case 'adults':
      return `${api}/user_mayores`
  }
}

function matchesView(user: NewUser, view: ListView): boolean {
  switch (view.kind) {
    case 'all':
      return true
    case 'search':
      return user.name.toLowerCase().includes(view.name.toLowerCase())
    case 'adults':
      return user.age >= ADULT_AGE
  }
}

function emptyMessage(view: ListView): string {
  switch (view.kind) {
    case 'all':
      return 'No hay usuarios.'
    case 'search':
      return `No hay usuarios que coincidan con “${view.name}”.`
    case 'adults':
      return 'No hay usuarios mayores de edad.'
  }
}

export function UserList({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<UserDetailData | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [view, setView] = useState<ListView>(ALL)

  useEffect(() => {
    let ignore = false

    fetch(listUrl(view), { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json()
        if (ignore) return
        if (!response.ok) {
          setError(data.detail)
          return
        }
        setUsers(data)
      })
      .catch(() => {
        if (!ignore) setError('No se pudo conectar con la API')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [token, view])

  function changeView(newView: ListView) {
    if (listUrl(newView) === listUrl(view)) return
    setLoading(true)
    setError(null)
    setView(newView)
  }

  function handleCreated(user: NewUser) {
    if (!matchesView(user, view)) return
    setUsers((prev) => [...prev, { id: user.id, name: user.name }])
  }

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` }
    const api = import.meta.env.VITE_API_URL
    fetch(`${api}/user/me/id`, { headers })
      .then((response) => response.json())
      .then(({ id }) => fetch(`${api}/user/${id}`, { headers }))
      .then((response) => response.json())
      .then(setMe)
  }, [token])

  return (
    <>
      <h2 className="greeting">
        Hola, {me?.name}
        {me && me.roles.length > 0 && ` (${formatRoles(me.roles)})`}
      </h2>
      <CreateUserForm token={token} onCreated={handleCreated} />
      <div className="columns">
        <section className="card">
          <h2>Usuarios</h2>
          <div className="toolbar">
            <SearchForm
              onSearch={(name) => changeView({ kind: 'search', name })}
              onClear={() => changeView(ALL)}
            />
            <div className="row">
              <button
                type="button"
                onClick={() => changeView(view.kind === 'adults' ? ALL : { kind: 'adults' })}
              >
                {view.kind === 'adults' ? 'Todos' : 'Solo mayores'}
              </button>
              <span className="muted">
                Mostrando: {view.kind === 'adults' ? 'solo mayores de edad' : 'todos'}
              </span>
            </div>
          </div>
          {loading && <p className="muted">Cargando...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && users.length === 0 && (
            <p className="muted">{emptyMessage(view)}</p>
          )}
          {!loading && !error && users.length > 0 && (
            <ul className="user-list">
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    className="user-name"
                    onClick={() => setSelectedId(user.id)}
                  >
                    {user.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card">
          <h2>Detalle</h2>
          {selectedId !== null ? (
            <UserDetail key={selectedId} token={token} userId={selectedId} />
          ) : (
            <p className="muted">Hacé clic en un nombre para ver sus datos.</p>
          )}
        </section>
      </div>
    </>
  )
}
