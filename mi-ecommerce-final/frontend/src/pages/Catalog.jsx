import {useMemo,useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Laptop,Utensils,Wine,Shirt,Gamepad2,CarFront,Sofa,Gift} from "lucide-react";
import ProductGrid from "../components/organisms/ProductGrid";
import {useProducts} from "../hooks/useProducts";
const categories=[["Electrónica",Laptop],["Alimentos",Utensils],["Bebidas",Wine],["Indumentaria",Shirt],["Juegos",Gamepad2],["Automotor",CarFront],["Hogar",Sofa],["Otros",Gift]];
function CategoryStrip({selected,onSelect}){return <div className="category-strip">{categories.map(([name,Icon])=><button key={name} className={selected===name?"selected":""} onClick={()=>onSelect(selected===name?"Todas":name)}><Icon size={29}/><span>{name}</span></button>)}</div>}
export default function Catalog(){
 const {products,loading,error,reload}=useProducts();const [params]=useSearchParams();const [category,setCategory]=useState("Todas");const query=(params.get("q")||"").trim().toLowerCase();
 const filtered=useMemo(()=>products.filter(p=>(category==="Todas"||String(p.category).toLowerCase()===category.toLowerCase())&&[p.name,p.description].join(" ").toLowerCase().includes(query)),[products,category,query]);
 const recommended=filtered.filter(p=>p.featured);const first=recommended.length?recommended:filtered.slice(0,4);
 return <><section className="catalog-top"><CategoryStrip selected={category} onSelect={setCategory}/></section><section className="promos"><div className="promo"><span>MI ECOMMERCE</span><h2>Beneficios para vos</h2><p>Encontrá tus productos favoritos y canjealos con puntos.</p></div><div className="promo promo-two"><span>OFERTAS</span><h2>Descubrí más</h2><p>Explorá las categorías y elegí lo que más te guste.</p></div></section><section className="section"><h2>Te puede interesar</h2>{loading?<div className="notice">Cargando productos...</div>:error?<div className="notice error">{error}<button onClick={reload}>Reintentar</button></div>:first.length?<ProductGrid products={first}/>:<div className="notice">No se encontraron productos.</div>}</section><section className="section"><h2>{query?"Resultados de búsqueda":"Los más pedidos"}</h2>{!loading&&!error&&(filtered.length?<ProductGrid products={filtered}/>:<div className="notice">No hay productos en esta categoría.</div>)}</section><CategoryStrip selected={category} onSelect={setCategory}/></>;
}
