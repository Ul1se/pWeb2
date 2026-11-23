import {useEffect,useMemo,useState} from "react";
import {Link,useNavigate,useParams,Navigate} from "react-router-dom";
import {Search,ArrowRight,ShoppingCart,Trash2,Minus,Plus,ShieldCheck} from "lucide-react";
import ProductCard,{money} from "../components/ProductCard";
import {useStore} from "../context/StoreContext";
import {useProducts} from "../hooks/useProducts";
import {authApi,productsApi} from "../services/api";
function NotFound(){return <div className="notice"><h1>404</h1><p>La página no existe.</p><Link to="/">Volver al inicio</Link></div>}
export default NotFound;
