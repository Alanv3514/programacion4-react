import type { ComponentType } from 'react';
import Ej1 from './Ej1';
import Ej2 from './Ej2';
import Ej3 from './Ej3';
import Ej4 from './Ej4';
import Ej5 from './Ej5';
import Ej6 from './Ej6';
import Ej7 from './Ej7';

interface Ejercicio {
  numero: number;
  titulo: string;
  tema: string;
  Componente: ComponentType;
}

const EJERCICIOS: Ejercicio[] = [
  { numero: 1, titulo: 'Tarjetas de producto', tema: 'Props', Componente: Ej1 },
  { numero: 2, titulo: 'Contador con límites', tema: 'useState', Componente: Ej2 },
  { numero: 3, titulo: 'Mostrar y ocultar', tema: 'Condicionales', Componente: Ej3 },
  { numero: 4, titulo: 'Conversor de temperatura', tema: 'Inputs controlados', Componente: Ej4 },
  { numero: 5, titulo: 'Lista de compras', tema: 'Listas y estado', Componente: Ej5 },
  { numero: 6, titulo: 'Buscador', tema: 'Filtrado', Componente: Ej6 },
  { numero: 7, titulo: 'Tipar con TypeScript', tema: 'TypeScript', Componente: Ej7 },
];

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>React desde cero — Ejercicios</h1>
      </header>
      <main className="ejercicios">
        {EJERCICIOS.map(({ numero, titulo, tema, Componente }) => (
          <section key={numero} className="ejercicio" aria-labelledby={`ej${numero}`}>
            <div className="ejercicio-encabezado">
              <h2 id={`ej${numero}`}>
                Ejercicio {numero} — {titulo}
              </h2>
              <span className="etiqueta">{tema}</span>
            </div>
            <Componente />
          </section>
        ))}
      </main>
    </div>
  );
}
