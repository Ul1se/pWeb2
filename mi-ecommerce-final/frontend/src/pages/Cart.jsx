import {Link} from "react-router-dom";
import {useStore} from "../context/StoreContext";
import CartItem from "../components/organisms/CartItem";
import {money} from "../components/ProductCard";
export default function Cart(){const {cart,change,remove,total}=useStore();return <section className="cart-page"><Link className="breadcrumb" to="/">← Volver</Link><h1>Productos en tu Carrito</h1>{cart.length?<><div className="cart-items">{cart.map(p=><CartItem key={p.id} product={p} onChange={change} onRemove={remove}/>)}</div><div className="cart-total"><span>Total de Puntos</span><strong>{money(total)}</strong></div><div className="cart-checkout"><button disabled title="El backend todavía no procesa pedidos">Ir a Pagar</button><small>Checkout no disponible en esta entrega académica.</small></div></>:<div className="notice">Tu carrito está vacío. <Link to="/">Ver productos</Link></div>}</section>}
