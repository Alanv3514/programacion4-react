import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { errorMessage } from './format'
import type { User } from './types'

interface Props {
  token: string
  onCreated: (user: User) => void
}

const COUNTRIES = [
  { id: 1, name: 'Argentina' },
  { id: 2, name: 'Brasil' },
]

const EMPTY_FORM = { name: '', age: '', email: '', password: '', countryId: '1' }

export function CreateUserForm({ token, onCreated }: Props) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function update(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setSending(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age),
          email: form.email,
          password: form.password,
          country_id: Number(form.countryId),
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(errorMessage(data.detail))
        return
      }
      onCreated({ id: data.id, name: form.name })
      setSuccess(`Usuario ${form.name} creado`)
      setForm(EMPTY_FORM)
    } catch {
      setError('No se pudo conectar con la API')
    } finally {
      setSending(false)
    }
  }

  return (
    <form className="card stack create-form" onSubmit={handleSubmit}>
      <h2>Nuevo usuario</h2>
      <div className="field">
        <label htmlFor="new-name">Nombre</label>
        <input
          id="new-name"
          placeholder="Juan Pérez"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="new-age">Edad</label>
        <input
          id="new-age"
          type="number"
          placeholder="25"
          min={0}
          value={form.age}
          onChange={(e) => update('age', e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="new-email">Email</label>
        <input
          id="new-email"
          type="email"
          placeholder="juan@email.com"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="new-password">Contraseña</label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 4 caracteres"
          minLength={4}
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="new-country">País</label>
        <select
          id="new-country"
          value={form.countryId}
          onChange={(e) => update('countryId', e.target.value)}
        >
          {COUNTRIES.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={sending}>
        {sending ? 'Creando...' : 'Crear'}
      </button>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </form>
  )
}
