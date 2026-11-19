import { useState } from 'react';
import type { FormEvent } from 'react';

interface Item {
  id: number;
  texto: string;
}

function useListaDeCompras() {
  const [items, setItems] = useState<Item[]>([]);

  function agregar(texto: string) {
    const limpio = texto.trim();
    if (limpio === '') return;
    setItems([...items, { id: Date.now(), texto: limpio }]);
  }

  function eliminar(id: number) {
    setItems(items.filter((item) => item.id !== id));
  }

  return { items, agregar, eliminar };
}

export default function Ej5() {
  const { items, agregar, eliminar } = useListaDeCompras();
  const [texto, setTexto] = useState('');

  function manejarSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    agregar(texto);
    setTexto('');
  }

  return (
    <div>
      <form className="fila" onSubmit={manejarSubmit}>
        <input
          className="campo"
          aria-label="Nuevo ítem"
          placeholder="Ej: yerba"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button type="submit" className="boton">
          Agregar
        </button>
      </form>

      {items.length === 0 ? (
        <p className="tenue">No hay nada para comprar</p>
      ) : (
        <ul className="lista">
          {items.map(({ id, texto: nombre }) => (
            <li key={id}>
              {nombre}{' '}
              <button
                type="button"
                className="boton boton-chico"
                aria-label={`Eliminar ${nombre}`}
                onClick={() => eliminar(id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
