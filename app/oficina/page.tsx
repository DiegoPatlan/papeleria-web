"use client";

import { useCart } from "../components/CartContext";

const productos = [
  {
    id: 1,
    nombre: "Paquete de hojas",
    descripcion: "500 hojas tamaño carta para impresión.",
    precio: 119,
    icono: "📄",
  },
  {
    id: 2,
    nombre: "Carpeta tamaño carta",
    descripcion: "Carpeta resistente para organizar documentos.",
    precio: 35,
    icono: "📁",
  },
  {
    id: 3,
    nombre: "Engrapadora",
    descripcion: "Engrapadora de escritorio para uso diario.",
    precio: 85,
    icono: "📎",
  },
  {
    id: 4,
    nombre: "Caja de clips",
    descripcion: "Caja con clips metálicos para documentos.",
    precio: 25,
    icono: "🖇️",
  },
  {
    id: 5,
    nombre: "Notas adhesivas",
    descripcion: "Paquete de notas adhesivas de diferentes colores.",
    precio: 30,
    icono: "📝",
  },
  {
    id: 6,
    nombre: "Cinta adhesiva",
    descripcion: "Cinta transparente para oficina y documentos.",
    precio: 22,
    icono: "📏",
  },
];

export default function OficinaPage() {
  const {
    carrito,
    agregarProducto,
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
            <span>CATÁLOGO DE OFICINA</span>

            <h2>Productos de oficina</h2>

            <p>
              Selecciona los productos que necesitas para tu oficina.
            </p>
          </div>

          <div className="navegacion-categorias">
            
             <a href="/" className="boton-secundario">
             🏠 Volver al inicio
             </a>
             
             <a href="/#categorias" className="boton-principal">
             📂 Elegir otra categoría
             </a>
             
             </div>

          {/* PRODUCTOS */}
          <div className="categorias-grid">
            {productos.map((producto) => {
              const productoCarrito = carrito.find(
                (item) =>
                  item.id === producto.id &&
                  item.categoria === "Oficina"
              );

              const cantidad = productoCarrito?.cantidad || 0;

              return (
                <div
                  className="categoria-card"
                  key={producto.id}
                >
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
                            "Oficina"
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
                            categoria: "Oficina",
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