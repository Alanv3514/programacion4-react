import { useEffect, useState } from 'react'
import { setUnauthorizedHandler } from './api/client'
import { LoginPage } from './pages/LoginPage'
import { UsersPage } from './pages/UsersPage'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem('token')
      setToken(null)
      setNotice('Tu sesión venció')
    })
  }, [])

  function handleLogin(newToken: string) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setNotice(null)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (!token) return <LoginPage notice={notice} onLogin={handleLogin} />

  return <UsersPage onLogout={logout} />
}
