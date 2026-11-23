# Diseño del frontend — MiEcommerce Sprint 1

Fuente: carpeta Google Drive compartida por el usuario: https://drive.google.com/drive/folders/1xs87FmH64hSGP1h6icJUWar2zIfuNOWq

Referencias revisadas:
- DesktopHome.png — cabecera, buscador, categorías, banners, tarjetas y pie.
- DesktopProduct.png — detalle de producto, puntos, imagen y relacionados.
- DesktopCart.png — listado del carrito, cantidades y total.
- DesktopLogin.png — panel de autenticación.
- DesktopRegister.png — formulario de registro.
- MenuDesktop.png — navegación.
- Archivos .fig disponibles como fuentes de diseño en Drive.

Implementación: actualización de Layout, ProductCard, Catalog, Detail, Cart, CartItem y SCSS. Se conserva la API REST existente y el diseño de componentes React del Manos a la Obra II.

Diferencias deliberadas:
- Los banners son HTML/CSS con textos propios; no se copian imágenes promocionales de terceros.
- Se muestran los productos reales del backend, sin inventar catálogo.
- Los precios se presentan como puntos según las maquetas.
- El checkout permanece deshabilitado porque no existe aún un endpoint funcional para procesar pedidos.
- Se incorporan reglas responsive para pantallas pequeñas aunque las referencias proporcionadas son desktop.

Pendiente: ejecutar npm install, npm run build y revisión visual local en navegador.
