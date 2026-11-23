import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {useStore} from "../context/StoreContext";
import CartItem from "../components/organisms/CartItem";
import {money} from "../components/ProductCard";
import {ordersApi} from "../services/api";
export default function Cart(){
 const {cart,change,remove,total,clear,session}=useStore();
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[confirmed,setConfirmed]=useState(null);
 const navigate=useNavigate();
 async function checkout(){
  setError("");if(!session?.token){navigate("/login");return}
  setBusy(true);
  try{const order=await ordersApi.create(cart.map(p=>({id:p.id,quantity:p.quantity})),session.token);clear();setConfirmed(order)}
  catch(e){setError(e.message)}finally{setBusy(false)}
 }
 return <section className="cart-page"><Link className="breadcrumb" to="/">← Volver</Link><h1>Productos en tu carrito</h1>
 {confirmed?<div className="notice"><h2>¡Pedido confirmado!</h2><p>Pedido N.º {confirmed.id} · {money(confirmed.total)}</p><Link className="button" to="/">Seguir comprando</Link></div>:
 cart.length?<><div className="cart-items">{cart.map(p=><CartItem key={p.id} product={p} onChange={change} onRemove={remove}/>)}</div>
 <div className="cart-total"><span>Total a pagar</span><strong>{money(total)}</strong></div>
 <div className="cart-checkout"><button onClick={checkout} disabled={busy}>{busy?"Confirmando...":"Confirmar pedido"}</button>
 {!session&&<small>Ingresá a tu cuenta para confirmar el pedido.</small>}{error&&<p role="alert" className="error-text">{error}</p>}</div></>:
 <div className="notice">Tu carrito está vacío. <Link to="/">Ver productos</Link></div>}</section>
}