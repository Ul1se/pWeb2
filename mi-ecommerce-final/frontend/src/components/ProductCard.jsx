import {Link} from "react-router-dom";
import {Package} from "lucide-react";
export const money=n=>new Intl.NumberFormat("es-AR",{maximumFractionDigits:0}).format(Number(n)||0);
export default function ProductCard({product}){return <Link className="product-card" to={`/products/${product.id}`}><div className="product-visual">{product.image?<img src={product.image} alt={product.name}/>:product.emoji?<span className="product-emoji">{product.emoji}</span>:<Package size={50}/>}</div><div className="product-content"><h3>{product.name}</h3><div className="product-points"><strong>{money(product.price)}</strong><small>PUNTOS</small></div></div></Link>}
