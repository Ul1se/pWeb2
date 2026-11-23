import {useEffect,useMemo,useState} from "react";
import {Link,useNavigate,useParams,Navigate} from "react-router-dom";
import {Search,ArrowRight,ShoppingCart,Trash2,Minus,Plus,ShieldCheck} from "lucide-react";
import ProductCard,{money} from "../components/ProductCard";
import {useStore} from "../context/StoreContext";
import {useProducts} from "../hooks/useProducts";
import {authApi,productsApi} from "../services/api";
function Detail(){const {id}=useParams(),[product,setProduct]=useState(null),[error,setError]=useState("");const {add}=useStore();useEffect(()=>{let alive=true;productsApi.all().then(items=>{if(alive){const found=items.find(p=>String(p.id)===id);if(found)setProduct(found);else setError("Producto no encontrado")}}).catch(e=>alive&&setError(e.message));return()=>{alive=false}},[id]);if(error)return <div className="notice error">{error}</div>;if(!product)return <div className="notice">Cargando producto...</div>;return <section className="section"><Link to="/">← Volver al catálogo</Link><div className="detail"><div className="product-visual large">{product.image?<img src={product.image} alt={product.name}/>:<ShoppingCart size={100}/>}</div><div><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><p>{product.description}</p><h2>{money(product.price)}</h2><button onClick={()=>add(product)}><ShoppingCart size={18}/> Agregar al carrito</button></div></div></section>}
export default Detail;
