# Servicio WebSocket de MiEcommerce

El frontend sigue consultando el catálogo por HTTP. El servicio WebSocket envía invalidaciones cuando el administrador crea, modifica o elimina productos.

## Despliegue

Este servicio necesita un host Node.js **persistente** con soporte para WebSockets (por ejemplo, un servicio web de Render o Railway); no funciona como función serverless normal de Vercel.

1. Crear un servicio Node.js con directorio raíz `mi-ecommerce-final/frontend/realtime`.
2. Instalar dependencias con `npm install` y arrancar con `npm start`.
3. Configurar `REALTIME_SECRET` (cadena aleatoria de 32+ caracteres) y `ALLOWED_ORIGINS=https://miecommerce-pweb2.vercel.app`. El proveedor suministra `PORT`.
4. Configurar en **el proyecto Vercel** `REALTIME_PUBLISH_URL=https://TU-SERVICIO/publish` y el **mismo** `REALTIME_SECRET`.
5. Configurar en Vercel `VITE_WS_URL=wss://TU-SERVICIO/ws` (variable de compilación de Vite).
6. Hacer un nuevo despliegue de Vercel para que el navegador reciba `VITE_WS_URL`.
7. Abrir dos navegadores y modificar el stock desde /admin: la grilla se actualiza sin recargar.

## Seguridad y límites

`/publish` exige firma HMAC SHA-256 en la cabecera `x-realtime-signature`. No exponer el secreto al frontend. `/ws` verifica el origen del navegador. Para múltiples instancias del relay, agregar un bus compartido (Redis/pubsub) para distribuir eventos. Si el relay cae, el catálogo y las compras siguen funcionando mediante HTTP; los cambios en tiempo real quedan suspendidos.

`GET /health` informa disponibilidad y cantidad de conexiones.

Los eventos se envían **después** de guardar la modificación SQL. No hay garantía de entrega si el relay está caído: al reconectar, el hook recarga el catálogo por HTTP.
