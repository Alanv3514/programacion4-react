import { useState } from 'react'
import type { SubmitEvent } from 'react'

interface Props {
  onSearch: (name: string) => void
  onClear: () => void
}

export function SearchForm({ onSearch, onClear }: Props) {
  const [name, setName] = useState('')

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (trimmed) onSearch(trimmed)
    else onClear()
  }

  function handleClear() {
    setName('')
    onClear()
  }

  return (
    <form className="search" role="search" onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Buscar por nombre"
        aria-label="Buscar por nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="btn-primary" type="submit">
        Buscar
      </button>
      <button className="btn-secondary" type="button" onClick={handleClear}>
        Limpiar
      </button>
    </form>
  )
}
