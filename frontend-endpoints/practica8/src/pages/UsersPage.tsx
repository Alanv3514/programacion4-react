import { useState } from 'react'
import { deleteUser, getMe } from '../api/users'
import type { NewUser, User } from '../api/types'
import { CreateUserForm } from '../components/CreateUserForm'
import { SearchForm } from '../components/SearchForm'
import { Topbar } from '../components/Topbar'
import { UserDetail } from '../components/UserDetail'
import { UserRow } from '../components/UserRow'
import { useFetch } from '../hooks/useFetch'
import { ALL, emptyMessage, fetchList, matchesView, sameView } from '../utils/listView'
import type { ListView } from '../utils/listView'

interface Props {
  onLogout: () => void
}

export function UsersPage({ onLogout }: Props) {
  const [view, setView] = useState<ListView>(ALL)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { data: me } = useFetch(getMe, [])
  const { data: users, error, loading, setData: setUsers } = useFetch(
    () => fetchList(view),
    [view],
  )

  function changeView(newView: ListView) {
    if (sameView(newView, view)) return
    setDeleteError(null)
    setView(newView)
  }

  function handleCreated(user: NewUser) {
    if (!matchesView(user, view)) return
    setUsers((prev) => [...(prev ?? []), { id: user.id, name: user.name }])
  }

  async function handleDelete(user: User) {
    if (!window.confirm(`¿Borrar a ${user.name}?`)) return
    setDeleteError(null)
    setDeletingId(user.id)
    try {
      await deleteUser(user.id)
      setUsers((prev) => (prev ?? []).filter((u) => u.id !== user.id))
      if (selectedId === user.id) setSelectedId(null)
    } catch (e) {
      setDeleteError((e as Error).message)
    } finally {
      setDeletingId(null)
    }
  }

  const onlyAdults = view.kind === 'adults'

  return (
    <>
      <Topbar me={me} onLogout={onLogout} />
      <main className="page">
        <section className="card" aria-labelledby="users-title">
          <h2 id="users-title" className="card-title">
            Usuarios
          </h2>
          <div className="toolbar">
            <SearchForm
              onSearch={(name) => changeView({ kind: 'search', name })}
              onClear={() => changeView(ALL)}
            />
            <div className="segmented" role="group" aria-label="Filtrar por edad">
              <button type="button" aria-pressed={!onlyAdults} onClick={() => changeView(ALL)}>
                Todos
              </button>
              <button
                type="button"
                aria-pressed={onlyAdults}
                onClick={() => changeView({ kind: 'adults' })}
              >
                Solo mayores
              </button>
            </div>
          </div>

          {deleteError && (
            <p className="alert alert-error" role="alert">
              {deleteError}
            </p>
          )}
          {loading && <p className="state">Cargando...</p>}
          {error && (
            <p className="alert alert-error" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && users?.length === 0 && (
            <p className="state">{emptyMessage(view)}</p>
          )}
          {!loading && !error && users && users.length > 0 && (
            <ul className="user-list">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  selected={selectedId === user.id}
                  deleting={deletingId === user.id}
                  onSelect={setSelectedId}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </section>

        <div className="side">
          {selectedId !== null ? (
            <UserDetail key={selectedId} userId={selectedId} />
          ) : (
            <section className="card">
              <p className="state">Elegí un usuario de la lista para ver su detalle.</p>
            </section>
          )}
          <CreateUserForm onCreated={handleCreated} />
        </div>
      </main>
    </>
  )
}
