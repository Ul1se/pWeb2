import {Search} from "lucide-react";
export default function SearchBar({value,onChange}){return <label className="search"><Search size={18}/><input aria-label="Buscar productos" placeholder="Buscar productos..." value={value} onChange={e=>onChange(e.target.value)}/></label>}
