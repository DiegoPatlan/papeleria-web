"use client";

import { useState } from "react";
import { useCart } from "../components/CartContext";

export default function CarritoPage() {
  const {
    carrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
    vaciarCarrito,
    totalProductos,
    totalPedido,
  } = useCart();

  const [nombre, setNombre] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [fechaRecogida, setFechaRecogida] = useState("");
  const [horaRecogida, setHoraRecogida] = useState("");

  const obtenerHorarios = (fecha: string) => {
    if (!fecha) {
      return [];
    }

    // Evitamos problemas de zona horaria
    const [año, mes, dia] = fecha.split("-").map(Number);

    const fechaSeleccionada = new Date(año, mes - 1, dia);

    const diaSemana = fechaSeleccionada.getDay();

    const horarios: string[] = [];

    const agregarHorarios = (
      horaInicio: number,
      minutoInicio: number,
      horaFin: number,
      minutoFin: number
    ) => {
      let minutos =
        horaInicio * 60 + minutoInicio;

      const limite =
        horaFin * 60 + minutoFin;

      while (minutos <= limite) {
        const hora = Math.floor(minutos / 60);
        const minuto = minutos % 60;

        const horaTexto = String(hora).padStart(2, "0");
        const minutoTexto = String(minuto).padStart(2, "0");

        horarios.push(
          `${horaTexto}:${minutoTexto}`
        );

        minutos += 30;
      }
    };

    // Domingo
    if (diaSemana === 0) {
      agregarHorarios(11, 0, 15, 0);
    }

    // Lunes a viernes
    else if (diaSemana >= 1 && diaSemana <= 5) {
      agregarHorarios(10, 0, 15, 30);
      agregarHorarios(16, 30, 20, 0);
    }

    // Sábado
    else if (diaSemana === 6) {
      agregarHorarios(10, 0, 15, 30);
    }

    return horarios;
  };

  const enviarWhatsApp = () => {
    if (carrito.length === 0) {
      alert("Tu pedido está vacío.");
      return;
    }

    if (!nombre.trim()) {
      alert("Por favor escribe tu nombre antes de enviar el pedido.");
      return;
    }
    if (!metodoPago) {
      alert("Por favor selecciona un método de pago.");
      return;
    }

    if (!fechaRecogida) {
      alert("Por favor selecciona la fecha de recogida.");
      return;
    }

    if (!horaRecogida) {
      alert("Por favor selecciona la hora de recogida.");
      return;
    }

    const telefono = "524621759813";

    let mensaje = "";

    mensaje += "[NUEVO PEDIDO - PAPELERÍA MARTÍNEZ]\n\n";

    mensaje += "Cliente: " + nombre.trim() + "\n\n";
    mensaje += "Método de pago: " + metodoPago + "\n";
    mensaje += "Fecha de recogida: " + fechaRecogida + "\n";
    mensaje += "Hora de recogida: " + horaRecogida + "\n\n";

    mensaje += "[PRODUCTOS]\n\n";

    carrito.forEach((producto) => {
      const subtotal =
        producto.precio * producto.cantidad;

      mensaje += "• " + producto.nombre + "\n";
      mensaje += "  Categoría: " + producto.categoria + "\n";
      mensaje += "  Cantidad: " + producto.cantidad + "\n";
      mensaje += "  Precio: $" + producto.precio.toFixed(2) + "\n";
      mensaje += "  Subtotal: $" + subtotal.toFixed(2) + "\n\n";
    });

    mensaje += "------------------------------\n\n";

    mensaje += "Productos: " + totalProductos + "\n";
    mensaje += "TOTAL: $" + totalPedido.toFixed(2) + "\n";

    if (comentarios.trim()) {
      mensaje += "\nComentarios:\n";
      mensaje += comentarios.trim() + "\n";
    }

    mensaje += "\nGracias.";

    const url =
      "https://wa.me/" +
      telefono +
      "?text=" +
      encodeURIComponent(mensaje);

    window.location.href = url;
  };

  return (
    <main className="pagina">
      {/* HEADER */}
      <header className="header">
        <div className="contenedor header-contenido">
          <a href="/" className="logo">
            <div className="logo-icono">✏️</div>

            <div>
              <h1>Papelería Martínez</h1>
              <span>Todo para ti</span>
            </div>
          </a>

          <nav className="menu">
            <a href="/">Inicio</a>
            <a href="/#categorias">Categorías</a>
            <a href="/#mas-vendidos">Más vendidos</a>
          </nav>

          <div className="boton-pedido">
            🛒 Mi pedido ({totalProductos})
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <section className="seccion categorias">
        <div className="contenedor">
          <div className="titulo-seccion">
            <span>MI PEDIDO</span>

            <h2>Resumen de tu pedido</h2>

            <p>
              Revisa tus productos y completa tus datos
              antes de enviarlos por WhatsApp.
            </p>
          </div>

          {carrito.length === 0 ? (
            /* CARRITO VACÍO */
            <div
              style={{
                background: "white",
                padding: "50px 30px",
                borderRadius: "20px",
                textAlign: "center",
                border: "1px solid #e5e9f0",
              }}
            >
              <div
                style={{
                  fontSize: "60px",
                  marginBottom: "20px",
                }}
              >
                🛒
              </div>

              <h2>Tu pedido está vacío</h2>

              <p
                style={{
                  marginTop: "10px",
                  color: "#7b8494",
                }}
              >
                Agrega algunos productos para comenzar
                tu pedido.
              </p>

              <a
                href="/#categorias"
                className="boton-principal"
                style={{
                  display: "inline-block",
                  marginTop: "25px",
                  textDecoration: "none",
                }}
              >
                Ver productos
              </a>
            </div>
          ) : (
            <>
              <div className="carrito-layout">
                {/* PRODUCTOS */}
                <div className="carrito-productos">
                  {carrito.map((producto) => {
                    const subtotal =
                      producto.precio * producto.cantidad;

                    return (
                      <div
                        key={`${producto.categoria}-${producto.id}`}
                        className="carrito-producto"
                        style={{
                          background: "white",
                          padding: "20px",
                          borderRadius: "18px",
                          marginBottom: "15px",
                          border: "1px solid #e5e9f0",
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        {/* ICONO DEL PRODUCTO */}
                        <div
                          style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "15px",
                            background: "#f1f5ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
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
                            <span style={{ fontSize: "32px" }}>
                              {producto.icono}
                            </span>
                          )}
                        </div>

                        {/* INFORMACIÓN */}
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              color: "#4f46e5",
                              fontWeight: 600,
                            }}
                          >
                            {producto.categoria}
                          </span>

                          <h3
                            style={{
                              marginTop: "4px",
                              marginBottom: "5px",
                            }}
                          >
                            {producto.nombre}
                          </h3>

                          <span
                            style={{
                              color: "#7b8494",
                            }}
                          >
                            ${producto.precio.toFixed(2)} c/u
                          </span>
                        </div>

                        {/* CANTIDAD */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexShrink: 0,
                          }}
                        >
                          <button
                            onClick={() =>
                              disminuirCantidad(
                                producto.id,
                                producto.categoria
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

                          <strong>
                            {producto.cantidad}
                          </strong>

                          <button
                            onClick={() =>
                              aumentarCantidad(
                                producto.id,
                                producto.categoria
                              )
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

                        {/* SUBTOTAL */}
                        <strong
                          style={{
                            minWidth: "90px",
                            textAlign: "right",
                          }}
                        >
                          ${subtotal.toFixed(2)}
                        </strong>

                        {/* ELIMINAR */}
                        <button
                          onClick={() =>
                            eliminarProducto(
                              producto.id,
                              producto.categoria
                            )
                          }
                          aria-label={`Eliminar ${producto.nombre}`}
                          style={{
                            border: "none",
                            background: "transparent",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    );
                  })}

                  {/* DATOS DEL CLIENTE */}
                  <div
                    style={{
                      background: "white",
                      padding: "30px",
                      borderRadius: "20px",
                      border: "1px solid #e5e9f0",
                      marginTop: "25px",
                    }}
                  >
                    <h2>Datos del pedido</h2>

                    <p
                      style={{
                        marginTop: "8px",
                        color: "#7b8494",
                      }}
                    >
                      Estos datos se enviarán a la
                      papelería por WhatsApp.
                    </p>

                    <label
                      style={{
                        display: "block",
                        marginTop: "25px",
                        marginBottom: "8px",
                        fontWeight: 600,
                      }}
                    >
                      Nombre *
                    </label>

                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) =>
                        setNombre(e.target.value)
                      }
                      placeholder="Escribe tu nombre"
                      style={{
                        width: "100%",
                        padding: "13px 15px",
                        borderRadius: "10px",
                        border: "1px solid #d9deea",
                        fontSize: "15px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />

                    <label
                      style={{
                        display: "block",
                        marginTop: "20px",
                        marginBottom: "8px",
                        fontWeight: 600,
                      }}
                    >

                        {/* MÉTODO DE PAGO */}
                        <label
                          style={{
                            display: "block",
                            marginTop: "20px",
                            marginBottom: "8px",
                            fontWeight: 600,
                          }}
                        >
                          Método de pago *
                        </label>

                        <select
                          value={metodoPago}
                          onChange={(e) => setMetodoPago(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "13px 15px",
                            borderRadius: "10px",
                            border: "1px solid #d9deea",
                            fontSize: "15px",
                            outline: "none",
                            background: "white",
                            boxSizing: "border-box",
                          }}
                        >
                          <option value="">
                            Selecciona un método de pago
                          </option>

                          <option value="Transferencia">
                            Transferencia
                          </option>

                          <option value="Efectivo">
                            Efectivo
                          </option>

                          <option value="Tarjeta">
                            Tarjeta
                          </option>
                        </select>

                        {/* FECHA DE RECOGIDA */}
                        <label
                          style={{
                            display: "block",
                            marginTop: "20px",
                            marginBottom: "8px",
                            fontWeight: 600,
                          }}
                        >
                          Fecha de recogida *
                        </label>

                        <input
                          type="date"
                          value={fechaRecogida}
                          onChange={(e) => {
                            setFechaRecogida(e.target.value);
                            setHoraRecogida("");
                          }}
                          min={new Date().toISOString().split("T")[0]}
                          style={{
                            width: "100%",
                            maxWidth: "100%",
                            minWidth: 0,
                            height: "48px",
                            padding: "0 12px",
                            borderRadius: "10px",
                            border: "1px solid #d9deea",
                            fontSize: "16px",
                            outline: "none",
                            boxSizing: "border-box",
                            display: "block",
                            background: "white",
                          }}
                        />

                        {/* HORA DE RECOGIDA */}
                        <label
                          style={{
                            display: "block",
                            marginTop: "20px",
                            marginBottom: "8px",
                            fontWeight: 600,
                          }}
                        >
                          Hora de recogida *
                        </label>

                        <select
                          value={horaRecogida}
                          onChange={(e) =>
                            setHoraRecogida(e.target.value)
                          }
                          disabled={!fechaRecogida}
                          style={{
                            width: "100%",
                            padding: "13px 15px",
                            borderRadius: "10px",
                            border: "1px solid #d9deea",
                            fontSize: "15px",
                            outline: "none",
                            background: fechaRecogida
                              ? "white"
                              : "#f3f4f6",
                            boxSizing: "border-box",
                            cursor: fechaRecogida
                              ? "pointer"
                              : "not-allowed",
                          }}
                        >
                          <option value="">
                            {fechaRecogida
                              ? "Selecciona una hora"
                              : "Primero selecciona una fecha"}
                          </option>

                          {obtenerHorarios(fechaRecogida).map(
                            (hora) => (
                              <option
                                key={hora}
                                value={hora}
                              >
                                {hora}
                              </option>
                            )
                          )}
                        </select>

                      Comentarios
                    </label>

                    <textarea
                      value={comentarios}
                      onChange={(e) =>
                        setComentarios(e.target.value)
                      }
                      placeholder="¿Alguna indicación especial para tu pedido?"
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "13px 15px",
                        borderRadius: "10px",
                        border: "1px solid #d9deea",
                        fontSize: "15px",
                        resize: "vertical",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                {/* RESUMEN */}
                <aside
                  className="carrito-resumen"
                  style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "20px",
                    border: "1px solid #e5e9f0",
                    boxShadow:
                      "0 15px 40px rgba(42, 52, 75, 0.07)",
                    position: "sticky",
                    top: "30px",
                  }}
                >
                  <h2>Resumen</h2>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "25px",
                    }}
                  >
                    <span>Productos</span>

                    <strong>
                      {totalProductos}
                    </strong>
                  </div>

                  <hr
                    style={{
                      margin: "20px 0",
                      border: 0,
                      borderTop:
                        "1px solid #e5e9f0",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "20px",
                    }}
                  >
                    <strong>Total</strong>

                    <strong>
                      ${totalPedido.toFixed(2)}
                    </strong>
                  </div>

                  {/* WHATSAPP */}
                  <button
                    onClick={enviarWhatsApp}
                    style={{
                      width: "100%",
                      marginTop: "25px",
                      padding: "15px",
                      border: "none",
                      borderRadius: "12px",
                      background: "#25D366",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    📱 Enviar pedido por WhatsApp
                  </button>

                  {/* VACIAR */}
                  <button
                    onClick={vaciarCarrito}
                    style={{
                      width: "100%",
                      marginTop: "12px",
                      padding: "12px",
                      border: "none",
                      background: "transparent",
                      color: "#dc2626",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Vaciar pedido
                  </button>

                  {/* SEGUIR COMPRANDO */}
                  <a
                    href="/#categorias"
                    style={{
                      display: "block",
                      textAlign: "center",
                      marginTop: "15px",
                      color: "#4f46e5",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    ← Seguir comprando
                  </a>
                </aside>
              </div>
            </>
          )}
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
              © 2026 Soporte TI, Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}