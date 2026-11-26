import {createServer} from "node:http";
import {createHmac,timingSafeEqual} from "node:crypto";
import {WebSocketServer,WebSocket} from "ws";

const PORT=Number(process.env.PORT||8080);
const SECRET=process.env.REALTIME_SECRET;
if(!SECRET||SECRET.length<32)throw new Error("Definí REALTIME_SECRET (mínimo 32 caracteres).");
const allowed=(process.env.ALLOWED_ORIGINS||"").split(",").map(x=>x.trim()).filter(Boolean);
if(!allowed.length)throw new Error("Definí ALLOWED_ORIGINS con el origen del ecommerce.");
const peers=new Set();
const server=createServer(async(req,res)=>{
 const origin=req.headers.origin;
 if(origin&&allowed.includes(origin))res.setHeader("Access-Control-Allow-Origin",origin);
 if(req.url==="/health"&&req.method==="GET"){res.writeHead(200,{"Content-Type":"application/json"});res.end(JSON.stringify({ok:true,clients:peers.size}));return}
 if(req.url!=="/publish"||req.method!=="POST"){res.writeHead(404);res.end();return}
 let chunks=[],size=0;
 for await(const chunk of req){size+=chunk.length;if(size>4096){res.writeHead(413);res.end();return}chunks.push(chunk)}
 const body=Buffer.concat(chunks),signature=String(req.headers["x-realtime-signature"]||"");
 const expected=createHmac("sha256",SECRET).update(body).digest("hex");
 const a=Buffer.from(signature),b=Buffer.from(expected);
 if(a.length!==b.length||!timingSafeEqual(a,b)){res.writeHead(401);res.end();return}
 let msg;try{msg=JSON.parse(body.toString("utf8"))}catch{res.writeHead(400);res.end();return}
 if(msg.type!=="products:changed"||!Number.isInteger(msg.productId)||msg.productId<1){res.writeHead(400);res.end();return}
 const packet=JSON.stringify({type:"products:changed",productId:msg.productId});
 for(const peer of peers){if(peer.readyState===WebSocket.OPEN)peer.send(packet)}
 res.writeHead(200,{"Content-Type":"application/json"});res.end(JSON.stringify({ok:true,clients:peers.size}));
});
const wss=new WebSocketServer({noServer:true});
server.on("upgrade",(req,socket,head)=>{
 const origin=req.headers.origin;
 if(req.url!=="/ws"||!origin||!allowed.includes(origin)){socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");socket.destroy();return}
 wss.handleUpgrade(req,socket,head,ws=>wss.emit("connection",ws,req));
});
wss.on("connection",ws=>{
 peers.add(ws);ws.isAlive=true;
 ws.on("pong",()=>{ws.isAlive=true});
 ws.on("close",()=>peers.delete(ws));
 ws.on("error",()=>peers.delete(ws));
});
const interval=setInterval(()=>{for(const ws of peers){if(!ws.isAlive){ws.terminate();peers.delete(ws);continue}ws.isAlive=false;ws.ping()}},30000);
server.on("close",()=>clearInterval(interval));
server.listen(PORT,"0.0.0.0",()=>console.log("MiEcommerce realtime escuchando en",PORT));
