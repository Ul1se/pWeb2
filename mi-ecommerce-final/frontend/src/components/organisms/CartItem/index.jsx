import {Package} from "lucide-react";
import {money} from "../../ProductCard";
import QuantitySelector from "../../molecules/QuantitySelector";
export default function CartItem({product:p,onChange,onRemove}){return <article className="cart-item"><div className="cart-icon">{p.image?<img src={p.image} alt=""/>:p.emoji?<span>{p.emoji}</span>:<Package/>}</div><h3>{p.name}</h3><button className="remove-pill" onClick={()=>onRemove(p.id)}>Quitar</button><QuantitySelector quantity={p.quantity} onDecrease={()=>p.quantity===1?onRemove(p.id):onChange(p.id,p.quantity-1)} onIncrease={()=>onChange(p.id,p.quantity+1)}/><strong>{money(p.price*p.quantity)}</strong></article>}
