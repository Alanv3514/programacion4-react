import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { UserList } from './UserList'

const TITLE = 'Práctica 6: Solo mayores de edad'
const INCLUDES = 'Incluye también las prácticas 1 a 5'

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    setError(null)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    if (!response.ok) {
      setError(data.detail)
      return
    }
    localStorage.setItem('token', data.token)
    setToken(data.token)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  const header = (
    <header className="page-header">
      <div>
        <p className="eyebrow">Programación IV · Frontend endpoints</p>
        <h1>{TITLE}</h1>
        {INCLUDES && <p className="muted">{INCLUDES}</p>}
      </div>
      {token && (
        <button type="button" onClick={logout}>
          Salir
        </button>
      )}
    </header>
  )

  if (token) {
    return (
      <main className="page">
        {header}
        <UserList token={token} />
      </main>
    )
  }

  return (
    <main className="page">
      {header}
      <form className="card stack login" onSubmit={handleSubmit}>
        <h2>Ingresar</h2>
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
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ingresar</button>
        {error && <p className="error">{error}</p>}
        <p className="muted hint">
          Usuarios de prueba: <code>mgomez@email.com</code> (ADMIN) y{' '}
          <code>sfer@email.com</code> (REGULAR), contraseña <code>123</code>.
        </p>
      </form>
    </main>
  )
}
