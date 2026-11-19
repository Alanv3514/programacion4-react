import { useState } from 'react';

const MINIMO = 0;
const MAXIMO = 10;

function useContador() {
  const [valor, setValor] = useState(MINIMO);

  function sumar() {
    if (valor < MAXIMO) setValor(valor + 1);
  }

  function restar() {
    if (valor > MINIMO) setValor(valor - 1);
  }

  function reiniciar() {
    setValor(MINIMO);
  }

  return { valor, sumar, restar, reiniciar };
}

export default function Ej2() {
  const { valor, sumar, restar, reiniciar } = useContador();

  return (
    <div className="contador">
      <p className="contador-valor" aria-live="polite">
        {valor}
      </p>
      <div className="fila">
        <button type="button" className="boton" disabled={valor === MINIMO} onClick={restar}>
          -
        </button>
        <button type="button" className="boton" disabled={valor === MAXIMO} onClick={sumar}>
          +
        </button>
        <button type="button" className="boton" onClick={reiniciar}>
          Reiniciar
        </button>
      </div>
      {valor === MAXIMO && <p className="tenue">Llegaste al máximo</p>}
    </div>
  );
}
