# WebSocket — Mi Ecommerce

Carpeta de código real (no copias). Rama `feature/frontend-diseno-drive`.

- [useWebSocket.js](useWebSocket.js): conexión del navegador a `VITE_WS_URL`, recepción de `products:changed`, reconexión y limpieza de efectos.
- [publish.js](publish.js): envío del evento firmado con HMAC SHA-256 desde el backend HTTP al relay.
- [Servidor WebSocket](../realtime/server.js): servidor Node.js + ws, ruta /ws, broadcast, heartbeat y validación de origen. Permanece en realtime/ porque es el directorio de despliegue independiente de Render.
- [Dependencias del servidor](../realtime/package.json).
- [Configuración detallada y prueba](../WEBSOCKET_CONFIG/README.md).
- [Hook de productos](../src/hooks/useProducts.js): consulta HTTP y llama a useWebSocket.
- [API HTTP](../api/index.js): CRUD de productos en PostgreSQL y llamada a notifyProductChanged.
- [Catálogo](../src/pages/Catalog.jsx) y [Administrador](../src/pages/Admin.jsx): consumidores de la funcionalidad.

## Flujo
Administrador → API REST → PostgreSQL (Neon) → publish.js → Render /publish → WebSocket /ws → useWebSocket.js → useProducts.js → GET /api/products → React.

El carrito de React usa StoreContext y localStorage; no se sincroniza mediante este WebSocket. Las altas, ediciones y bajas administrativas publican eventos; no se ha verificado el flujo de compras ni el despliegue en vivo con esta reorganización.

Para comprobarlo: abrir catálogo y administrador en dos navegadores, editar un producto y observar en Network → WS el evento products:changed seguido de GET /api/products. Revisar VITE_WS_URL, REALTIME_PUBLISH_URL, REALTIME_SECRET y ALLOWED_ORIGINS si falla. No guardar secretos en Git.
