import {useState} from "react";
import {Link} from "react-router-dom";
import {BookOpen,Layers,Server,Database,Monitor,ShieldCheck,ArrowRight,CheckCircle2,Info,Code2} from "lucide-react";

const notion="https://app.notion.com/p/45bd4c11c8b782219a41019b9cb77106";
const sections=[
 {name:"Fundamentos y arquitectura",source:"https://app.notion.com/p/8f9d4c11c8b782bf84728163af8579b8",items:[
  ["Cliente, servidor y HTTP","El navegador envía una solicitud con método y URL; el servidor procesa el pedido y devuelve una respuesta con código de estado, cabeceras y contenido. HTTP es un protocolo sin estado: cada solicitud es independiente.","Cuando MiEcommerce solicita productos, el navegador envía GET /api/products y recibe JSON. Si la consulta funciona, el código HTTP es 200."],
  ["Node.js y npm","Node.js ejecuta JavaScript fuera del navegador, permitiendo construir servidores y herramientas. npm gestiona dependencias y scripts de instalación, desarrollo y compilación.","El proyecto usa npm para instalar React, Vite y el cliente de Neon; Node.js ejecuta las funciones API en Vercel."],
  ["Express y EJS","Express es un framework minimalista para construir servidores, definir rutas y middlewares. EJS es un motor de plantillas que permite generar HTML en el servidor.","Esta combinación se enseñó durante la etapa monolítica; el sitio publicado no usa EJS ni ejecuta un servidor Express permanente."],
  ["Arquitectura monolítica, por capas y MVC","Un monolito agrupa la aplicación en una unidad desplegable. La arquitectura en capas separa presentación, negocio y datos. MVC divide modelo, vista y controlador, evitando mezclar responsabilidades.","MiEcommerce separa componentes y páginas React, un archivo de servicios API, endpoints del servidor y tablas PostgreSQL. Esa organización es una separación de responsabilidades, aunque el backend actual no está distribuido en carpetas MVC clásicas."],
  ["CSR y SSR","En SSR el servidor prepara el HTML final. En CSR el navegador ejecuta JavaScript y renderiza los componentes a partir de datos. Una SPA permite cambiar de vista sin recargar toda la aplicación.","MiEcommerce utiliza CSR con React y React Router. Vite compila el frontend estático y la API devuelve JSON."],
 ]},
 {name:"Backend, datos y seguridad",source:"https://app.notion.com/p/259d4c11c8b783c0907301836c09c04a",items:[
  ["Rutas y métodos HTTP","GET consulta recursos; POST crea; PUT actualiza y DELETE elimina. Una ruta o endpoint combina una dirección con un método. Los estados habituales incluyen 200, 201, 400, 401, 403, 404 y 500.","GET /api/products lista el catálogo; POST /api/auth/register registra; POST /api/orders crea pedidos; PUT /api/products/:id modifica productos con rol administrador."],
  ["Middlewares","Son funciones que intervienen entre la recepción de una petición y la respuesta. Se usan para procesar datos, comprobar permisos, registrar eventos o gestionar errores.","En el curso se estudian middlewares de Express. En el código publicado, el handler API aplica directamente validación de tokens, permisos y manejo de errores; no tiene una cadena de middlewares Express."],
  ["Persistencia y SQL","Persistir significa conservar datos más allá de una ejecución. Se pasa de arreglos y JSON a bases relacionales. Tablas, filas, columnas, claves primarias y foráneas permiten representar entidades y relaciones.","El curso introduce SQLite. MiEcommerce utiliza PostgreSQL de Neon, un motor relacional que almacena usuarios, productos, favoritos y pedidos."],
  ["REST y JSON","Una API permite que clientes diferentes consuman recursos mediante HTTP. REST organiza la interacción alrededor de recursos y operaciones. JSON representa objetos, arreglos y valores intercambiados.","React usa fetch para comunicarse con /api; el servidor valida y consulta PostgreSQL y devuelve objetos JSON."],
  ["Tiempo real y WebSocket","HTTP habitual trabaja con solicitud/respuesta. WebSocket mantiene una conexión bidireccional para enviar actualizaciones sin repetir peticiones. Es útil para chats, estados de stock y notificaciones.","El Notion lo incluye en Sprint 4, pero MiEcommerce publicado no tiene WebSockets ni notificaciones instantáneas. No es correcto presentarlo como implementado."],
  ["Autenticación y autorización","Autenticación comprueba quién es el usuario. Autorización decide qué recursos puede usar. Los tokens firmados permiten presentar identidad en peticiones protegidas. Un JWT estándar tiene tres segmentos.","MiEcommerce valida correo y contraseña y entrega un token firmado propio de dos segmentos, enviado como Bearer. El backend revisa el rol admin antes de modificar productos; no utiliza un JWT estándar de tres segmentos."],
  ["Seguridad de contraseñas","Las contraseñas no deben almacenarse en texto plano. Un hash con sal y función de derivación permite verificarlas sin conocer el original; se deben validar entradas y mantener secretos fuera del frontend.","El servidor guarda hashes PBKDF2 con sal en PostgreSQL; DATABASE_URL y SESSION_SECRET permanecen como variables de entorno de Vercel."],
 ]},
 {name:"Frontend con React",source:"https://app.notion.com/p/3e0d4c11c8b78215908201f141faccec",items:[
  ["Componentes y JSX","React construye la interfaz con componentes reutilizables. JSX permite expresar la estructura visual mediante una sintaxis similar a HTML dentro de JavaScript. Los props entregan información desde un componente padre a uno hijo.","ProductCard recibe un objeto product y muestra su nombre, imagen o emoji y precio. ProductGrid reutiliza ProductCard para listar elementos."],
  ["Estado y eventos","El estado es la información que determina qué se muestra. Los eventos como onClick y onChange ejecutan funciones ante acciones del usuario y provocan actualizaciones del renderizado.","La búsqueda y filtros del catálogo reaccionan a la escritura; el carrito actualiza cantidades, total y contador; el menú de perfil cambia su estado abierto/cerrado."],
  ["Hooks","useState guarda estado; useEffect sincroniza tareas externas; useContext comparte datos; useRef conserva referencias a elementos; los hooks personalizados encapsulan lógica reutilizable.","StoreContext centraliza carrito y sesión; useProducts consulta la API; el menú usa useRef para detectar clics fuera y useEffect para los listeners."],
  ["Estilos, Sass y diseño responsive","CSS define colores, tipografía, espaciados y layouts. Flexbox y Grid estructuran componentes; media queries adaptan la vista a pantallas diferentes. Sass amplía las hojas de estilo.","styles.scss contiene reglas globales, tarjetas, cuadrículas y diseño móvil. La preferencia tema claro/oscuro cambia atributos y clases visuales."],
  ["Fetch y asincronía","fetch permite solicitar datos HTTP. Con async/await el código espera una respuesta y maneja errores con try/catch. Es importante mostrar carga, error y resultados.","services/api.js centraliza peticiones y useProducts devuelve products, loading, error y reload. Esto evita duplicar llamadas en todas las páginas."],
  ["Routing con React Router","Las rutas asocian URLs a componentes. Las rutas dinámicas como /products/:id permiten mostrar recursos concretos. Outlet ubica las páginas dentro de un layout compartido.","App.jsx define /, /products/:id, /cart, /login, /perfil, /mis-compras, /favoritos, /historial y /admin."],
  ["Formularios controlados","En formularios controlados el valor de cada input está asociado a useState y se actualiza con onChange. onSubmit permite validar y enviar datos.","Login.jsx administra nombre, correo, contraseña, modo de registro y errores. Profile.jsx permite modificar nombre y URL de avatar."],
  ["Compilación y despliegue","Vite se utiliza en el entorno de desarrollo y genera el paquete optimizado de frontend; npm run build crea archivos estáticos publicables.","Vercel compila el frontend React y aloja tanto los archivos del sitio como las funciones API."],
 ]}
];
const mappings={
 "frontend":[
 ["Interfaz y componentes","src/components/ProductCard.jsx, ProductGrid/index.jsx y Layout.jsx","Cada componente concentra una responsabilidad visual; se reutiliza con datos diferentes."],
 ["Navegación y SPA","src/App.jsx y React Router","Las rutas cambian de página dentro de una aplicación React sin pedir HTML nuevo por cada vista."],
 ["Estado compartido","src/context/StoreContext.jsx","El contexto comparte sesión, favoritos y carrito. El carrito se mantiene localmente hasta confirmar la compra; los pedidos confirmados se envían a la base."],
 ["Peticiones asíncronas","src/services/api.js y src/hooks/useProducts.js","fetch obtiene productos del servidor. Se manejan indicadores de carga y errores."],
 ["Formularios","src/pages/Login.jsx, Profile.jsx y Admin.jsx","Los inputs controlados recogen valores; la API valida la información del lado del servidor."],
 ["Diseño responsive","src/styles.scss","Media queries, CSS Grid y Flexbox permiten adaptar el layout y el menú de usuario a celular y escritorio."]
 ],
 "backend":[
 ["Servidor HTTP","api/index.js (función serverless Node.js)","Recibe solicitudes, interpreta la ruta, valida datos y devuelve JSON con códigos HTTP. No es un Express permanente."],
 ["REST","GET /api/products, GET /api/categories, POST /api/orders","Los endpoints representan recursos y operaciones con métodos HTTP."],
 ["Registro y acceso","POST /api/auth/register, POST /api/auth/login, GET /api/auth/me","Crea cuentas y verifica credenciales; envía un token firmado propio y verifica su validez."],
 ["Autorización","Validaciones en api/index.js","La API comprueba el usuario y el rol admin antes de permitir operaciones de alta, edición o eliminación de productos."],
 ["Compras e historial","POST /api/orders, GET /api/orders, GET /api/orders/:id","Los pedidos se registran en el servidor y se consultan asociados al usuario autenticado."],
 ["Favoritos y perfil","GET /api/favorites, POST/DELETE /api/favorites/:id y PUT /api/auth/profile","Se persistencia la relación usuario-producto y cambios del perfil mediante SQL parametrizado."],
 ["Seguridad y restricciones","PBKDF2, token HMAC, variables de entorno","La contraseña se guarda como hash con sal. El frontend no recibe DATABASE_URL ni SESSION_SECRET."],
 ["Comunicación en tiempo real","Teoría del Sprint 4","WebSockets forman parte del programa, pero no están implementados en la versión desplegada."]
 ],
 "database":[
 ["PostgreSQL en Neon","Base miecommerce","Motor relacional alojado fuera del navegador. El backend utiliza una conexión configurada en Vercel."],
 ["users","id, name, email, password_hash, role, avatar_url","Almacena cuentas; email es único. El rol determina el acceso administrativo."],
 ["categories","id, name","Clasifica productos sin repetir los nombres de categorías en cada registro."],
 ["products","id, name, description, price, stock, category_id, featured","category_id es clave foránea hacia categories. El catálogo consulta un JOIN para mostrar el nombre de categoría."],
 ["orders","id, user_id, total, status, created_at","Cada compra pertenece a un usuario por una clave foránea."],
 ["order_items","order_id, product_id, quantity, unit_price","Representa los renglones del pedido. Conserva el precio unitario registrado al confirmar."],
 ["favorites","user_id, product_id, created_at","Tabla asociativa con clave compuesta; modela la relación muchos-a-muchos entre usuarios y productos."],
 ["Integridad referencial","PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK","Las restricciones evitan claves repetidas, relaciones inválidas y cantidades o precios negativos."],
 ["Consultas parametrizadas","SQL con variables enlazadas","Los datos ingresados no se concatenan directamente en cadenas SQL: se envían como parámetros para reducir riesgos de inyección."]
 ]};
const questions=[
 ["¿Cuál es la arquitectura actual?","Frontend SPA React con renderizado en cliente, funciones API de Node.js en Vercel y PostgreSQL en Neon. Tiene separación entre presentación, servidor y datos."],
 ["¿Qué diferencia hay entre frontend y backend?","El frontend muestra información y recibe eventos. El backend valida reglas, autoriza operaciones y accede a la base de datos."],
 ["¿Por qué no alcanza con localStorage?","localStorage pertenece a un navegador y no sincroniza cuentas y pedidos entre dispositivos. PostgreSQL ofrece persistencia compartida y restricciones relacionales."],
 ["¿Qué diferencia hay entre autenticación y autorización?","Autenticación verifica la identidad con email y contraseña; autorización comprueba permisos, por ejemplo si una persona es administradora."],
 ["¿Se usa JWT tal como explica Notion?","No exactamente. El proyecto utiliza un token firmado con HMAC y vencimiento, pero con dos partes en vez de la estructura estándar JWT de tres partes."],
 ["¿Dónde se utiliza MVC?","El curso lo enseña en Express con modelos, vistas EJS y controladores. La versión React actual aplica separación de responsabilidades, pero no conserva esa estructura MVC clásica en el servidor."],
 ["¿Qué hace useEffect?","Ejecuta sincronizaciones con sistemas externos, como obtener productos cuando el componente se monta o administrar listeners."],
 ["¿Cuándo se actualiza la base de datos?","El catálogo se lee desde PostgreSQL; las cuentas, favoritos y pedidos se escriben a través de endpoints. El carrito previo a confirmar es estado local."],
 ["¿Qué función cumple Vercel?","Publica los archivos frontend y ejecuta las rutas API como funciones bajo demanda. Neon aloja PostgreSQL por separado."],
 ["¿Tiene WebSockets?","No. La teoría de tiempo real está en Notion, pero la versión publicada responde mediante peticiones HTTP."],
];
function Accordion({title,children}){return <details className="study-detail"><summary>{title}</summary><div className="study-detail-body">{children}</div></details>}
function Tab({name,active,onClick}){return <button className={active?"study-tab active":"study-tab"} onClick={onClick} type="button">{name}</button>}
export default function StudyGuide(){
 const [mode,setMode]=useState("theory"),[layer,setLayer]=useState("frontend");
 return <div className="study-page">
 <div className="study-hero"><span className="study-kicker"><BookOpen size={17}/> GUÍA DE ESTUDIO Y DEFENSA</span><h1>Programación Web aplicada a MiEcommerce</h1>
 <p>Teoría del programa 2026 de UNViMe, explicada para exponer y vinculada con las decisiones técnicas del proyecto publicado.</p>
 <div className="study-hero-actions"><a href={notion} target="_blank" rel="noreferrer">Abrir programa de Notion ↗</a><Link to="/">Ver la tienda <ArrowRight size={16}/></Link></div></div>
 <div className="study-tabs" role="tablist" aria-label="Secciones de la guía"><Tab name="1. Teoría de Notion" active={mode==="theory"} onClick={()=>setMode("theory")}/><Tab name="2. Aplicación en MiEcommerce" active={mode==="practice"} onClick={()=>setMode("practice")}/><Tab name="3. Preguntas de defensa" active={mode==="questions"} onClick={()=>setMode("questions")}/></div>
 {mode==="theory"&&<section className="study-content"><h2>Parte 1 · Fundamentos teóricos</h2><p>La asignatura comienza con Express, SSR, MVC y persistencia; luego introduce API REST, seguridad, React y herramientas del frontend. Abrí cada concepto para conocer la explicación y un ejemplo del sistema.</p>
 {sections.map((section,i)=><div className="study-section" key={section.name}><div className="study-section-head"><span>{String(i+1).padStart(2,"0")}</span><div><h3>{section.name}</h3><a href={section.source} target="_blank" rel="noreferrer">Consultar unidad original de Notion ↗</a></div></div>
 {section.items.map(([title,description,example])=><Accordion key={title} title={title}><p><strong>Teoría:</strong> {description}</p><p><strong>Relación con MiEcommerce:</strong> {example}</p></Accordion>)}</div>)}
 <div className="study-note"><Info size={20}/><p>Importante: la materia enseña SQLite, EJS, Express, JWT y WebSockets. La versión actual del sitio utiliza PostgreSQL, React y funciones serverless, y no incluye EJS ni WebSockets. La diferencia es parte de la explicación arquitectónica.</p></div></section>}
 {mode==="practice"&&<section className="study-content"><h2>Parte 2 · Cómo se aplica la teoría</h2><p>Esta sección relaciona conceptos del Notion con archivos, endpoints y tablas reales del proyecto. Elegí una capa para estudiar sus responsabilidades.</p>
 <div className="study-architecture"><div><Monitor size={26}/><strong>Frontend</strong><small>React · Vite · Router</small></div><span>HTTP · JSON →</span><div><Server size={26}/><strong>Backend</strong><small>Node.js · API en Vercel</small></div><span>SQL →</span><div><Database size={26}/><strong>Base de datos</strong><small>PostgreSQL · Neon</small></div></div>
 <div className="study-subtabs"><Tab name="Frontend" active={layer==="frontend"} onClick={()=>setLayer("frontend")}/><Tab name="Backend" active={layer==="backend"} onClick={()=>setLayer("backend")}/><Tab name="Base de datos" active={layer==="database"} onClick={()=>setLayer("database")}/></div>
 <div className="study-mappings">{mappings[layer].map(([title,source,explain])=><article key={title}><span className="study-mapping-icon">{layer==="frontend"?<Monitor size={20}/>:layer==="backend"?<Server size={20}/>:<Database size={20}/>}</span><div><h3>{title}</h3><code>{source}</code><p>{explain}</p></div></article>)}</div>
 <h3>Ejemplo completo: confirmar un pedido</h3>
 <ol className="study-steps"><li>El usuario selecciona productos en React; StoreContext mantiene el carrito.</li><li>Al confirmar, Cart.jsx llama a ordersApi.create con un token y los IDs/cantidades.</li><li>La función API valida la identidad y comprueba los datos y el stock.</li><li>El backend consulta PostgreSQL y registra el pedido en orders junto a sus elementos en order_items.</li><li>La API devuelve JSON con el número de pedido y el total; React muestra la confirmación y vacía el carrito local.</li><li>El perfil recupera los pedidos desde GET /api/orders para mostrarlos en Mis Compras e Historial.</li></ol>
 </section>}
 {mode==="questions"&&<section className="study-content"><h2>Parte 3 · Preguntas para practicar la defensa</h2><p>Intentá responder en voz alta antes de desplegar la explicación.</p>{questions.map(([q,a],i)=><Accordion title={String(i+1)+". "+q} key={q}><p>{a}</p></Accordion>)}
 <div className="study-note"><CheckCircle2 size={22}/><p><strong>Guion de cierre:</strong> «MiEcommerce demuestra la evolución estudiada en Programación Web: de comprender HTTP y la arquitectura monolítica a crear una SPA React que consulta una API y guarda datos en PostgreSQL. El usuario interactúa con componentes reutilizables; el servidor verifica solicitudes y permisos; y la base de datos conserva productos, usuarios, favoritos y compras».</p></div></section>}
 <div className="study-bottom"><Link to="/">Volver al ecommerce</Link><a href={notion} target="_blank" rel="noreferrer">Fuente: Programación Web 2026 — UNViMe ↗</a></div>
 </div>;
}
