import {ShoppingCart,Trash2} from "lucide-react";
import {money} from "../../ProductCard";
import QuantitySelector from "../../molecules/QuantitySelector";
export default function CartItem({product:p,onChange,onRemove}){return <article className="cart-item"><div className="cart-icon"><ShoppingCart/></div><div className="cart-info"><h3>{p.name}</h3><p>{money(p.price)} por unidad</p><QuantitySelector quantity={p.quantity} onDecrease={()=>p.quantity===1?onRemove(p.id):onChange(p.id,p.quantity-1)} onIncrease={()=>onChange(p.id,p.quantity+1)}/></div><div className="cart-end"><strong>{money(p.price*p.quantity)}</strong><button className="icon-button" onClick={()=>onRemove(p.id)} aria-label="Eliminar producto"><Trash2 size={18}/></button></div></article>}
