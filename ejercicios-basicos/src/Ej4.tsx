import { useState } from 'react';

export default function Ej4() {
  const [celsius, setCelsius] = useState('');

  const grados = Number(celsius);
  const convertible = celsius.trim() !== '' && Number.isFinite(grados);
  const fahrenheit = convertible ? (grados * 9) / 5 + 32 : null;
  const haceCalor = convertible && grados > 30;

  return (
    <div className="columna">
      <input
        className="campo"
        aria-label="Temperatura en °C"
        placeholder="Grados Celsius"
        inputMode="decimal"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
      />
      {fahrenheit !== null && <p className="conversor-resultado">{fahrenheit.toFixed(1)} °F</p>}
      {haceCalor && <p>Hace calor</p>}
    </div>
  );
}
