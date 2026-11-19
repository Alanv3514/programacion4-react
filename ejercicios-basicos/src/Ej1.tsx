interface ProductoProps {
  nombre: string;
  precio: number;
  stock: number;
}

function Producto({ nombre, precio, stock }: ProductoProps) {
  return (
    <article className="tarjeta-producto">
      <h3 className="tarjeta-producto-nombre">{nombre}</h3>
      <p className="tarjeta-producto-precio">${precio}</p>
      <p className={stock === 0 ? 'tarjeta-producto-stock agotado' : 'tarjeta-producto-stock'}>
        {stock === 0 ? 'Sin stock' : `Stock: ${stock} unidades`}
      </p>
    </article>
  );
}

const PRODUCTOS = [
  { nombre: 'Teclado', precio: 45000, stock: 12 },
  { nombre: 'Mouse', precio: 18000, stock: 0 },
  { nombre: 'Monitor', precio: 320000, stock: 3 },
];

export default function Ej1() {
  return (
    <div className="tarjetas">
      {PRODUCTOS.map(({ nombre, precio, stock }) => (
        <Producto key={nombre} nombre={nombre} precio={precio} stock={stock} />
      ))}
    </div>
  );
}
