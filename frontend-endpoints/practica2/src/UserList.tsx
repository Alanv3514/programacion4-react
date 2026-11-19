import { useEffect, useState } from 'react'
import type { User } from './types'
import { UserDetail } from './UserDetail'

export function UserList({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<User | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) {
          setError(data.detail)
          return
        }
        setUsers(data)
      })
      .catch(() => setError('No se pudo conectar con la API'))
      .finally(() => setLoading(false))
  }, [token])

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
      <h2 className="greeting">Hola, {me?.name}</h2>
      <div className="columns">
        <section className="card">
          <h2>Usuarios</h2>
          {loading && <p className="muted">Cargando...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
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
