import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { COUNTRIES, createUser } from '../api/users'
import type { NewUser } from '../api/types'

interface Props {
  onCreated: (user: NewUser) => void
}

const EMPTY_FORM = { name: '', age: '', email: '', password: '', countryId: '1' }

export function CreateUserForm({ onCreated }: Props) {
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
      const age = Number(form.age)
      const { id } = await createUser({
        name: form.name,
        age,
        email: form.email,
        password: form.password,
        country_id: Number(form.countryId),
      })
      onCreated({ id, name: form.name, age })
      setSuccess(`Usuario ${form.name} creado`)
      setForm(EMPTY_FORM)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSending(false)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2 className="card-title">Nuevo usuario</h2>
      <div className="form-grid">
        <div className="field span-2">
          <label htmlFor="new-name">Nombre</label>
          <input
            id="new-name"
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
            min={0}
            value={form.age}
            onChange={(e) => update('age', e.target.value)}
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
        <div className="field span-2">
          <label htmlFor="new-email">Email</label>
          <input
            id="new-email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />
        </div>
        <div className="field span-2">
          <label htmlFor="new-password">Contraseña</label>
          <input
            id="new-password"
            type="password"
            minLength={4}
            placeholder="Mínimo 4 caracteres"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            required
          />
        </div>
      </div>
      <button className="btn-primary" type="submit" disabled={sending}>
        {sending ? 'Creando...' : 'Crear usuario'}
      </button>
      {error && (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="alert alert-success" role="status">
          {success}
        </p>
      )}
    </form>
  )
}
