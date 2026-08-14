"use client";

import { useEffect, useState } from "react";
import { useCart } from "../components/CartContext";
import { supabase } from "../../lib/supabase";



const normalizarTexto = (texto: string) => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const buscarProductos = (texto: string, productos: any[]) => {
  const busquedaNormalizada = normalizarTexto(texto).trim();

  if (!busquedaNormalizada) {
    return productos;
  }

  const palabras = busquedaNormalizada.split(/\s+/);

  return productos
    .map((producto) => {
      const nombre = normalizarTexto(producto.nombre);
      const descripcion = normalizarTexto(producto.descripcion);

      let puntos = 0;

      palabras.forEach((palabra) => {
        if (nombre.includes(palabra)) {
          puntos += 3;
        }

        if (descripcion.includes(palabra)) {
          puntos += 1;
        }
      });

      return {
        ...producto,
        puntos,
      };
    })
    .filter((producto) => producto.puntos > 0)
    .sort((a, b) => b.puntos - a.puntos);
};

export default function EscolaresPage() {
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [productosSupabase, setProductosSupabase] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [imagenPrevia, setImagenPrevia] = useState<string | null>(null);
 
  useEffect(() => {
    console.log("🔥 SE EJECUTÓ EL USEEFFECT DE SUPABASE");

    const cargarProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("categoria", "Escolares")
        .eq("activo", true);

      if (error) {
        console.error("Error cargando productos:", error);
        return;
      }

      console.log("Productos de Supabase:", data);

      setProductosSupabase(data || []);
    };

    cargarProductos();
  }, []);

  const {
    carrito,
    agregarProducto,
    aumentarCantidad,
    disminuirCantidad,
    totalProductos,
    totalPedido,
  } = useCart();

  const productosFiltrados = buscarProductos(busqueda, productosSupabase);

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

          {/* BUSCADOR */}
          <div
            style={{
              marginTop: "30px",
              marginBottom: "30px",
              position: "relative",
            }}
          >
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="🔎 Buscar productos escolares..."
              style={{
                width: "100%",
                padding: "15px 18px",
                borderRadius: "12px",
                border: "1px solid #d9deea",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
                background: "white",
              }}
            />
          </div>

          {busqueda.trim() && (
            <p
              style={{
                marginTop: "-15px",
                marginBottom: "20px",
                color: "#7b8494",
                fontSize: "14px",
              }}
            >
              {productosFiltrados.length === 0
                ? `No encontramos productos para "${busqueda}"`
                : `${productosFiltrados.length} ${productosFiltrados.length === 1
                  ? "producto encontrado"
                  : "productos encontrados"
                }`}
            </p>
          )}

          {/* PRODUCTOS */}
          <div className="categorias-grid">
            {productosFiltrados.length === 0 && busqueda.trim() ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  background: "white",
                  border: "1px solid #e5e9f0",
                  borderRadius: "18px",
                  padding: "45px 25px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "45px",
                    marginBottom: "15px",
                  }}
                >
                  🔍
                </div>

                <h3
                  style={{
                    marginBottom: "8px",
                  }}
                >
                  No encontramos productos para "{busqueda}"
                </h3>

                <p
                  style={{
                    color: "#7b8494",
                    margin: 0,
                  }}
                >
                  Intenta buscar con otra palabra.
                </p>
              </div>
            ) : (
              productosFiltrados.map((producto) => {
                
              const productoCarrito = carrito.find(
                (item) =>
                  item.id === producto.id &&
                item.categoria === "Escolares"
              );

              const cantidad = productoCarrito?.cantidad || 0;

              return (
                <div className="categoria-card" key={producto.id}>
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
              })
            )}
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