import { getUser } from '../api/users'
import { useFetch } from '../hooks/useFetch'
import { initials } from '../utils/format'

export function UserDetail({ userId }: { userId: number }) {
  const { data: user, error, loading } = useFetch(() => getUser(userId), [userId])

  return (
    <section className="card" aria-live="polite">
      {loading && <p className="state">Cargando...</p>}
      {error && (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      )}
      {user && (
        <>
          <div className="detail-head">
            <span className="avatar avatar-lg" aria-hidden="true">
              {initials(user.name)}
            </span>
            <h2>{user.name}</h2>
          </div>
          <dl className="detail-list">
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Edad</dt>
            <dd>{user.age}</dd>
            <dt>País</dt>
            <dd>{user.country?.name ?? '—'}</dd>
            <dt>Roles</dt>
            <dd>
              {user.roles.length > 0
                ? user.roles.map((role) => (
                    <span key={role.id} className="badge">
                      {role.name}
                    </span>
                  ))
                : '—'}
            </dd>
          </dl>
        </>
      )}
    </section>
  )
}
