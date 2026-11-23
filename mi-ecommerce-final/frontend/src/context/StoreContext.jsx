import {createContext,useContext,useEffect,useMemo,useState} from "react";
import {authApi,favoritesApi} from "../services/api";
const StoreContext=createContext(null);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
export function StoreProvider({children}){
 const [cart,setCart]=useState(()=>read("pweb2-cart",[]));
 const [favorites,setFavorites]=useState([]);
 const [session,setSession]=useState(()=>{const saved=read("pweb2-session",null);return saved?.token?.includes(".")?saved:null;});
 useEffect(()=>{if(session?.token){authApi.me(session.token).then(user=>setSession(old=>old?{...old,user}:old)).catch(()=>setSession(null))}},[]);
 useEffect(()=>{let alive=true;if(!session?.token){setFavorites([]);return}favoritesApi.all(session.token).then(items=>{if(alive)setFavorites(items.map(p=>p.id))}).catch(()=>{if(alive)setFavorites([])});return()=>{alive=false}},[session?.token]);
 useEffect(()=>localStorage.setItem("pweb2-cart",JSON.stringify(cart)),[cart]);
 useEffect(()=>{if(session)localStorage.setItem("pweb2-session",JSON.stringify(session));else localStorage.removeItem("pweb2-session")},[session]);
 const add=product=>setCart(items=>{const existing=items.find(i=>i.id===product.id);return existing?items.map(i=>i.id===product.id?{...i,quantity:i.quantity+1}:i):[...items,{...product,quantity:1}]});
 const change=(id,quantity)=>setCart(items=>items.map(i=>i.id===id?{...i,quantity:Math.max(1,Number(quantity)||1)}:i));
 const remove=id=>setCart(items=>items.filter(i=>i.id!==id));
 const toggleFavorite=async id=>{if(!session?.token)throw new Error("Iniciá sesión para guardar favoritos.");const exists=favorites.includes(id);if(exists)await favoritesApi.remove(id,session.token);else await favoritesApi.add(id,session.token);setFavorites(items=>exists?items.filter(x=>x!==id):[...items,id])};
 const value=useMemo(()=>({cart,session,setSession,favorites,toggleFavorite,add,change,remove,clear:()=>setCart([]),count:cart.reduce((a,i)=>a+i.quantity,0),total:cart.reduce((a,i)=>a+Number(i.price||0)*i.quantity,0)}),[cart,session,favorites]);
 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore=()=>useContext(StoreContext);
