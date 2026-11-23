import {useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {Heart} from "lucide-react";
import {favoritesApi} from "../services/api";
import {useStore} from "../context/StoreContext";
import ProductGrid from "../components/organisms/ProductGrid";
export default function Favorites(){
 const {session,favorites}=useStore(),[products,setProducts]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{if(!session){setLoading(false);return}let active=true;favoritesApi.all(session.token).then(items=>{if(active)setProducts(items)}).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[session?.token,favorites.join(",")]);
 if(!session)return <div className="notice"><Heart size={40}/><h2>Mis favoritos</h2><p>Ingresá para guardar los productos que más te gustan.</p><Link className="button" to="/login">Ingresar</Link></div>;
 return <section className="account-page"><Link className="breadcrumb" to="/perfil">← Mi perfil</Link><h1>Favoritos</h1><p className="muted">Guardá tus productos preferidos para encontrarlos fácilmente.</p>
 {loading?<div className="notice">Cargando favoritos...</div>:error?<div className="notice error">{error}</div>:products.length?<ProductGrid products={products}/>:<div className="notice"><Heart size={40}/><h3>No tenés productos favoritos todavía</h3><Link className="button" to="/">Explorar catálogo</Link></div>}</section>
}
