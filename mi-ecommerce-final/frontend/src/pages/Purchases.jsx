import {useEffect,useState} from "react";
import {Link,useParams} from "react-router-dom";
import {ShoppingBag,Clock3,PackageCheck} from "lucide-react";
import {ordersApi} from "../services/api";
import {useStore} from "../context/StoreContext";
import {money} from "../components/ProductCard";
export default function Purchases({history=false}){
 const {session}=useStore(),[orders,setOrders]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[selected,setSelected]=useState(null),[details,setDetails]=useState(null);
 useEffect(()=>{if(!session){setLoading(false);return}let active=true;setLoading(true);ordersApi.all(session.token).then(d=>{if(active)setOrders(d)}).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[session?.token]);
 async function inspect(id){if(selected===id){setSelected(null);return}setSelected(id);setDetails(null);try{setDetails(await ordersApi.details(id,session.token))}catch(e){setError(e.message)}}
 if(!session)return <div className="notice"><h2>Ingresá a tu cuenta</h2><p>Para ver tus compras, iniciá sesión.</p><Link className="button" to="/login">Ingresar</Link></div>;
 return <section className="account-page"><Link className="breadcrumb" to="/perfil">← Mi perfil</Link><span className="eyebrow">{history?"MOVIMIENTOS DE TU CUENTA":"TUS PEDIDOS"}</span><h1>{history?"Historial":"Mis compras"}</h1><p className="muted">{history?"Revisá tus compras anteriores y sus detalles.":"Consultá los pedidos registrados en tu cuenta."}</p>
 {loading?<div className="notice">Cargando compras...</div>:error?<div className="notice error">{error}</div>:orders.length===0?<div className="notice"><ShoppingBag size={40}/><h3>Todavía no tenés compras</h3><p>Encontrá productos y realizá tu primer pedido.</p><Link className="button" to="/">Ver productos</Link></div>:
 <div className="order-list">{orders.map(o=><article className="order-card" key={o.id}><div className="order-main"><span className="order-icon">{history?<Clock3/>:<PackageCheck/>}</span><div><strong>Pedido #{o.id}</strong><small>{new Date(o.created_at).toLocaleString("es-AR",{dateStyle:"medium",timeStyle:"short"})}</small><span className="order-status">{o.status==="confirmed"?"Confirmado":o.status}</span></div><strong className="order-value">{money(o.total)} puntos</strong><button className="secondary" onClick={()=>inspect(o.id)} aria-expanded={selected===o.id}>{selected===o.id?"Ocultar":"Ver detalle"}</button></div>
 {selected===o.id&&(details?.id===o.id?<div className="order-details">{details.items.map((p,i)=><div key={i}><span>{p.emoji||"📦"} {p.name||"Producto"} × {p.quantity}</span><strong>{money(p.unit_price*p.quantity)} pts</strong></div>)}</div>:<p className="muted">Cargando detalle...</p>)}</article>)}</div>}</section>
}
