import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {Heart,Package} from "lucide-react";
import {useStore} from "../context/StoreContext";
export const money=n=>new Intl.NumberFormat("es-AR",{maximumFractionDigits:0}).format(Number(n)||0);
export default function ProductCard({product}){
 const {session,favorites,toggleFavorite}=useStore(),navigate=useNavigate(),[busy,setBusy]=useState(false);
 const liked=favorites.includes(product.id);
 async function favorite(){if(!session){navigate("/login");return}setBusy(true);try{await toggleFavorite(product.id)}catch(e){window.alert(e.message)}finally{setBusy(false)}}
 return <article className="product-card"><Link className="product-card-link" to={`/products/${product.id}`}>
 <div className="product-visual">{product.image?<img src={product.image} alt={product.name}/>:product.emoji?<span className="product-emoji">{product.emoji}</span>:<Package size={50}/>}</div>
 <div className="product-content"><h3>{product.name}</h3><div className="product-points"><strong>{money(product.price)}</strong><small>PUNTOS</small></div></div></Link>
 <button className={`favorite-button ${liked?"is-favorite":""}`} aria-label={liked?"Quitar de favoritos":"Agregar a favoritos"} title={liked?"Quitar de favoritos":"Agregar a favoritos"} onClick={favorite} disabled={busy} type="button"><Heart size={20} fill={liked?"currentColor":"none"}/></button></article>;
}
