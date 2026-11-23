# Frontend React — PWEB2 (Manos a la Obra I–V adaptados al ecommerce)

Este frontend vive dentro de `mi-ecommerce-final/frontend` y **no reemplaza** las vistas EJS ni modifica el backend original.

## Correspondencia con los prácticos
1. **I:** SPA React + Vite, estructura de catálogo, encabezado, tarjetas y carrito.
2. **II:** Componentes separados (Layout, ProductCard), páginas, servicios, hooks y contexto.
3. **III:** useState, búsqueda, filtrado, carrito con cantidades y eliminación; localStorage.
4. **IV:** estilos SCSS, Flexbox/Grid, layout responsive y experiencia mobile-first.
5. **V:** API REST real, autenticación JWT, rutas React, panel admin con CRUD de productos.

La consigna original del Manos a la Obra V es un gestor de proyectos; esta es una **adaptación temática al ecommerce**, no una reproducción literal.

## Ejecutar

Terminal 1 — backend:
```bash
cd mi-ecommerce-final
npm install
# Configurar .env con SESSION_SECRET y JWT_SECRET
npm run migrate
npm start
```

Terminal 2 — frontend:
```bash
cd mi-ecommerce-final/frontend
npm install
npm run dev
```

Abrir http://localhost:5173. Vite redirige las peticiones `/api` a Express en http://localhost:3000.

Para otro servidor API, crear `.env.local` en frontend con `VITE_API_URL=https://tu-servidor/api` (no incluir secretos).

## Endpoints utilizados
- GET /api/products
- GET /api/categories
- POST /api/auth/register
- POST /api/auth/login
- POST/PUT/DELETE /api/products (JWT y rol admin)

## Limitaciones y seguridad
- El carrito es **demostrativo**: no envía pedidos ni cobra dinero; el backend existente aún no ofrece un endpoint de checkout.
- El JWT se guarda en localStorage para este ejercicio académico. Para producción, evaluar cookies HttpOnly, protección CSRF, CSP y estrategia segura de sesión.
- El servidor valida los permisos de administrador. Ocultar el enlace en React no constituye autorización.
- Los precios de la API son **enteros**.
- El diseño implementa un tema visual. El modo oscuro es una extensión opcional.
- Ejecutar `npm run build` y probar login, CRUD y carga de catálogo en un entorno con dependencias instaladas antes de presentar la entrega.
