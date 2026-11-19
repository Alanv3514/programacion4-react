interface ProductoProps {
  nombre: string;
  precio: number;
  stock: number;
  oferta?: boolean;
}

function Producto({ nombre, precio, stock, oferta }: ProductoProps) {
  return (
    <article className="tarjeta-producto">
      <h3 className="tarjeta-producto-nombre">{nombre}</h3>
      {oferta && <p className="tarjeta-producto-oferta">¡Oferta!</p>}
      <p className="tarjeta-producto-precio">${precio}</p>
      <p className={stock === 0 ? 'tarjeta-producto-stock agotado' : 'tarjeta-producto-stock'}>
        {stock === 0 ? 'Sin stock' : `Stock: ${stock}`}
      </p>
    </article>
  );
}

export default function Ej7() {
  return (
    <div className="tarjetas">
      <Producto nombre="Teclado" precio={45000} stock={12} oferta />
      <Producto nombre="Mouse" precio={18000} stock={0} />
    </div>
  );
}
