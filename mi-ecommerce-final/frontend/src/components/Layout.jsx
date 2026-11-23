import {useEffect,useRef,useState} from "react";
import {NavLink,Outlet,useNavigate} from "react-router-dom";
import {ShoppingCart,Search,UserRound,LogOut,Home,ShoppingBag,Heart,History,Sun,Moon,ChevronDown,BookOpen} from "lucide-react";
import {useStore} from "../context/StoreContext";
export default function Layout(){
 const {count,session,setSession}=useStore(),navigate=useNavigate();
 const [open,setOpen]=useState(false),[theme,setTheme]=useState(()=>{try{return localStorage.getItem("miecommerce-theme")||"light"}catch{return "light"}});
 const menuRef=useRef(null);
 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem("miecommerce-theme",theme)},[theme]);
 useEffect(()=>{function close(e){if(menuRef.current&&!menuRef.current.contains(e.target))setOpen(false)}function esc(e){if(e.key==="Escape")setOpen(false)}document.addEventListener("pointerdown",close);document.addEventListener("keydown",esc);return()=>{document.removeEventListener("pointerdown",close);document.removeEventListener("keydown",esc)}},[]);
 const toggleTheme=()=>{setTheme(t=>t==="light"?"dark":"light");setOpen(false)};
 return <div className="site-shell"><header className="topbar">
 <NavLink to="/" className="brand"><strong>Mi</strong>Ecommerce</NavLink>
 <form className="header-search" onSubmit={e=>{e.preventDefault();navigate("/?q="+encodeURIComponent(e.currentTarget.elements.q.value))}}><input name="q" placeholder="Buscar productos..." aria-label="Buscar productos"/><button type="submit" aria-label="Buscar"><Search size={20}/></button></form>
 <nav aria-label="Navegación"><NavLink className="study-nav-link" to="/estudiar"><BookOpen size={17}/>Guía de estudio</NavLink><NavLink className="cart-nav" to="/cart" aria-label="Ver carrito"><ShoppingCart size={22}/>{count>0&&<span className="count">{count}</span>}</NavLink>
 {session?<div className="profile-menu-wrap" ref={menuRef}><button className="profile-trigger" aria-expanded={open} aria-haspopup="menu" onClick={()=>setOpen(o=>!o)}>
 <span className="profile-avatar">{session.user?.avatar_url?<img src={session.user.avatar_url} alt="" onError={e=>e.currentTarget.style.display="none"}/>:<UserRound size={18}/>}</span><span className="profile-trigger-name">{session.user?.name||"Mi perfil"}</span><ChevronDown size={15}/></button>
 {open&&<div className="profile-dropdown" role="menu" aria-label="Menú de perfil">
 <NavLink to="/perfil" className="profile-dropdown-head" role="menuitem" onClick={()=>setOpen(false)}><span className="profile-avatar avatar-medium">{session.user?.avatar_url?<img src={session.user.avatar_url} alt=""/>:<UserRound size={25}/>}</span><span><strong>{session.user?.name||"Mi cuenta"}</strong><small>Ver mi perfil</small></span></NavLink>
 <div className="profile-dropdown-links">
 <NavLink role="menuitem" to="/" end onClick={()=>setOpen(false)}><Home size={19}/>Inicio</NavLink>
 <NavLink role="menuitem" to="/mis-compras" onClick={()=>setOpen(false)}><ShoppingBag size={19}/>Mis Compras</NavLink>
 <NavLink role="menuitem" to="/favoritos" onClick={()=>setOpen(false)}><Heart size={19}/>Favoritos</NavLink>
 <NavLink role="menuitem" to="/historial" onClick={()=>setOpen(false)}><History size={19}/>Historial</NavLink>
 {session.user?.role==="admin"&&<NavLink role="menuitem" to="/admin" onClick={()=>setOpen(false)}><UserRound size={19}/>Administración</NavLink>}
 </div>
 <div className="profile-dropdown-footer"><button role="menuitem" onClick={toggleTheme}>{theme==="light"?<Moon size={20}/>:<Sun size={20}/>}Cambiar a Tema {theme==="light"?"Oscuro":"Claro"}</button><button role="menuitem" onClick={()=>{setSession(null);setOpen(false);navigate("/")}}><LogOut size={20}/>Cerrar sesión</button></div>
 </div>}</div>:<><NavLink className="user-pill" to="/login"><UserRound size={17}/>Ingresar</NavLink><button className="theme-guest" type="button" onClick={toggleTheme} aria-label={theme==="light"?"Activar tema oscuro":"Activar tema claro"}>{theme==="light"?<Moon size={19}/>:<Sun size={19}/>}</button></>}
 </nav></header><main className="container"><Outlet/></main><footer className="footer"><span>♥　●　◎　▶</span><small>© MiEcommerce. Todos los derechos reservados.</small><span> App Store　▷ Google Play</span></footer></div>;
}
