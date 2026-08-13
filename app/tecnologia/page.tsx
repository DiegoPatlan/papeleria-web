"use client";

import { useState } from "react";
import { useCart } from "../components/CartContext";

const productos = [
  {
    id: 1,
    nombre: "Memoria USB 64 GB",
    descripcion: "Almacenamiento rápido para tus archivos.",
    precio: 149,
    imagen: "https://www.officedepot.com.mx/medias/64779.gif-1200ftw?context=bWFzdGVyfHJvb3R8MTIzODQyfGltYWdlL2pwZWd8YURZeUwyaGtNQzg1TkRFMk5qRTFPREl4TXpReUxtcHdad3wzNDBmZjBmZTRjOTc1ZGM3MGMyZGI2MzI0MzAwMTMwYzI1ODEwZjEyNGNjM2I3MjQwMTQ5MTcwZjQyZjI3Zjdm",
  },
  {
    id: 2,
    nombre: "Mouse inalámbrico",
    descripcion: "Mouse inalámbrico para computadora.",
    precio: 199,
    icono: "🖱️",
  },
  {
    id: 3,
    nombre: "Teclado USB",
    descripcion: "Teclado cómodo para trabajo y estudio.",
    precio: 249,
    icono: "⌨️",
  },
  {
    id: 4,
    nombre: "Cable USB-C",
    descripcion: "Cable USB-C para carga y transferencia de datos.",
    precio: 99,
    icono: "🔌",
  },
  {
    id: 5,
    nombre: "Audífonos",
    descripcion: "Audífonos para música, clases y llamadas.",
    precio: 179,
    icono: "🎧",
  },
  {
    id: 6,
    nombre: "Adaptador USB",
    descripcion: "Adaptador para conectar dispositivos USB.",
    precio: 129,
    icono: "🔗",
  },
];

export default function TecnologiaPage() {
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [imagenPrevia, setImagenPrevia] = useState<string | null>(null);
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
            <span>CATÁLOGO DE TECNOLOGÍA</span>

            <h2>Productos de tecnología</h2>

            <p>
              Selecciona los productos tecnológicos que necesitas.
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
                  <a href="/escolares">
                    📚 Escolares
                  </a>

                  <a href="/oficina">
                    📁 Oficina
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
                  item.categoria === "Tecnología"
              );

              const cantidad = productoCarrito?.cantidad || 0;

              return (
                <div
                  className="categoria-card"
                  key={producto.id}
                >
                  <div
                    className="categoria-icono"
                    style={{
                      overflow: "hidden",
                      cursor: producto.imagen ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (producto.imagen) {
                        setImagenPrevia(producto.imagen);
                      }
                    }}
                  >
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "5px",
                          boxSizing: "border-box",
                        }}
                      />
                    ) : (
                      <span>{producto.icono}</span>
                    )}
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
                            "Tecnología"
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
                            categoria: "Tecnología",
                            icono: producto.icono,
                            imagen: producto.imagen,
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


      {imagenPrevia && (
        <div
          onClick={() => setImagenPrevia(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box",
            cursor: "zoom-out",
          }}
        >
          <button
            onClick={() => setImagenPrevia(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "25px",
              width: "45px",
              height: "45px",
              border: "none",
              borderRadius: "50%",
              background: "white",
              color: "#333",
              fontSize: "25px",
              cursor: "pointer",
              zIndex: 10000,
            }}
          >
            ×
          </button>

          <img
            src={imagenPrevia}
            alt="Previsualización del producto"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90%",
              maxHeight: "85%",
              objectFit: "contain",
              borderRadius: "15px",
              background: "white",
              padding: "10px",
              boxSizing: "border-box",
              cursor: "default",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}
      
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