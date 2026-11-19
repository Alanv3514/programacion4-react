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
    <form className="field" onSubmit={handleSubmit}>
      <label htmlFor="search-name">Buscar por nombre</label>
      <div className="row">
        <input
          id="search-name"
          type="search"
          placeholder="Ej.: ma"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Buscar</button>
        <button type="button" onClick={handleClear}>
          Limpiar
        </button>
      </div>
    </form>
  )
}
