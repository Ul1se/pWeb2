import {useEffect,useMemo,useState} from "react";
import {Link,useNavigate,useParams,Navigate} from "react-router-dom";
import {Search,ArrowRight,ShoppingCart,Trash2,Minus,Plus,ShieldCheck} from "lucide-react";
import ProductCard,{money} from "../components/ProductCard";
import {useStore} from "../context/StoreContext";
import {useProducts} from "../hooks/useProducts";
import {authApi,productsApi} from "../services/api";
import CartItem from "../components/organisms/CartItem";
function Cart(){const {cart,change,remove,total,clear}=useStore();return <section className="section"><div className="section-heading"><div><span className="eyebrow">TU COMPRA</span><h1>Mi carrito</h1></div></div>{!cart.length?<div className="notice"><ShoppingCart size={42}/><h3>Tu carrito está vacío</h3><p>Agregá productos desde el catálogo.</p><Link className="button" to="/">Explorar productos</Link></div>:<div className="cart-layout"><div>{cart.map(p=><CartItem key={p.id} product={p} onChange={change} onRemove={remove}/>)}</div><aside className="summary"><h3>Resumen del pedido</h3><div className="summary-line"><span>Subtotal</span><strong>{money(total)}</strong></div><div className="summary-line"><span>Envío</span><span>A coordinar</span></div><hr/><div className="summary-line total"><span>Total</span><strong>{money(total)}</strong></div><p className="muted">Carrito demostrativo. El backend actual no tiene un endpoint de creación de pedidos.</p><button className="secondary" onClick={clear}>Vaciar carrito</button></aside></div>}</section>}
export default Cart;
