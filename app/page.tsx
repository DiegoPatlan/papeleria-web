"use client";

import { useState } from "react";
import { useCart } from "./components/CartContext";

const productos = [
  {
    nombre: "Cuaderno profesional",
    descripcion: "Cuaderno de pasta resistente para uso escolar.",
    precio: "$45.00",
    categoria: "Escolar",
    icono: "📓",
  },
  {
    nombre: "Kit de plumas",
    descripcion: "Set de plumas de tinta azul, negra y roja.",
    precio: "$35.00",
    categoria: "Escolar",
    icono: "🖊️",
  },
  {
    nombre: "Memoria USB 64 GB",
    descripcion: "Almacenamiento rápido para tus archivos.",
    precio: "$149.00",
    categoria: "Tecnología",
    icono: "💾",
  },
  {
    nombre: "Paquete de hojas",
    descripcion: "500 hojas tamaño carta para impresión.",
    precio: "$119.00",
    categoria: "Oficina",
    icono: "📄",
  },
];

const categorias = [
  {
    nombre: "Productos escolares",
    descripcion: "Todo lo necesario para clases y tareas.",
    icono: "📚",
  },
  {
    nombre: "Productos de oficina",
    descripcion: "Material para tu oficina y trabajo.",
    icono: "🗂️",
  },
  {
    nombre: "Tecnología",
    descripcion: "Accesorios y productos tecnológicos.",
    icono: "💻",
  },
];

export default function Home() {
  const [productoActual, setProductoActual] = useState(0);

  const { totalProductos } = useCart();

  const siguienteProducto = () => {
    setProductoActual((actual) =>
      actual === productos.length - 1 ? 0 : actual + 1
    );
  };

  const productoAnterior = () => {
    setProductoActual((actual) =>
      actual === 0 ? productos.length - 1 : actual - 1
    );
  };

  const producto = productos[productoActual];

  const rutas: Record<string, string> = {
    "Productos escolares": "/escolares",
    "Productos de oficina": "/oficina",
    Tecnología: "/tecnologia",
  };

  return (
    <main className="pagina">
      {/* HEADER */}
      <header className="header">
        <div className="contenedor header-contenido">
          <div className="logo">
            <div className="logo-icono">✏️</div>

            <div>
              <h1>Papelería Martínez</h1>
              <span>Todo para ti</span>
            </div>
          </div>

          <nav className="menu">
            <a href="#inicio">Inicio</a>
            <a href="#categorias">Categorías</a>
            <a href="#mas-vendidos">Más vendidos</a>
          </nav>

          <a href="/carrito" className="boton-pedido">
          🛒 Mi pedido ({totalProductos})
          </a>
          
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="hero">
        <div className="contenedor hero-contenido">
          <div className="hero-texto">
            <span className="etiqueta">
              ✨ Todo lo que necesitas en un solo lugar
            </span>

            <h2>
              Material escolar,
              <br />
              oficina y <span>tecnología.</span>
            </h2>

            <p>
              Encuentra fácilmente los productos que necesitas y arma tu
              pedido para enviarlo directamente por WhatsApp.
            </p>

            <div className="hero-botones">
              <a href="#categorias" className="boton-principal">
                Ver productos
              </a>

              <a href="#mas-vendidos" className="boton-secundario">
                Más vendidos →
              </a>
            </div>
          </div>

          <div className="hero-ilustracion">
            <div className="tarjeta-flotante tarjeta-1">📚</div>

            <div className="tarjeta-flotante tarjeta-2">💻</div>

            <div className="hero-producto">
              <div className="hero-producto-icono">✏️</div>

              <h3>
                Todo para tus
                <br />
                proyectos
              </h3>

              <p>Escolar • Oficina • Tecnología</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="categorias" className="seccion categorias">
        <div className="contenedor">
          <div className="titulo-seccion">
            <span>ENCUENTRA LO QUE NECESITAS</span>

            <h2>Compra por categoría</h2>

            <p>Selecciona una categoría para comenzar tu pedido.</p>
          </div>

          <div className="categorias-grid">
            {categorias.map((categoria) => (
              <a
                key={categoria.nombre}
                href={rutas[categoria.nombre]}
                className="categoria-card"
              >
                <div className="categoria-icono">{categoria.icono}</div>

                <div className="categoria-info">
                  <h3>{categoria.nombre}</h3>

                  <p>{categoria.descripcion}</p>

                  <span>Ver productos →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MAS VENDIDOS */}
      <section id="mas-vendidos" className="seccion vendidos">
        <div className="contenedor">
          <div className="titulo-seccion titulo-centrado">
            <span>LOS FAVORITOS</span>

            <h2>Productos más vendidos</h2>

            <p>
              Descubre algunos de los productos favoritos de nuestros
              clientes.
            </p>
          </div>

          <div className="carrusel">
            <button
              className="flecha"
              onClick={productoAnterior}
              aria-label="Producto anterior"
            >
              ←
            </button>

            <div className="producto-carrusel">
              <div className="producto-imagen">
                <div className="producto-icono">{producto.icono}</div>

                <span className="producto-etiqueta">Más vendido</span>
              </div>

              <div className="producto-info">
                <span className="producto-categoria">
                  {producto.categoria}
                </span>

                <h3>{producto.nombre}</h3>

                <p>{producto.descripcion}</p>

                <div className="producto-abajo">
                  <strong>{producto.precio}</strong>

                  <button className="agregar">+ Agregar</button>
                </div>
              </div>
            </div>

            <button
              className="flecha"
              onClick={siguienteProducto}
              aria-label="Siguiente producto"
            >
              →
            </button>
          </div>

          <div className="indicadores">
            {productos.map((_, index) => (
              <button
                key={index}
                onClick={() => setProductoActual(index)}
                className={
                  index === productoActual
                    ? "indicador activo"
                    : "indicador"
                }
                aria-label={`Producto ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="contenedor footer-contenido">
          <div>
            <h3>✏️ Papelería Martínez</h3>

            <p>Todo lo que necesitas en un solo lugar.</p>
          </div>

          <div>
            <p>© 2026 Papelería. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}