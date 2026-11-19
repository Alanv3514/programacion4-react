import { useEffect, useState } from 'react'
import { formatRoles } from './format'
import type { User, UserDetail as UserDetailData } from './types'
import { SearchForm } from './SearchForm'
import { UserDetail } from './UserDetail'

export function UserList({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<UserDetailData | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const api = import.meta.env.VITE_API_URL
    const url = query
      ? `${api}/user/search/${encodeURIComponent(query)}`
      : `${api}/user`
    let ignore = false

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
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
  }, [token, query])

  function applyQuery(newQuery: string) {
    if (newQuery === query) return
    setLoading(true)
    setError(null)
    setQuery(newQuery)
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
      <h2 className="greeting">Hola, {me?.name}
        {me && me.roles.length > 0 && ` (${formatRoles(me.roles)})`}
      </h2>
      <div className="columns">
        <section className="card">
          <h2>Usuarios</h2>
          <div className="toolbar">
            <SearchForm onSearch={applyQuery} onClear={() => applyQuery('')} />
          </div>
          {loading && <p className="muted">Cargando...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && users.length === 0 && (
            <p className="muted">
              {query ? `No hay usuarios que coincidan con “${query}”.` : 'No hay usuarios.'}
            </p>
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
