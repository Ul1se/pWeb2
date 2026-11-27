import {createHmac} from "node:crypto";

// Publica una invalidación firmada después de guardar un producto.
export async function notifyProductChanged(productId){
 const url=process.env.REALTIME_PUBLISH_URL, key=process.env.REALTIME_SECRET;
 if(!url||!key)return;
 const body=JSON.stringify({type:"products:changed",productId});
 const signature=createHmac("sha256",key).update(body).digest("hex");
 try{
  const response=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json","x-realtime-signature":signature},body,signal:AbortSignal.timeout(1500)});
  if(!response.ok)console.warn("Realtime relay status",response.status);
 }catch(error){console.warn("Realtime relay unavailable:",error?.message)}
}
