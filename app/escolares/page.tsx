"use client";

import { useState } from "react";
import { useCart } from "../components/CartContext";

const productos = [
  {
    id: 1,
    nombre: "Cuaderno profesional",
    descripcion: "Cuaderno de pasta resistente para uso escolar.",
    precio: 45,
    icono: "📓",
  },
  {
    id: 2,
    nombre: "Kit de plumas",
    descripcion: "Set de plumas de tinta azul, negra y roja.",
    precio: 35,
    icono: "🖊️",
  },
  {
    id: 3,
    nombre: "Lápices HB",
    descripcion: "Paquete de lápices para escribir y dibujar.",
    precio: 30,
    icono: "✏️",
  },
  {
    id: 4,
    nombre: "Borrador blanco",
    descripcion: "Borrador suave para uso escolar.",
    precio: 12,
    icono: "◻️",
  },
  {
    id: 5,
    nombre: "Colores",
    descripcion: "Caja de colores para trabajos escolares.",
    precio: 65,
    icono: "🖍️",
  },
  {
    id: 6,
    nombre: "Regla de 30 cm",
    descripcion: "Regla transparente para tareas y proyectos.",
    precio: 15,
    icono: "📏",
  },
];

export default function EscolaresPage() {
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const {
    carrito,
    agregarProducto,
    aumentarCantidad,
    disminuirCantidad,
    totalProductos,
    totalPedido,
  } = useCart();

  return (
    <main className="pagina">
      {/* HEADER */}
      <header className="header">
        <div className="contenedor header-contenido">
          <a href="/" className="logo">
            <div className="logo-icono">✏️</div>

            <div>
              <h1>Papelería</h1>
              <span>Todo para ti</span>
            </div>
          </a>

          <nav className="menu">
            <a href="/">Inicio</a>
            <a href="/#categorias">Categorías</a>
            <a href="/#mas-vendidos">Más vendidos</a>
          </nav>

          <a href="/carrito" className="boton-pedido">
            🛒 Mi pedido ({totalProductos})
          </a>
        </div>
      </header>

      {/* ENCABEZADO */}
      <section className="seccion categorias">
        <div className="contenedor">
          <div className="titulo-seccion">
            <span>CATÁLOGO ESCOLAR</span>

            <h2>Productos escolares</h2>

            <p>
              Selecciona los productos que necesitas para comenzar a
              armar tu pedido.
            </p>
          </div>

          <div className="navegacion-categorias">
            <a href="/" className="boton-secundario">
              🏠 Volver al inicio
            </a>

            <div className="selector-categorias">
              <button
                type="button"
                className="boton-principal"
                onClick={() =>
                  setMostrarCategorias(!mostrarCategorias)
                }
              >
                📂 Elegir otra categoría
                <span className="flecha-categorias">
                  {mostrarCategorias ? "▲" : "▼"}
                </span>
              </button>

              {mostrarCategorias && (
                <div className="menu-categorias">

                  <a href="/oficina">
                    📁 Oficina
                  </a>

                  <a href="/tecnologia">
                    💻 Tecnología
                  </a>
                </div>
              )}
            </div>
          </div>


          {/* PRODUCTOS */}
          <div className="categorias-grid">
            {productos.map((producto) => {
              const productoCarrito = carrito.find(
                (item) =>
                  item.id === producto.id &&
                item.categoria === "Escolares"
              );

              const cantidad = productoCarrito?.cantidad || 0;

              return (
                <div className="categoria-card" key={producto.id}>
                  <div className="categoria-icono">
                    {producto.icono}
                  </div>

                  <div className="categoria-info">
                    <h3>{producto.nombre}</h3>

                    <p>{producto.descripcion}</p>

                    <strong
                      style={{
                        display: "block",
                        marginTop: "10px",
                        fontSize: "18px",
                      }}
                    >
                      ${producto.precio.toFixed(2)}
                    </strong>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "15px",
                      }}
                    >
                      <button
                        onClick={() =>
                          disminuirCantidad(
                            producto.id,
                            "Escolares"
                          )
                        }
                        style={{
                          width: "35px",
                          height: "35px",
                          border: "none",
                          borderRadius: "8px",
                          background: "#eef2ff",
                          fontSize: "18px",
                          cursor: "pointer",
                        }}
                      >
                        −
                      </button>

                      <strong>{cantidad}</strong>

                      <button
                        onClick={() =>
                          agregarProducto({
                            id: producto.id,
                            nombre: producto.nombre,
                            precio: producto.precio,
                            cantidad: 1,
                            categoria: "Escolares",
                            icono: producto.icono,
                          })
                        }
                        style={{
                          width: "35px",
                          height: "35px",
                          border: "none",
                          borderRadius: "8px",
                          background: "#4f46e5",
                          color: "white",
                          fontSize: "18px",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RESUMEN */}
          <div
            style={{
              marginTop: "50px",
              padding: "30px",
              background: "white",
              borderRadius: "20px",
              border: "1px solid #e5e9f0",
              boxShadow:
                "0 15px 40px rgba(42, 52, 75, 0.07)",
            }}
          >
            <h2>Resumen del pedido</h2>

            <p
              style={{
                marginTop: "10px",
                color: "#7b8494",
              }}
            >
              Productos seleccionados:{" "}
              <strong>{totalProductos}</strong>
            </p>

            <p
              style={{
                marginTop: "8px",
                fontSize: "20px",
              }}
            >
              Total:{" "}
              <strong>
                ${totalPedido.toFixed(2)}
              </strong>
            </p>

            <a
              href="/carrito"
              className="boton-principal"
              style={{
                display: "inline-block",
                marginTop: "20px",
                textDecoration: "none",
              }}
            >
              Ver mi pedido →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="contenedor footer-contenido">
          <div>
            <h3>✏️ Papelería</h3>

            <p>
              Todo lo que necesitas en un solo lugar.
            </p>
          </div>

          <div>
            <p>
              © 2026 Papelería. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}