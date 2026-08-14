"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const iniciarSesion = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");
        setCargando(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Error de inicio de sesión:", error);
            setError("Correo o contraseña incorrectos.");
            setCargando(false);
            return;
        }

        window.location.href = "/admin";
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                background: "#f5f7fb",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "430px",
                    background: "white",
                    padding: "35px",
                    borderRadius: "20px",
                    border: "1px solid #e5e9f0",
                    boxShadow: "0 15px 40px rgba(42, 52, 75, 0.08)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <div style={{ fontSize: "45px" }}>🔐</div>

                    <h1 style={{ marginTop: "10px" }}>
                        Panel de administrador
                    </h1>

                    <p style={{ color: "#7b8494" }}>
                        Inicia sesión para administrar los productos.
                    </p>
                </div>

                <form onSubmit={iniciarSesion}>
                    <div style={{ marginBottom: "18px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600",
                            }}
                        >
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@papeleria.com"
                            required
                            style={{
                                width: "100%",
                                padding: "13px",
                                borderRadius: "10px",
                                border: "1px solid #d9deea",
                                fontSize: "16px",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600",
                            }}
                        >
                            Contraseña
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{
                                width: "100%",
                                padding: "13px",
                                borderRadius: "10px",
                                border: "1px solid #d9deea",
                                fontSize: "16px",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                marginBottom: "20px",
                                padding: "12px",
                                borderRadius: "10px",
                                background: "#fff1f1",
                                color: "#c62828",
                                fontSize: "14px",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={cargando}
                        className="boton-principal"
                        style={{
                            width: "100%",
                            padding: "14px",
                            border: "none",
                            cursor: cargando ? "not-allowed" : "pointer",
                            opacity: cargando ? 0.7 : 1,
                        }}
                    >
                        {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "25px" }}>
                    <a
                        href="/"
                        style={{
                            color: "#4f46e5",
                            textDecoration: "none",
                        }}
                    >
                        ← Volver a la tienda
                    </a>
                </div>
            </div>
        </main>
    );
}