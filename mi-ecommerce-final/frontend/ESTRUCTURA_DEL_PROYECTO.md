# Estructura de carpetas de MiEcommerce — guía para presentar

Este documento describe la arquitectura **de los archivos comprobados en el repositorio**, no un proyecto genérico. Algunas carpetas pueden contener más archivos que los enumerados aquí.

```text
pWeb2/
└── mi-ecommerce-final/
    └── frontend/                      ← aplicación web y API
        ├── src/                       ← código React (navegador)
        │   ├── assets/                ← recursos visuales importados por React, si están presentes
        │   ├── components/            ← piezas reutilizables de interfaz
        │   │   ├── Layout.jsx         ← menú, navegación y estructura común
        │   │   └── organisms/
        │   │       └── ProductGrid... ← grilla de productos
        │   ├── pages/                 ← pantallas/rutas completas
        │   │   ├── Catalog.jsx        ← catálogo principal
        │   │   ├── Admin.jsx          ← gestión de productos
        │   │   ├── Academia.jsx       ← guía /estudiar
        │   │   └── StudyGuide.jsx     ← guía /guia
        │   ├── hooks/
        │   │   └── useProducts.js     ← carga de productos y conexión WebSocket
        │   ├── services/
        │   │   └── api.js             ← peticiones HTTP con fetch
        │   ├── context/
        │   │   └── StoreContext.jsx   ← carrito, sesión y estado compartido
        │   └── App.jsx                ← define rutas con React Router
        ├── api/
        │   └── index.js               ← backend serverless en Vercel, PostgreSQL
        ├── realtime/
        │   ├── server.js              ← servidor WebSocket en Render
        │   ├── package.json           ← dependencia ws y script npm start
        │   └── README.md              ← despliegue del servidor WebSocket
        ├── WEBSOCKET_CONFIG/
        │   └── README.md              ← mapa de todos los archivos de WebSocket
        ├── package.json               ← dependencias y comandos de React/Vite
        ├── vite.config.js              ← Vite; proxy /api en desarrollo
        └── vercel.json                 ← rutas de API y fallback de React
```

## ¿Para qué sirve cada carpeta?

| Carpeta | Explicación sencilla | Ejemplo concreto |
| --- | --- | --- |
| `src/` | Código que se compila para ejecutarse en el navegador. | React muestra el catálogo. |
| `src/assets/` | Convención para imágenes, íconos y otros recursos visuales que se importan desde componentes; **no implica que todas las fotos estén guardadas ahí**. | El catálogo también admite URLs de imágenes guardadas en los datos del producto. |
| `src/components/` | Componentes reutilizables que se pueden usar en distintas pantallas. | `Layout.jsx`, tarjetas y grillas de productos. |
| `src/components/organisms/` | Componentes más grandes que agrupan elementos pequeños. | `ProductGrid` organiza las tarjetas del catálogo. |
| `src/pages/` | Cada archivo representa una pantalla o vista completa. | `Catalog.jsx` y `Admin.jsx`. |
| `src/hooks/` | Lógica reutilizable mediante hooks de React. | `useProducts.js` trae productos y escucha WebSocket. |
| `src/services/` | Comunicación con la API, separada del diseño. | `api.js` usa `fetch` para GET/POST/PUT/DELETE. |
| `src/context/` | Estado compartido entre componentes. | `StoreContext.jsx` guarda carrito y sesión. |
| `api/` | Lógica del servidor HTTP, consultas a PostgreSQL y autenticación. | `api/index.js` procesa `/api/products`. |
| `realtime/` | Proceso Node.js persistente que mantiene conexiones WebSocket. | `server.js` distribuye `products:changed`. |
| `WEBSOCKET_CONFIG/` | **Documentación y configuración explicada** de todos los archivos relacionados con WebSocket; no duplica la implementación. | `README.md` enlaza frontend, API y servidor. |

## Cómo se relacionan

```text
Usuario → pages/Catalog.jsx → hooks/useProducts.js → services/api.js
                                                   ↓ fetch HTTP
                                               api/index.js → Neon PostgreSQL

Administrador → pages/Admin.jsx → services/api.js → api/index.js
                                                       ↓ evento firmado
                                                 realtime/server.js (Render)
                                                       ↓ WebSocket
                                                 hooks/useProducts.js
                                                       ↓
                                               vuelve a consultar API
```

## Diferencia entre las tecnologías

- **React:** construye las interfaces de usuario.
- **React Router:** elige la página según la URL, definido en `src/App.jsx`.
- **Vite:** herramienta de desarrollo y compilación del frontend.
- **HTTP + fetch:** obtiene y modifica información mediante la API.
- **WebSocket + ws:** comunica eventos de cambio en tiempo real.
- **Node.js:** ejecuta el servidor WebSocket y el backend.
- **PostgreSQL en Neon:** almacena información persistente.
- **Vercel:** publica frontend y API serverless.
- **Render:** ejecuta el servidor WebSocket persistente.

## Ejemplo de explicación oral

«Organizamos el proyecto separando responsabilidades. En `pages` están las pantallas; en `components`, las piezas reutilizables; en `services`, las peticiones a la API; en `context`, los estados compartidos como el carrito; y en `hooks`, la lógica reutilizable. La carpeta `api` contiene el backend que consulta PostgreSQL. Para tiempo real usamos `realtime`, donde está el servidor WebSocket. Además agregamos `WEBSOCKET_CONFIG` para identificar y explicar todos los archivos relacionados con esa funcionalidad».

**Nota:** `assets` es una carpeta convencional de recursos visuales; no debe confundirse con la base de datos ni asumir que contiene todas las imágenes de productos. El listado muestra archivos verificados, pero no pretende ser un inventario exhaustivo del repositorio.
