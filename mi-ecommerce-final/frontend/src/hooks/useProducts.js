import {useCallback,useEffect,useState} from "react";
import {productsApi} from "../services/api";
export function useProducts(){
 const [products,setProducts]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const reload=useCallback(async()=>{setLoading(true);setError("");try{setProducts(await productsApi.all())}catch(e){setError(e.message)}finally{setLoading(false)}},[]);
 useEffect(()=>{reload()},[reload]);
 return {products,loading,error,reload};
}
