import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { login } from '../api/auth'

interface Props {
  notice: string | null
  onLogin: (token: string) => void
}

const TEST_USERS = [
  {
    email: 'mgomez@email.com',
    name: 'Martina Gómez',
    role: 'ADMIN',
    can: 'Ver, crear y borrar usuarios',
  },
  {
    email: 'sfer@email.com',
    name: 'Santiago Fernández',
    role: 'REGULAR',
    can: 'Solo ver (crear y borrar dan 403)',
  },
]
const TEST_PASSWORD = '123'

export function LoginPage({ notice, onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  async function doLogin(loginEmail: string, loginPassword: string) {
    setError(null)
    setSending(true)
    try {
      const { token } = await login(loginEmail, loginPassword)
      onLogin(token)
    } catch (e) {
      setError((e as Error).message)
      setSending(false)
    }
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    doLogin(email, password)
  }

  function loginAs(testEmail: string) {
    setEmail(testEmail)
    setPassword(TEST_PASSWORD)
    doLogin(testEmail, TEST_PASSWORD)
  }

  const message = error ?? notice

  return (
    <main className="login">
      <div className="login-box">
        <form className="card form" onSubmit={handleSubmit}>
          <div className="login-head">
            <h1>Ingresar</h1>
            <p className="muted">Gestión de usuarios, roles y permisos</p>
          </div>
          {message && (
            <p className="alert alert-error" role="alert">
              {message}
            </p>
          )}
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              placeholder="mgomez@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={sending}>
            {sending ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <section className="card test-users" aria-labelledby="test-users-title">
          <div>
            <h2 id="test-users-title" className="card-title">
              Usuarios de prueba
            </h2>
            <p className="muted small">
              Contraseña <code>{TEST_PASSWORD}</code> para los dos. Un clic y entrás.
            </p>
          </div>
          {TEST_USERS.map((user) => (
            <button
              key={user.email}
              type="button"
              className="test-user"
              disabled={sending}
              onClick={() => loginAs(user.email)}
            >
              <span className="test-user-main">
                <span className="test-user-name">{user.name}</span>
                <span className="badge">{user.role}</span>
              </span>
              <span className="muted small">{user.email}</span>
              <span className="muted small">{user.can}</span>
            </button>
          ))}
        </section>
      </div>
    </main>
  )
}
