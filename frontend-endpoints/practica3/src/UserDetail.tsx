import { useEffect, useState } from 'react'
import type { UserDetail as UserDetailData } from './types'

interface Props {
  token: string
  userId: number
}

export function UserDetail({ token, userId }: Props) {
  const [user, setUser] = useState<UserDetailData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (response) => {
      const data = await response.json()
      if (ignore) return
      if (!response.ok) {
        setError(data.detail)
        return
      }
      setUser(data)
    })

    return () => {
      ignore = true
    }
  }, [token, userId])

  if (error) return <p className="error">{error}</p>
  if (!user) return null

  return (
    <div>
      <h3>{user.name}</h3>
      <dl>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>Edad</dt>
        <dd>{user.age}</dd>
        <dt>País</dt>
        <dd>{user.country?.name ?? '—'}</dd>
        <dt>Roles</dt>
        <dd>{user.roles.map((role) => role.name).join(', ') || '—'}</dd>
      </dl>
    </div>
  )
}
