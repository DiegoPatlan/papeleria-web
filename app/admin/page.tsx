"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [cargando, setCargando] = useState(true);

    const [productos, setProductos] = useState<any[]>([]);
    const [cargandoProductos, setCargandoProductos] = useState(true);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("Escolares");
    const [imagen, setImagen] = useState("");
    const [marca, setMarca] = useState("");
    const [codigo, setCodigo] = useState("");
    const [activo, setActivo] = useState(true);

    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [errorFormulario, setErrorFormulario] = useState("");

    const [productoEditando, setProductoEditando] = useState<number | null>(null);

    const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
    const [textoNotificacion, setTextoNotificacion] = useState("");

    const [productoEliminando, setProductoEliminando] = useState<any | null>(null);
    const [eliminando, setEliminando] = useState(false);


    const cargarProductos = async () => {
        const { data, error } = await supabase
            .from("productos")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            console.error("Error cargando productos:", error);
            return;
        }

        setProductos(data || []);
    };

    const thStyle = {
        padding: "12px",
        textAlign: "left" as const,
        borderBottom: "1px solid #e5e7eb",
        fontSize: "14px",
        color: "#374151",
        background: "#f9fafb",
    };

    const tdStyle = {
        padding: "12px",
        borderBottom: "1px solid #e5e7eb",
        fontSize: "14px",
        color: "#4b5563",
    };

    const inputStyle = {
        width: "100%",
        padding: "13px",
        marginTop: "8px",
        borderRadius: "10px",
        border: "1px solid #d9deea",
        fontSize: "15px",
        boxSizing: "border-box" as const,
        background: "white",
    };


    useEffect(() => {
        cargarProductos();
    }, []);

    useEffect(() => {
        const verificarSesion = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                window.location.href = "/admin/login";
                return;
            }

            setCargando(false);
        };

        verificarSesion();
    }, []);

    useEffect(() => {
        const comprobarSesion = async () => {
            const { data, error } = await supabase.auth.getSession();

            console.log("🔐 SESIÓN SUPABASE:", data.session);
            console.log("🔐 USUARIO:", data.session?.user);
            console.log("🔐 ERROR SESIÓN:", error);
        };

        comprobarSesion();
    }, []);
    
    useEffect(() => {
        const cargarProductos = async () => {
            setCargandoProductos(true);

            const { data, error } = await supabase
                .from("productos")
                .select("*")
                .order("id", { ascending: false });

            if (error) {
                console.error("Error cargando productos:", error);
                setCargandoProductos(false);
                return;
            }

            console.log("📦 Productos del administrador:", data);

            setProductos(data || []);
            setCargandoProductos(false);
        };

        cargarProductos();
    }, []);

    const [busqueda, setBusqueda] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("Todas");
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [ordenProductos, setOrdenProductos] = useState("recientes");

    const editarProducto = (producto: any) => {
        setProductoEditando(producto.id);

        setNombre(producto.nombre || "");
        setDescripcion(producto.descripcion || "");
        setPrecio(producto.precio?.toString() || "");
        setCategoria(producto.categoria || "Escolares");
        setImagen(producto.imagen || "");
        setMarca(producto.marca || "");
        setCodigo(producto.codigo || "");
        setActivo(producto.activo ?? true);

        setMensaje("");
        setErrorFormulario("");

        setMostrarFormulario(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const eliminarProducto = async () => {
        if (!productoEliminando) return;

        setEliminando(true);

        const { error } = await supabase
            .from("productos")
            .delete()
            .eq("id", productoEliminando.id);

        if (error) {
            console.error("Error eliminando producto:", error);

            setEliminando(false);

            setTextoNotificacion("No se pudo eliminar el producto");
            setMostrarNotificacion(true);

            setTimeout(() => {
                setMostrarNotificacion(false);
            }, 3000);

            return;
        }

        console.log("Producto eliminado:", productoEliminando);

        await cargarProductos();

        setProductoEliminando(null);
        setEliminando(false);

        setTextoNotificacion("Producto eliminado correctamente");
        setMostrarNotificacion(true);

        setTimeout(() => {
            setMostrarNotificacion(false);
        }, 3000);
    };

    const guardarProducto = async (e: React.FormEvent) => {
        e.preventDefault();

        setMensaje("");
        setErrorFormulario("");

        if (!nombre.trim()) {
            setErrorFormulario("El nombre del producto es obligatorio.");
            return;
        }

        if (!precio || Number(precio) < 0) {
            setErrorFormulario("Ingresa un precio válido.");
            return;
        }

        setGuardando(true);

        let data;
        let error;

        const datosProducto = {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            precio: Number(precio),
            categoria,
            imagen: imagen.trim() || null,
            marca: marca.trim() || null,
            codigo: codigo.trim() || null,
            activo,
        };

        if (productoEditando) {
            // EDITAR PRODUCTO
            const resultado = await supabase
                .from("productos")
                .update(datosProducto)
                .eq("id", productoEditando)
                .select()
                .single();

            data = resultado.data;
            error = resultado.error;
        } else {
            // NUEVO PRODUCTO
            const resultado = await supabase
                .from("productos")
                .insert([datosProducto])
                .select()
                .single();

            data = resultado.data;
            error = resultado.error;
        
        }

        if (error) {
            console.error("Error guardando producto:", error);

            setErrorFormulario(
                "No se pudo guardar el producto: " + error.message
            );

            setGuardando(false);
            return;
        }

        console.log(
            productoEditando !== null
                ? "Producto actualizado:"
                : "Producto creado:",
            data
        );

        await cargarProductos();

        const estabaEditando = productoEditando !== null;

        setProductoEditando(null);
        setMostrarFormulario(false);

        setTextoNotificacion(
            estabaEditando
                ? "Producto editado correctamente"
                : "Producto agregado correctamente"
        );

        setMostrarNotificacion(true);

        setTimeout(() => {
            setMostrarNotificacion(false);
        }, 3000);

        setProductoEditando(null);
        setMostrarFormulario(false)

        // Limpiar formulario
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setCategoria("Escolares");
        setImagen("");
        setMarca("");
        setCodigo("");
        setActivo(true);

        setGuardando(false);
    };

    const productosFiltrados = productos
        .filter((producto) => {
            const texto = busqueda.toLowerCase().trim();

            const coincideBusqueda =
                !texto ||
                producto.nombre?.toLowerCase().includes(texto) ||
                producto.marca?.toLowerCase().includes(texto) ||
                producto.codigo?.toLowerCase().includes(texto) ||
                producto.descripcion?.toLowerCase().includes(texto);

            const coincideCategoria =
                filtroCategoria === "Todas" ||
                producto.categoria === filtroCategoria;

            const coincideEstado =
                filtroEstado === "Todos" ||
                (filtroEstado === "Activos" && producto.activo === true) ||
                (filtroEstado === "Inactivos" && producto.activo === false);

            return (
                coincideBusqueda &&
                coincideCategoria &&
                coincideEstado
            );
        })
        .sort((a, b) => {
            switch (ordenProductos) {
                case "nombreAsc":
                    return a.nombre.localeCompare(b.nombre);

                case "nombreDesc":
                    return b.nombre.localeCompare(a.nombre);

                case "precioAsc":
                    return Number(a.precio) - Number(b.precio);

                case "precioDesc":
                    return Number(b.precio) - Number(a.precio);

                case "recientes":
                default:
                    return Number(b.id) - Number(a.id);
            }
        });

    if (cargando) {
        return (
            <main
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f7fb",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "40px" }}>🔐</div>

                    <p style={{ color: "#7b8494" }}>
                        Verificando sesión...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="pagina">

            {productoEliminando && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10000,
                        padding: "20px",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "450px",
                            background: "white",
                            borderRadius: "20px",
                            padding: "30px",
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        {/* ICONO */}
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                background: "#fef2f2",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "30px",
                                margin: "0 auto 20px",
                            }}
                        >
                            🗑️
                        </div>

                        {/* TITULO */}
                        <h2
                            style={{
                                textAlign: "center",
                                margin: 0,
                                color: "#1f2937",
                            }}
                        >
                            ¿Eliminar producto?
                        </h2>

                        {/* PRODUCTO */}
                        <p
                            style={{
                                textAlign: "center",
                                marginTop: "15px",
                                color: "#4b5563",
                                lineHeight: 1.6,
                            }}
                        >
                            Estás a punto de eliminar:

                            <strong
                                style={{
                                    display: "block",
                                    marginTop: "8px",
                                    fontSize: "18px",
                                    color: "#111827",
                                }}
                            >
                                {productoEliminando.nombre}
                            </strong>
                        </p>

                        <p
                            style={{
                                textAlign: "center",
                                color: "#dc2626",
                                fontSize: "14px",
                                marginTop: "15px",
                            }}
                        >
                            ⚠️ Esta acción no se puede deshacer.
                        </p>

                        {/* BOTONES */}
                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                marginTop: "25px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setProductoEliminando(null)}
                                disabled={eliminando}
                                className="boton-secundario"
                                style={{
                                    flex: 1,
                                    border: "none",
                                    cursor: eliminando
                                        ? "not-allowed"
                                        : "pointer",
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={eliminarProducto}
                                disabled={eliminando}
                                style={{
                                    flex: 1,
                                    border: "none",
                                    borderRadius: "10px",
                                    padding: "12px",
                                    background: "#dc2626",
                                    color: "white",
                                    cursor: eliminando
                                        ? "not-allowed"
                                        : "pointer",
                                    fontWeight: "600",
                                    opacity: eliminando ? 0.7 : 1,
                                }}
                            >
                                {eliminando
                                    ? "Eliminando..."
                                    : "🗑️ Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mostrarNotificacion && (
                <div
                    style={{
                        position: "fixed",
                        top: "25px",
                        right: "25px",
                        zIndex: 9999,
                        background: "white",
                        borderRadius: "14px",
                        padding: "16px 22px",
                        boxShadow: "0 10px 35px rgba(0, 0, 0, 0.18)",
                        border: "1px solid #d1fae5",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        minWidth: "280px",
                    }}
                >
                    <div
                        style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            background: "#dcfce7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                        }}
                    >
                        ✓
                    </div>

                    <div>
                        <strong
                            style={{
                                display: "block",
                                color: "#166534",
                                fontSize: "15px",
                            }}
                        >
                            ¡Listo!
                        </strong>

                        <span
                            style={{
                                color: "#4b5563",
                                fontSize: "14px",
                            }}
                        >
                            {textoNotificacion}
                        </span>
                    </div>
                </div>
            )}

            <header className="header">
                <div className="contenedor header-contenido">
                    <a href="/" className="logo">
                        <div className="logo-icono">✏️</div>

                        <div>
                            <h1>Papelería</h1>
                            <span>Panel de administrador</span>
                        </div>
                    </a>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <a href="/" className="boton-secundario">
                            🏠 Tienda
                        </a>

                        <button
                            type="button"
                            className="boton-secundario"
                            onClick={async () => {
                                await supabase.auth.signOut();
                                window.location.href = "/admin/login";
                            }}
                        >
                            🚪 Cerrar sesión
                        </button>
                    </div>
                </div>
            </header>

            <section className="seccion categorias">
                <div className="contenedor">

                    <div className="titulo-seccion">
                        <span>ADMINISTRACIÓN</span>
                        <h2>Panel de administrador</h2>
                        <p>
                            Administra los productos de tu papelería desde un solo lugar.
                        </p>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "20px",
                            marginTop: "35px",
                        }}
                    >
                        <div
                            style={{
                                background: "white",
                                padding: "25px",
                                borderRadius: "18px",
                                border: "1px solid #e5e9f0",
                            }}
                        >
                            <div style={{ fontSize: "35px" }}>📦</div>
                            <h3>Productos</h3>
                            <p style={{ color: "#7b8494" }}>
                                Administra los productos del catálogo.
                            </p>
                        </div>

                        <div
                            style={{
                                background: "white",
                                padding: "25px",
                                borderRadius: "18px",
                                border: "1px solid #e5e9f0",
                            }}
                        >
                            <div style={{ fontSize: "35px" }}>📂</div>
                            <h3>Categorías</h3>
                            <p style={{ color: "#7b8494" }}>
                                Escolares, Oficina y Tecnología.
                            </p>
                        </div>

                        <div
                            style={{
                                background: "white",
                                padding: "25px",
                                borderRadius: "18px",
                                border: "1px solid #e5e9f0",
                            }}
                        >
                            <div style={{ fontSize: "35px" }}>🖼️</div>
                            <h3>Imágenes</h3>
                            <p style={{ color: "#7b8494" }}>
                                Administra las imágenes de tus productos.
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: "35px",
                            background: "white",
                            padding: "30px",
                            borderRadius: "20px",
                            border: "1px solid #e5e9f0",
                            boxShadow: "0 15px 40px rgba(42, 52, 75, 0.07)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "15px",
                                flexWrap: "wrap",
                            }}
                        >
                            <div>
                                <h2 style={{ margin: 0 }}>
                                    Gestión de productos
                                </h2>

                                <p
                                    style={{
                                        marginTop: "8px",
                                        color: "#7b8494",
                                    }}
                                >
                                    Agrega y administra los productos de la tienda.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="boton-principal"
                                onClick={() =>
                                    setMostrarFormulario(!mostrarFormulario)
                                }
                            >
                                ➕ Nuevo producto
                            </button>
                        </div>

                        {mostrarFormulario && (
                            <form
                                onSubmit={guardarProducto}
                                style={{
                                    marginTop: "30px",
                                    padding: "25px",
                                    borderRadius: "15px",
                                    background: "#f8f9fc",
                                    border: "1px solid #e5e9f0",
                                }}
                            >
                                <h3>
                                    {productoEditando
                                        ? "✏️ Editar producto"
                                        : "➕ Nuevo producto"}
                                </h3>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fit, minmax(250px, 1fr))",
                                        gap: "20px",
                                        marginTop: "20px",
                                    }}
                                >
                                    {/* NOMBRE */}
                                    <div>
                                        <label>Nombre del producto</label>

                                        <input
                                            type="text"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            placeholder="Ej. Cuaderno profesional"
                                            required
                                            style={inputStyle}
                                        />
                                    </div>

                                    {/* PRECIO */}
                                    <div>
                                        <label>Precio</label>

                                        <input
                                            type="number"
                                            value={precio}
                                            onChange={(e) => setPrecio(e.target.value)}
                                            placeholder="45.00"
                                            min="0"
                                            step="0.01"
                                            required
                                            style={inputStyle}
                                        />
                                    </div>

                                    {/* CATEGORÍA */}
                                    <div>
                                        <label>Categoría</label>

                                        <select
                                            value={categoria}
                                            onChange={(e) => setCategoria(e.target.value)}
                                            style={inputStyle}
                                        >
                                            <option value="Escolares">📚 Escolares</option>
                                            <option value="Oficina">📁 Oficina</option>
                                            <option value="Tecnología">💻 Tecnología</option>
                                        </select>
                                    </div>

                                    {/* MARCA */}
                                    <div>
                                        <label>Marca</label>

                                        <input
                                            type="text"
                                            value={marca}
                                            onChange={(e) => setMarca(e.target.value)}
                                            placeholder="Ej. Scribe"
                                            style={inputStyle}
                                        />
                                    </div>

                                    {/* CÓDIGO */}
                                    <div>
                                        <label>Código</label>

                                        <input
                                            type="text"
                                            value={codigo}
                                            onChange={(e) => setCodigo(e.target.value)}
                                            placeholder="Ej. SCR001"
                                            style={inputStyle}
                                        />
                                    </div>

                                    {/* IMAGEN */}
                                    <div>
                                        <label>URL de imagen</label>

                                        <input
                                            type="url"
                                            value={imagen}
                                            onChange={(e) => setImagen(e.target.value)}
                                            placeholder="https://..."
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                {/* DESCRIPCIÓN */}
                                <div style={{ marginTop: "20px" }}>
                                    <label>Descripción</label>

                                    <textarea
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        placeholder="Descripción del producto..."
                                        rows={4}
                                        style={{
                                            ...inputStyle,
                                            resize: "vertical",
                                        }}
                                    />
                                </div>

                                {/* ACTIVO */}
                                <div
                                    style={{
                                        marginTop: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={activo}
                                        onChange={(e) => setActivo(e.target.checked)}
                                        id="producto-activo"
                                    />

                                    <label htmlFor="producto-activo">
                                        Producto activo
                                    </label>
                                </div>

                                {/* MENSAJES */}
                                {errorFormulario && (
                                    <div
                                        style={{
                                            marginTop: "20px",
                                            padding: "12px",
                                            borderRadius: "10px",
                                            background: "#fff1f1",
                                            color: "#c62828",
                                        }}
                                    >
                                        ❌ {errorFormulario}
                                    </div>
                                )}

                                {/* BOTONES */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        marginTop: "25px",
                                    }}
                                >
                                    <button
                                        type="submit"
                                        className="boton-principal"
                                        disabled={guardando}
                                        style={{
                                            border: "none",
                                            cursor: guardando ? "not-allowed" : "pointer",
                                            opacity: guardando ? 0.7 : 1,
                                        }}
                                    >
                                        {guardando
                                            ? "Guardando..."
                                            : productoEditando
                                                ? "💾 Guardar cambios"
                                                : "💾 Guardar producto"}
                                    </button>

                                    <button
                                        type="button"
                                        className="boton-secundario"
                                        onClick={() => setMostrarFormulario(false)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* LISTA DE PRODUCTOS */}
                        <div
                            style={{
                                marginTop: "40px",
                                background: "white",
                                borderRadius: "20px",
                                padding: "25px",
                                border: "1px solid #e5e9f0",
                                boxShadow: "0 15px 40px rgba(42, 52, 75, 0.07)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "25px",
                                }}
                            >
                                <div>
                                    <h2 style={{ margin: 0 }}>📦 Productos</h2>

                                    <p
                                        style={{
                                            marginTop: "6px",
                                            color: "#7b8494",
                                        }}
                                    >
                                        Productos registrados en la papelería
                                    </p>
                                </div>

                                <strong>
                                    {productos.length} productos
                                </strong>
                            </div>


                            {/* BARRA INTELIGENTE */}
                            <div
                                style={{
                                    marginBottom: "25px",
                                    padding: "18px",
                                    borderRadius: "15px",
                                    background: "#f8f9fc",
                                    border: "1px solid #e5e9f0",
                                    boxSizing: "border-box",
                                    width: "100%",
                                }}
                            >
                                <div
                                    className="barra-filtros-productos"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "minmax(0, 2fr) repeat(3, minmax(0, 1fr))",
                                        gap: "12px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    {/* BUSCAR */}
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                            minWidth: 0,
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: "absolute",
                                                left: "14px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                fontSize: "18px",
                                                pointerEvents: "none",
                                            }}
                                        >
                                            🔎
                                        </span>

                                        <input
                                            type="text"
                                            placeholder="Buscar producto..."
                                            value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                            style={{
                                                ...inputStyle,
                                                width: "100%",
                                                maxWidth: "100%",
                                                minWidth: 0,
                                                marginTop: 0,
                                                paddingLeft: "42px",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>

                                    {/* CATEGORÍA */}
                                    <select
                                        value={filtroCategoria}
                                        onChange={(e) => setFiltroCategoria(e.target.value)}
                                        style={{
                                            ...inputStyle,
                                            width: "100%",
                                            minWidth: 0,
                                            marginTop: 0,
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        <option value="Todas">📂 Todas las categorías</option>
                                        <option value="Escolares">📚 Escolares</option>
                                        <option value="Oficina">📁 Oficina</option>
                                        <option value="Tecnología">💻 Tecnología</option>
                                    </select>

                                    {/* ESTADO */}
                                    <select
                                        value={filtroEstado}
                                        onChange={(e) => setFiltroEstado(e.target.value)}
                                        style={{
                                            ...inputStyle,
                                            width: "100%",
                                            minWidth: 0,
                                            marginTop: 0,
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        <option value="Todos">🔄 Todos los estados</option>
                                        <option value="Activos">🟢 Activos</option>
                                        <option value="Inactivos">🔴 Inactivos</option>
                                    </select>

                                    {/* ORDEN */}
                                    <select
                                        value={ordenProductos}
                                        onChange={(e) => setOrdenProductos(e.target.value)}
                                        style={{
                                            ...inputStyle,
                                            width: "100%",
                                            minWidth: 0,
                                            marginTop: 0,
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        <option value="recientes">🕐 Más recientes</option>
                                        <option value="nombreAsc">🔤 Nombre A-Z</option>
                                        <option value="nombreDesc">🔤 Nombre Z-A</option>
                                        <option value="precioAsc">💰 Precio menor</option>
                                        <option value="precioDesc">💰 Precio mayor</option>
                                    </select>
                                </div>

                                {/* RESULTADOS */}
                                <div
                                    style={{
                                        marginTop: "12px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "10px",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                        }}
                                    >
                                        📦 Mostrando{" "}
                                        <strong style={{ color: "#374151" }}>
                                            {productosFiltrados.length}
                                        </strong>{" "}
                                        de{" "}
                                        <strong style={{ color: "#374151" }}>
                                            {productos.length}
                                        </strong>{" "}
                                        productos
                                    </span>

                                    {(busqueda ||
                                        filtroCategoria !== "Todas" ||
                                        filtroEstado !== "Todos" ||
                                        ordenProductos !== "recientes") && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setBusqueda("");
                                                    setFiltroCategoria("Todas");
                                                    setFiltroEstado("Todos");
                                                    setOrdenProductos("recientes");
                                                }}
                                                style={{
                                                    border: "none",
                                                    background: "transparent",
                                                    color: "#4f46e5",
                                                    cursor: "pointer",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                ✕ Limpiar filtros
                                            </button>
                                        )}
                                </div>
                            </div>

                            {cargandoProductos ? (
                                <p style={{ textAlign: "center", padding: "30px" }}>
                                    Cargando productos...
                                </p>
                            ) : productos.length === 0 ? (
                                <p
                                    style={{
                                        textAlign: "center",
                                        padding: "30px",
                                        color: "#7b8494",
                                    }}
                                >
                                    No hay productos registrados.
                                </p>
                            ) : (
                                <div
                                    style={{
                                        overflowX: "auto",
                                    }}
                                >
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th style={thStyle}>Imagen</th>
                                                <th style={thStyle}>Producto</th>
                                                <th style={thStyle}>Categoría</th>
                                                <th style={thStyle}>Marca</th>
                                                <th style={thStyle}>Precio</th>
                                                <th style={thStyle}>Código</th>
                                                <th style={thStyle}>Estado</th>
                                                <th style={thStyle}>Acciones</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                                {productosFiltrados.map((producto) => (
                                                <tr key={producto.id}>
                                                    <td style={tdStyle}>
                                                        {producto.imagen ? (
                                                            <img
                                                                src={producto.imagen}
                                                                alt={producto.nombre}
                                                                style={{
                                                                    width: "60px",
                                                                    height: "60px",
                                                                    objectFit: "contain",
                                                                    borderRadius: "8px",
                                                                    background: "#f8f9fc",
                                                                }}
                                                            />
                                                        ) : (
                                                            <span style={{ fontSize: "30px" }}>
                                                                📦
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <strong>{producto.nombre}</strong>

                                                        <div
                                                            style={{
                                                                fontSize: "13px",
                                                                color: "#7b8494",
                                                                marginTop: "4px",
                                                            }}
                                                        >
                                                            {producto.descripcion}
                                                        </div>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        {producto.categoria}
                                                    </td>

                                                    <td style={tdStyle}>
                                                        {producto.marca || "—"}
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <strong>
                                                            ${Number(producto.precio).toFixed(2)}
                                                        </strong>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        {producto.codigo || "—"}
                                                    </td>

                                                    <td style={tdStyle}>
                                                        {producto.activo ? (
                                                            <span
                                                                style={{
                                                                    padding: "6px 10px",
                                                                    borderRadius: "20px",
                                                                    background: "#ecfdf5",
                                                                    color: "#15803d",
                                                                    fontSize: "13px",
                                                                }}
                                                            >
                                                                Activo
                                                            </span>
                                                        ) : (
                                                            <span
                                                                style={{
                                                                    padding: "6px 10px",
                                                                    borderRadius: "20px",
                                                                    background: "#fef2f2",
                                                                    color: "#dc2626",
                                                                    fontSize: "13px",
                                                                }}
                                                            >
                                                                Inactivo
                                                            </span>
                                                        )}
                                                    </td>

                                                        <td style={tdStyle}>
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    gap: "8px",
                                                                    flexWrap: "wrap",
                                                                }}
                                                            >
                                                                {/* EDITAR */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => editarProducto(producto)}
                                                                    style={{
                                                                        border: "none",
                                                                        borderRadius: "8px",
                                                                        padding: "8px 12px",
                                                                        background: "#eef2ff",
                                                                        color: "#4f46e5",
                                                                        cursor: "pointer",
                                                                        fontWeight: "600",
                                                                    }}
                                                                >
                                                                    ✏️ Editar
                                                                </button>

                                                                {/* ELIMINAR */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setProductoEliminando(producto)}
                                                                    style={{
                                                                        border: "none",
                                                                        borderRadius: "8px",
                                                                        padding: "8px 12px",
                                                                        background: "#fef2f2",
                                                                        color: "#dc2626",
                                                                        cursor: "pointer",
                                                                        fontWeight: "600",
                                                                    }}
                                                                >
                                                                    🗑️ Eliminar
                                                                </button>
                                                            </div>
                                                        </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </section>

            <footer className="footer">
                <div className="contenedor footer-contenido">
                    <div>
                        <h3>✏️ Papelería</h3>
                        <p>
                            Panel de administración.
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