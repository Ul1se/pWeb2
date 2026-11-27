# WEBSOCKET CONFIG — MiEcommerce

> **Esta carpeta identifica toda la funcionalidad de tiempo real del proyecto.** La implementación de cliente y publicación está en [websocket/](../websocket/README.md); el servidor permanece en realtime/ para mantener su despliegue independiente.

## Archivos que pertenecen a WebSocket

| Archivo real | Rol |
| --- | --- |
| [`websocket/useWebSocket.js`](../websocket/useWebSocket.js) | Cliente WebSocket: conecta, escucha eventos y reintenta. |
| [`websocket/publish.js`](../websocket/publish.js) | Publica eventos firmados desde la API al relay. |
| [`src/hooks/useProducts.js`](../src/hooks/useProducts.js) | Integra el hook WebSocket y actualiza el catálogo mediante HTTP. |
| [`src/services/api.js`](../src/services/api.js) | Frontend: `productsApi.all()` recupera el catálogo con `fetch('/api/products')` |
| [`api/index.js`](../api/index.js) | Backend HTTP: guarda altas, ediciones y bajas de productos en PostgreSQL; llama a `notifyProductChanged(id)` |
| [`realtime/server.js`](../realtime/server.js) | Servidor Node.js + `ws` en Render: acepta conexiones `/ws`, recibe `POST /publish` firmado y distribuye avisos |
| [`realtime/package.json`](../realtime/package.json) | Dependencia `ws` y comando de arranque del servidor |
| [`realtime/README.md`](../realtime/README.md) | Detalles técnicos de despliegue, seguridad y pruebas |
| [`src/pages/Catalog.jsx`](../src/pages/Catalog.jsx) | Pantalla del catálogo que consume `useProducts()` |
| [`src/pages/Admin.jsx`](../src/pages/Admin.jsx) | Pantalla del administrador que crea, edita y elimina productos |
| [`src/pages/Academia.jsx`](../src/pages/Academia.jsx) | Guía para estudiar en la ruta `/estudiar` |
| [`src/pages/StudyGuide.jsx`](../src/pages/StudyGuide.jsx) | Otra guía de estudio en `/guia` |

## Flujo de una modificación

1. El administrador edita un producto en `/admin`.
2. React llama a `productsApi.update(...)`, que envía `PUT /api/products/:id`.
3. La API de Vercel actualiza PostgreSQL.
4. `notifyProductChanged(id)` firma un JSON con HMAC-SHA256 y hace `POST` a Render (`/publish`).
5. Render verifica la firma y hace broadcast de `{"type":"products:changed","productId":15}` a los navegadores conectados a `/ws`.
6. `useProducts.js` recibe el aviso y ejecuta `reload({silent:true})`; la nueva información llega por HTTP mediante `GET /api/products`.
7. React actualiza el estado y redibuja el catálogo sin recargar toda la página.

**No confundir:** el carrito usa `StoreContext` y `localStorage`; cambiar el carrito en una pestaña no prueba que haya WebSocket.

## Variables de entorno

| Variable | Dónde | Función |
| --- | --- | --- |
| `VITE_WS_URL` | Vercel (frontend, build) | `wss://miecommerce-realtime.onrender.com/ws` |
| `REALTIME_PUBLISH_URL` | Vercel (API) | `https://miecommerce-realtime.onrender.com/publish` |
| `REALTIME_SECRET` | Vercel API y Render | Mismo secreto privado, mínimo 32 caracteres; **nunca** publicarlo en Git |
| `ALLOWED_ORIGINS` | Render | Orígenes autorizados, por ejemplo `https://miecommerce-pweb2.vercel.app` |
| `PORT` | Render | Puerto asignado por la plataforma |

**No crear un archivo .env con claves reales dentro del repositorio.** `VITE_*` se incorpora al bundle del navegador; jamás colocar secretos allí.

## Despliegue

- **GitHub:** `Ul1se/pWeb2`, rama `feature/frontend-diseno-drive`.
- **Vercel:** frontend React/Vite y API HTTP.
- **Render:** servicio `miecommerce-realtime` (Node.js persistente).
- **Neon:** base PostgreSQL de productos y usuarios.

En Render, desde la raíz del repositorio:

```bash
cd mi-ecommerce-final/frontend/realtime && npm install
cd mi-ecommerce-final/frontend/realtime && npm start
```

Cada comando se ejecuta **por separado desde la raíz**. En la configuración de Render, el Build Command es el primero y el Start Command es el segundo.

## Cómo demostrarlo en clase

1. Abrir `/admin` con una cuenta administradora y `/` en otro navegador.
2. En el segundo navegador, abrir herramientas de desarrollador → Network → WS y localizar la conexión a `/ws`.
3. Editar nombre o stock de un producto en el administrador.
4. Ver el mensaje `products:changed`, la nueva petición `GET /api/products` y el catálogo actualizado.
5. Si no ocurre, revisar estado de Render, `VITE_WS_URL`, `ALLOWED_ORIGINS` y las solicitudes a `/publish`.

**Alcance actual:** las altas, ediciones y bajas administrativas publican eventos. La creación de pedidos también puede modificar stock, pero ese flujo no llama actualmente a `notifyProductChanged`; no afirmar que las compras disparan avisos hasta implementarlo.

## Explicación oral corta

«En el ecommerce usamos WebSocket para avisar que cambió un producto. El administrador guarda el cambio mediante la API HTTP de Vercel en PostgreSQL; la API envía un evento firmado a un servidor Node.js en Render; Render avisa a los clientes conectados. En React, el hook useProducts recibe el evento y vuelve a consultar el catálogo por fetch. Así WebSocket notifica y HTTP obtiene los datos actualizados».
