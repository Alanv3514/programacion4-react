import { useState } from 'react';

export default function Ej3() {
  const [visible, setVisible] = useState(false);

  return (
    <article className="tarjeta-pregunta">
      <h3>¿Qué es JSX?</h3>
      <button type="button" className="boton" onClick={() => setVisible(!visible)}>
        {visible ? 'Ocultar respuesta' : 'Mostrar respuesta'}
      </button>
      {visible && (
        <p className="tarjeta-pregunta-respuesta">
          Una sintaxis que permite escribir estructura parecida a HTML dentro de JavaScript. Se
          transforma en llamadas a funciones de React.
        </p>
      )}
    </article>
  );
}
