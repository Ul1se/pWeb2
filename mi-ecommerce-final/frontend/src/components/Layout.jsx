import {NavLink,Outlet} from "react-router-dom";
import {ShoppingBag,ShoppingCart,LayoutDashboard,LogIn,LogOut,Package} from "lucide-react";
import {useStore} from "../context/StoreContext";
export default function Layout(){
 const {count,session,setSession}=useStore();
 return <><header className="topbar"><NavLink to="/" className="brand"><ShoppingBag size={25}/> Puntos<span>Club</span></NavLink><nav aria-label="Navegación principal"><NavLink to="/"><Package size={17}/> Catálogo</NavLink><NavLink to="/cart"><ShoppingCart size={17}/> Carrito <b className="count">{count}</b></NavLink>{session?.user?.role==="admin"&&<NavLink to="/admin"><LayoutDashboard size={17}/> Admin</NavLink>}{session?<button className="nav-button" onClick={()=>setSession(null)}><LogOut size={17}/> Salir</button>:<NavLink to="/login"><LogIn size={17}/> Ingresar</NavLink>}</nav></header><main className="container"><Outlet/></main><footer className="footer">PuntosClub · Programación Web 2026 · React + Express + SQLite</footer></>;
}
