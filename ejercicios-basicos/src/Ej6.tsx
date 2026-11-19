import { useState } from 'react';

const LENGUAJES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'Go',
  'Rust',
  'Kotlin',
  'Ruby',
  'PHP',
];

export default function Ej6() {
  const [busqueda, setBusqueda] = useState('');

  const resultados = LENGUAJES.filter((lenguaje) =>
    lenguaje.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div>
      <input
        className="campo"
        aria-label="Buscar lenguaje"
        placeholder="Buscar lenguaje..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <p className="tenue">
        {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
      </p>
      <ul className="lista">
        {resultados.map((lenguaje) => (
          <li key={lenguaje}>{lenguaje}</li>
        ))}
      </ul>
    </div>
  );
}
