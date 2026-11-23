import {createContext,useContext,useEffect,useMemo,useState} from "react";
const StoreContext=createContext(null);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
export function StoreProvider({children}){
 const [cart,setCart]=useState(()=>read("pweb2-cart",[]));
 const [session,setSession]=useState(()=>read("pweb2-session",null));
 useEffect(()=>localStorage.setItem("pweb2-cart",JSON.stringify(cart)),[cart]);
 useEffect(()=>{if(session)localStorage.setItem("pweb2-session",JSON.stringify(session));else localStorage.removeItem("pweb2-session")},[session]);
 const add=product=>setCart(items=>{const existing=items.find(i=>i.id===product.id);return existing?items.map(i=>i.id===product.id?{...i,quantity:i.quantity+1}:i):[...items,{...product,quantity:1}]});
 const change=(id,quantity)=>setCart(items=>items.map(i=>i.id===id?{...i,quantity:Math.max(1,Number(quantity)||1)}:i));
 const remove=id=>setCart(items=>items.filter(i=>i.id!==id));
 const value=useMemo(()=>({cart,session,setSession,add,change,remove,clear:()=>setCart([]),count:cart.reduce((a,i)=>a+i.quantity,0),total:cart.reduce((a,i)=>a+Number(i.price||0)*i.quantity,0)}),[cart,session]);
 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore=()=>useContext(StoreContext);
