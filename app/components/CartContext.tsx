"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type ProductoCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  categoria: string;
  icono?: string;
  imagen?: string;
};

type CartContextType = {
  carrito: ProductoCarrito[];
  agregarProducto: (producto: ProductoCarrito) => void;
  aumentarCantidad: (id: number, categoria: string) => void;
  disminuirCantidad: (id: number, categoria: string) => void;
  eliminarProducto: (id: number, categoria: string) => void;
  vaciarCarrito: () => void;
  totalProductos: number;
  totalPedido: number;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Siempre empezamos con un carrito vacío.
  // Esto evita problemas de hidratación.
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);

  const [cargandoCarrito, setCargandoCarrito] = useState(true);

  // Recuperar el carrito guardado cuando ya estamos en el navegador
  useEffect(() => {
    try {
      const carritoGuardado = localStorage.getItem("carrito");

      if (carritoGuardado) {
        setCarrito(JSON.parse(carritoGuardado));
      }
    } catch (error) {
      console.error(
        "No se pudo recuperar el carrito:",
        error
      );
    } finally {
      setCargandoCarrito(false);
    }
  }, []);

  // Guardar el carrito cada vez que cambie
  useEffect(() => {
    if (cargandoCarrito) {
      return;
    }

    try {
      localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
      );
    } catch (error) {
      console.error(
        "No se pudo guardar el carrito:",
        error
      );
    }
  }, [carrito, cargandoCarrito]);

  const agregarProducto = (
    producto: ProductoCarrito
  ) => {
    setCarrito((actual) => {
      const productoExistente = actual.find(
        (item) =>
          item.id === producto.id &&
          item.categoria === producto.categoria
      );

      if (productoExistente) {
        return actual.map((item) =>
          item.id === producto.id &&
          item.categoria === producto.categoria
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        );
      }

      return [
        ...actual,
        {
          ...producto,
          cantidad: 1,
        },
      ];
    });
  };

  const aumentarCantidad = (
    id: number,
    categoria: string
  ) => {
    setCarrito((actual) =>
      actual.map((item) =>
        item.id === id &&
        item.categoria === categoria
          ? {
              ...item,
              cantidad: item.cantidad + 1,
            }
          : item
      )
    );
  };

  const disminuirCantidad = (
    id: number,
    categoria: string
  ) => {
    setCarrito((actual) =>
      actual
        .map((item) =>
          item.id === id &&
          item.categoria === categoria
            ? {
                ...item,
                cantidad: item.cantidad - 1,
              }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminarProducto = (
    id: number,
    categoria: string
  ) => {
    setCarrito((actual) =>
      actual.filter(
        (item) =>
          !(
            item.id === id &&
            item.categoria === categoria
          )
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const totalProductos = carrito.reduce(
    (total, producto) =>
      total + producto.cantidad,
    0
  );

  const totalPedido = carrito.reduce(
    (total, producto) =>
      total +
      producto.precio * producto.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarProducto,
        aumentarCantidad,
        disminuirCantidad,
        eliminarProducto,
        vaciarCarrito,
        totalProductos,
        totalPedido,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe utilizarse dentro de CartProvider"
    );
  }

  return context;
}