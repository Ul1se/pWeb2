# Manos a la Obra II — Refactorización de ecommerce con Atomic Design

## Objetivo
Aplicar la consigna de Programación Web: separar el frontend React en componentes reutilizables sin incorporar funcionalidades nuevas. La lista de tareas original se adapta al catálogo y carrito del ecommerce PuntosClub.

## Organización
- `src/components/atoms/`: Button, Badge, TextInput.
- `src/components/molecules/`: SearchBar, QuantitySelector.
- `src/components/organisms/`: ProductGrid, CartItem.
- `src/components/`: Layout, ProductCard (componentes heredados de la primera versión).
- `src/pages/`: Catalog, Detail, Cart, Login, Admin, NotFound.
- `src/context/`: StoreContext (estado del carrito y sesión, ya existente).
- `src/hooks/`: useProducts (ya existente).
- `src/services/`: api.js (ya existente).
- `src/App.jsx`: solo define rutas y proveedores.

## Comparación
Antes, `App.jsx` contenía todas las páginas, rutas y lógica de presentación en un solo archivo. Ahora las páginas están separadas y el catálogo y carrito reutilizan componentes por responsabilidad.

## Ejecutar
En `mi-ecommerce-final`: `npm install`, configurar `.env`, `npm run migrate`, `npm start`.
En `mi-ecommerce-final/frontend`: `npm install`, `npm run dev`.

## Criterios de aceptación
- Cada página reside en un archivo separado.
- El catálogo usa `SearchBar` y `ProductGrid`.
- El carrito usa `CartItem` y `QuantitySelector`.
- `App.jsx` mantiene únicamente el enrutamiento y el proveedor global.
- Se conserva el funcionamiento previo y el backend original.

**Nota:** Esta rama parte de `feature/react-manos-a-la-obra`, donde ya existía interactividad y API. Por eso el ejercicio II aquí demuestra refactorización sin introducir lógica adicional. Falta ejecutar compilación y pruebas locales.
