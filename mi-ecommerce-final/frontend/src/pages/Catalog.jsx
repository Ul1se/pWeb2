import {useMemo,useState} from "react";
import {Link,useSearchParams} from "react-router-dom";
import {Laptop,Utensils,Wine,Shirt,Gamepad2,CarFront,Sofa,Gift,ArrowUpRight,Package,Sparkles} from "lucide-react";
import ProductGrid from "../components/organisms/ProductGrid";
import {useProducts} from "../hooks/useProducts";
import {money} from "../components/ProductCard";
import "../storefront.scss";

const categories=[["Electrónica",Laptop],["Alimentos",Utensils],["Bebidas",Wine],["Indumentaria",Shirt],["Juegos",Gamepad2],["Automotor",CarFront],["Hogar",Sofa],["Otros",Gift]];
function CategoryStrip({selected,onSelect}){
 return <nav className="category-strip" aria-label="Explorar categorías">{categories.map(([name,Icon])=><button key={name} type="button" aria-pressed={selected===name} className={selected===name?"selected":""} onClick={()=>onSelect(selected===name?"Todas":name)}><span className="category-icon"><Icon size={22}/></span><span>{name}</span></button>)}</nav>;
}
function StoreHero({product}){
 return <section className="store-hero" aria-labelledby="store-hero-title">
  <div className="store-hero-copy"><span className="store-kicker"><Sparkles size={15}/> MI ECOMMERCE · TU PRÓXIMO FAVORITO</span><h1 id="store-hero-title">Encontrá eso que <em>te encanta.</em></h1><p>Explorá el catálogo, descubrí nuevas opciones y elegí tus favoritos desde un solo lugar.</p><a className="store-cta" href="#productos">Explorar productos <ArrowUpRight size={18}/></a><div className="store-proof"><span><i/> Catálogo para descubrir</span><span><i/> Carrito siempre a mano</span></div></div>
  <div className="store-spotlight-wrap"><div className="store-orbit store-orbit-one"/><div className="store-orbit store-orbit-two"/><article className="store-spotlight">
   <div className="spotlight-photo">{product?.image?<img src={product.image} alt={product.name}/>:product?.emoji?<span className="spotlight-emoji" aria-hidden="true">{product.emoji}</span>:<Package size={64} aria-hidden="true"/>}<span className="spotlight-label"><Sparkles size={13}/> PARA VOS</span></div>
   <div className="spotlight-info"><span className="spotlight-category">{product?.category||"DESTACADO"}</span><h2>{product?.name||"Una tienda para encontrar algo nuevo"}</h2><p>{product?.description||"Recorré el catálogo y descubrí lo que tenemos para vos."}</p>{product&&<div className="spotlight-bottom"><strong>{money(product.price)}</strong><Link to={`/products/${product.id}`} aria-label={`Ver ${product.name}`}><ArrowUpRight size={19}/></Link></div>}</div>
  </article><span className="spotlight-note">UNA SELECCIÓN DEL CATÁLOGO</span></div>
 </section>;
}
export default function Catalog(){
 const {products,loading,error,reload}=useProducts();const [params]=useSearchParams();const [category,setCategory]=useState("Todas");const query=(params.get("q")||"").trim().toLowerCase();
 const filtered=useMemo(()=>products.filter(p=>(category==="Todas"||String(p.category).toLowerCase()===category.toLowerCase())&&[p.name,p.description].join(" ").toLowerCase().includes(query)),[products,category,query]);
 const recommended=filtered.filter(p=>p.featured);const first=recommended.length?recommended:filtered.slice(0,4);
 return <div className="store-home"><StoreHero product={first[0]}/><div className="category-area"><div><span className="store-eyebrow">UN POCO DE TODO</span><h2>Explorá por categoría</h2></div><CategoryStrip selected={category} onSelect={setCategory}/></div><section className="store-section" id="productos"><div className="store-section-heading"><div><span className="store-eyebrow">SELECCIÓN PARA VOS</span><h2>Te puede interesar</h2></div><span className="store-result-count">{filtered.length} productos</span></div>{loading?<div className="notice">Cargando productos...</div>:error?<div className="notice error">{error}<button onClick={reload}>Reintentar</button></div>:first.length?<ProductGrid products={first}/>:<div className="notice">No se encontraron productos.</div>}</section><section className="store-section"><div className="store-section-heading"><div><span className="store-eyebrow">DESCUBRÍ MÁS</span><h2>{query?"Resultados de búsqueda":"Los más pedidos"}</h2></div></div>{!loading&&!error&&(filtered.length?<ProductGrid products={filtered}/>:<div className="notice">No hay productos en esta categoría.</div>)}</section></div>;
}
