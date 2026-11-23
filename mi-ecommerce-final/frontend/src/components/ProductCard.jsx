import {Link} from "react-router-dom";
import {ShoppingCart,Package} from "lucide-react";
import {useStore} from "../context/StoreContext";
export const money=n=>new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(Number(n)||0);
export default function ProductCard({product}){
 const {add}=useStore();
 return <article className="product-card"><div className="product-visual">{product.image?<img src={product.image} alt={product.name} onError={e=>e.currentTarget.style.display="none"}/>:<Package size={52}/>}</div><div className="product-content"><span className="eyebrow">{product.category||"Producto"}</span><h3><Link to={`/products/${product.id}`}>{product.name}</Link></h3><p>{product.description||"Conocé este producto en nuestra tienda."}</p><div className="product-bottom"><strong>{money(product.price)}</strong><button onClick={()=>add(product)} aria-label={`Agregar ${product.name} al carrito`}><ShoppingCart size={16}/> Agregar</button></div></div></article>;
}
