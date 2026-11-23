import {useEffect,useMemo,useState} from "react";
import {Link,useNavigate,useParams,Navigate} from "react-router-dom";
import {Search,ArrowRight,ShoppingCart,Trash2,Minus,Plus,ShieldCheck} from "lucide-react";
import ProductCard,{money} from "../components/ProductCard";
import {useStore} from "../context/StoreContext";
import {useProducts} from "../hooks/useProducts";
import {authApi,productsApi} from "../services/api";
import SearchBar from "../components/molecules/SearchBar";
import ProductGrid from "../components/organisms/ProductGrid";
function Catalog(){
 const {products,loading,error,reload}=useProducts();
 const [query,setQuery]=useState(""),[category,setCategory]=useState("Todas");
 const categories=["Todas",...new Set(products.map(p=>p.category).filter(Boolean))];
 const filtered=useMemo(()=>products.filter(p=>(category==="Todas"||p.category===category)&&[p.name,p.description].join(" ").toLowerCase().includes(query.toLowerCase())),[products,category,query]);
 return <><section className="hero"><div><span className="pill">TU TIENDA ONLINE</span><h1>Encontrá lo que <em>te gusta.</em></h1><p>Explorá productos, elegí tus favoritos y armá tu carrito. Todo desde una experiencia simple y moderna.</p><a href="#catalogo" className="hero-cta">Ver productos <ArrowRight size={18}/></a></div><div className="hero-art"><ShoppingCart size={110}/><span>SHOP</span></div></section><section id="catalogo" className="section"><div className="section-heading"><div><span className="eyebrow">NUESTRO CATÁLOGO</span><h2>Productos destacados</h2></div><span className="muted">{filtered.length} productos</span></div><div className="filters"><SearchBar value={query} onChange={setQuery}/><select aria-label="Filtrar por categoría" value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></div>{loading?<div className="notice">Cargando productos desde la API...</div>:error?<div className="notice error">{error} <button onClick={reload}>Reintentar</button></div>:filtered.length?<ProductGrid products={filtered}/>:<div className="notice">No hay productos que coincidan con tu búsqueda.</div>}</section></>;
}
export default Catalog;
