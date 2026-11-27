import {useCallback,useEffect,useRef,useState} from "react";
import {productsApi} from "../services/api";
import {useWebSocket} from "../../websocket/useWebSocket.js";
export function useProducts(){
 const [products,setProducts]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const latest=useRef(0);
 const reload=useCallback(async({silent=false}={})=>{
  const request=++latest.current;
  if(!silent){setLoading(true);setError("")}
  try{const result=await productsApi.all();if(request===latest.current){setProducts(result);setError("")}}
  catch(e){if(request===latest.current)setError(e.message)}
  finally{if(request===latest.current)setLoading(false)}
 },[]);
 useEffect(()=>{reload()},[reload]);
 const live=useWebSocket(reload);
 return {products,loading,error,reload,live};
}
