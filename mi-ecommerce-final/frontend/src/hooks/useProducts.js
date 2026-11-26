import {useCallback,useEffect,useRef,useState} from "react";
import {productsApi} from "../services/api";
export function useProducts(){
 const [products,setProducts]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const [live,setLive]=useState("unconfigured");
 const latest=useRef(0);
 const reload=useCallback(async({silent=false}={})=>{
  const request=++latest.current;
  if(!silent){setLoading(true);setError("")}
  try{const result=await productsApi.all();if(request===latest.current){setProducts(result);setError("")}}
  catch(e){if(request===latest.current)setError(e.message)}
  finally{if(request===latest.current)setLoading(false)}
 },[]);
 useEffect(()=>{reload()},[reload]);
 useEffect(()=>{
  const url=import.meta.env.VITE_WS_URL;
  if(!url){setLive("unconfigured");return}
  if(!/^wss?:\/\//.test(url)){setLive("invalid");return}
  let socket,timeout,stopped=false,attempt=0,refreshTimer;
  function connect(){
   if(stopped)return;
   setLive("connecting");
   try{socket=new WebSocket(url)}catch{retry();return}
   socket.onopen=()=>{attempt=0;setLive("connected");reload({silent:true})};
   socket.onmessage=event=>{
    try{const message=JSON.parse(event.data);
     if(message.type==="products:changed"){
      clearTimeout(refreshTimer);
      refreshTimer=setTimeout(()=>reload({silent:true}),120);
     }
    }catch{/* ignorar mensajes desconocidos */}
   };
   socket.onerror=()=>setLive("disconnected");
   socket.onclose=()=>{setLive("disconnected");retry()};
  }
  function retry(){if(stopped)return;const delay=Math.min(30000,1000*2**Math.min(attempt++,5));timeout=setTimeout(connect,delay)}
  connect();
  const onVisible=()=>{if(document.visibilityState==="visible")reload({silent:true})};
  document.addEventListener("visibilitychange",onVisible);
  return()=>{stopped=true;clearTimeout(timeout);clearTimeout(refreshTimer);document.removeEventListener("visibilitychange",onVisible);if(socket){socket.onclose=null;socket.close()}}
 },[reload]);
 return {products,loading,error,reload,live};
}
