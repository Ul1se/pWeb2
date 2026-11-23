import {Minus,Plus} from "lucide-react";
export default function QuantitySelector({quantity,onDecrease,onIncrease}){return <div className="qty"><button aria-label="Reducir cantidad" onClick={onDecrease}><Minus size={15}/></button><span>{quantity}</span><button aria-label="Aumentar cantidad" onClick={onIncrease}><Plus size={15}/></button></div>}
