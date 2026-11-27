import { neon } from "@neondatabase/serverless";
import { randomBytes, pbkdf2Sync, timingSafeEqual, createHmac } from "node:crypto";

const sql = neon(process.env.DATABASE_URL);
const secret = process.env.SESSION_SECRET;
import {notifyProductChanged} from "../websocket/publish.js";


const fail = (res,status,error) => res.status(status).json({error});
const safeUser = u => ({id:u.id,name:u.name,email:u.email,role:u.role,avatar_url:u.avatar_url||null});
const hash = p => {const salt=randomBytes(16).toString("hex");return salt+":"+pbkdf2Sync(p,salt,150000,32,"sha256").toString("hex");};
const verify = (p,h) => {if(!h || !h.includes(":"))return false;const [salt,v]=h.split(":");const digest=pbkdf2Sync(p,salt,150000,32,"sha256");const expected=Buffer.from(v,"hex");return expected.length===digest.length&&timingSafeEqual(digest,expected);};
const b64 = value=>Buffer.from(JSON.stringify(value)).toString("base64url");
const tokenFor = u=> {const data=b64({id:u.id,exp:Math.floor(Date.now()/1000)+60*60*24});const mac=createHmac("sha256",secret).update(data).digest("base64url");return data+"."+mac;};
const getUser=async req=>{const bearer=req.headers.authorization||"";const parts=bearer.replace(/^Bearer\s+/i,"").split(".");if(parts.length!==2||!secret)return null;const valid=createHmac("sha256",secret).update(parts[0]).digest("base64url");if(valid.length!==parts[1].length||!timingSafeEqual(Buffer.from(valid),Buffer.from(parts[1])))return null;let claims;try{claims=JSON.parse(Buffer.from(parts[0],"base64url").toString())}catch{return null}if(claims.exp<Date.now()/1000||!Number.isInteger(claims.id))return null;const rows=await sql`SELECT id,name,email,role,avatar_url FROM users WHERE id=${claims.id}`;return rows[0]||null;};
const productSql=`SELECT p.id,p.name,p.description,p.price,p.stock,p.category_id,p.image,p.emoji,p.featured,c.name AS category FROM products p LEFT JOIN categories c ON c.id=p.category_id`;
export default async function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  if(!process.env.DATABASE_URL||!secret)return fail(res,503,"El servicio no está configurado.");
  const url = new URL(req.url,"https://localhost");
  const route=(url.searchParams.get("route")||url.pathname.replace(/^\/api\/?/,"")).split("/").filter(Boolean);
  try{
    if(route[0]==="health"&&req.method==="GET"){await sql`SELECT 1`;return res.json({ok:true,database:"connected"});}
    if(route[0]==="products"&&route.length===1&&req.method==="GET"){return res.json(await sql`SELECT p.id,p.name,p.description,p.price,p.stock,p.category_id,p.image,p.emoji,p.featured,c.name AS category FROM products p LEFT JOIN categories c ON c.id=p.category_id ORDER BY p.id`);}
    if(route[0]==="categories"&&req.method==="GET"){return res.json(await sql`SELECT id,name FROM categories ORDER BY id`);}
    if(route[0]==="auth"&&route[1]==="register"&&req.method==="POST"){
      const {name,email,password}=req.body||{};if(typeof name!=="string"||name.trim().length<2||typeof email!=="string"||!/^\S+@\S+\.\S+$/.test(email)||typeof password!=="string"||password.length<8||password.length>128)return fail(res,400,"Verificá nombre, correo y contraseña (mínimo 8 caracteres).");
      const digest=hash(password);const normalized=email.trim().toLowerCase();
      const exists=await sql`SELECT id FROM users WHERE email=${normalized}`;if(exists.length)return fail(res,409,"Este correo ya está registrado.");
      const users=await sql`INSERT INTO users(name,email,password_hash) VALUES(${name.trim().slice(0,120)},${normalized},${digest}) RETURNING id,name,email,role,avatar_url`;
      return res.status(201).json({user:safeUser(users[0])});
    }
    if(route[0]==="auth"&&route[1]==="login"&&req.method==="POST"){
      const {email,password}=req.body||{};if(typeof email!=="string"||typeof password!=="string")return fail(res,400,"Ingresá email y contraseña.");
      const users=await sql`SELECT id,name,email,password_hash,role,avatar_url FROM users WHERE email=${email.trim().toLowerCase()}`;
      if(!users[0]||!verify(password,users[0].password_hash))return fail(res,401,"Correo o contraseña incorrectos.");
      return res.json({token:tokenFor(users[0]),user:safeUser(users[0])});
    }
    if(route[0]==="auth"&&route[1]==="me"&&req.method==="GET"){const u=await getUser(req);return u?res.json(safeUser(u)):fail(res,401,"Sesión vencida. Volvé a ingresar.");}
    if(route[0]==="auth"&&route[1]==="profile"&&req.method==="PUT"){
      const u=await getUser(req);if(!u)return fail(res,401,"Iniciá sesión para editar tu perfil.");
      const name=String(req.body?.name||"").trim();
      const avatar=String(req.body?.avatar_url||"").trim();
      if(name.length<2||name.length>100)return fail(res,400,"El nombre debe tener entre 2 y 100 caracteres.");
      if(avatar && (avatar.length>500||!/^https:\/\//.test(avatar)))return fail(res,400,"La foto debe tener una URL HTTPS válida.");
      const result=await sql`UPDATE users SET name=${name},avatar_url=${avatar||null} WHERE id=${u.id} RETURNING id,name,email,role,avatar_url`;
      return res.json(safeUser(result[0]));
    }
    if(route[0]==="favorites"&&req.method==="GET"){
      const u=await getUser(req);if(!u)return fail(res,401,"Iniciá sesión.");
      return res.json(await sql`SELECT p.id,p.name,p.description,p.price,p.stock,p.category_id,p.image,p.emoji,p.featured,c.name AS category FROM favorites f JOIN products p ON p.id=f.product_id LEFT JOIN categories c ON c.id=p.category_id WHERE f.user_id=${u.id} ORDER BY f.created_at DESC`);
    }
    if(route[0]==="favorites"&&route.length===2&&["POST","DELETE"].includes(req.method)){
      const u=await getUser(req);if(!u)return fail(res,401,"Iniciá sesión para guardar favoritos.");
      const id=Number(route[1]);if(!Number.isSafeInteger(id)||id<1)return fail(res,400,"Producto inválido.");
      if(req.method==="POST"){const found=await sql`SELECT id FROM products WHERE id=${id}`;if(!found.length)return fail(res,404,"Producto no encontrado.");await sql`INSERT INTO favorites(user_id,product_id) VALUES(${u.id},${id}) ON CONFLICT DO NOTHING`;}
      else await sql`DELETE FROM favorites WHERE user_id=${u.id} AND product_id=${id}`;
      return res.json({ok:true});
    }
    if(route[0]==="orders"&&route.length===2&&req.method==="GET"){
      const u=await getUser(req);if(!u)return fail(res,401,"Iniciá sesión.");
      const id=Number(route[1]);if(!Number.isSafeInteger(id))return fail(res,400,"Pedido inválido.");
      const orders=await sql`SELECT id,total,status,created_at FROM orders WHERE user_id=${u.id} AND id=${id}`;
      if(!orders.length)return fail(res,404,"Pedido no encontrado.");
      const items=await sql`SELECT oi.product_id,oi.quantity,oi.unit_price,p.name,p.emoji,p.image FROM order_items oi LEFT JOIN products p ON p.id=oi.product_id WHERE oi.order_id=${id} ORDER BY oi.id`;
      return res.json({...orders[0],items});
    }
    if(route[0]==="orders"&&req.method==="POST"){
      const u=await getUser(req);if(!u)return fail(res,401,"Iniciá sesión para confirmar tu pedido.");
      const items=req.body?.items;if(!Array.isArray(items)||!items.length||items.length>50)return fail(res,400,"El carrito está vacío o contiene demasiados productos.");
      const merged=new Map();for(const item of items){const id=Number(item.id),qty=Number(item.quantity);if(!Number.isInteger(id)||!Number.isInteger(qty)||qty<1||qty>100)return fail(res,400,"Cantidad inválida.");merged.set(id,(merged.get(id)||0)+qty);}
      const list=[...merged].map(([id,quantity])=>({id,quantity}));const ids=list.map(i=>i.id);
      const found=await sql`SELECT id,price,stock FROM products WHERE id=ANY(${ids})`;
      if(found.length!==list.length||list.some(i=>(found.find(p=>p.id===i.id)?.stock??0)<i.quantity))return fail(res,409,"Hay productos sin stock suficiente.");
      const total=list.reduce((sum,i)=>sum+Number(found.find(p=>p.id===i.id).price)*i.quantity,0);
      const rows=await sql`WITH new_order AS (INSERT INTO orders(user_id,total) VALUES(${u.id},${total}) RETURNING id), details AS (INSERT INTO order_items(order_id,product_id,quantity,unit_price) SELECT new_order.id,p.id,j.quantity,p.price FROM new_order CROSS JOIN jsonb_to_recordset(${JSON.stringify(list)}::jsonb) AS j(id integer,quantity integer) JOIN products p ON p.id=j.id RETURNING order_id) SELECT id FROM new_order`;
      return res.status(201).json({id:rows[0].id,total,status:"confirmed"});
    }
    if(route[0]==="orders"&&req.method==="GET"){const u=await getUser(req);if(!u)return fail(res,401,"Iniciá sesión.");return res.json(await sql`SELECT id,total,status,created_at FROM orders WHERE user_id=${u.id} ORDER BY created_at DESC LIMIT 50`);}
    if(route[0]==="products"&&["POST","PUT","DELETE"].includes(req.method)){
      const u=await getUser(req);if(!u||u.role!=="admin")return fail(res,403,"Acceso reservado al administrador.");
      const id=Number(route[1]);if(req.method==="DELETE"){if(!Number.isInteger(id))return fail(res,400,"ID inválido.");await sql`DELETE FROM products WHERE id=${id}`;await notifyProductChanged(id);return res.json({ok:true});}
      const p=req.body||{};const name=String(p.name||"").trim(),price=Number(p.price),stock=Number(p.stock),category=Number(p.category_id);
      if(!name||name.length>180||!Number.isSafeInteger(price)||price<0||!Number.isSafeInteger(stock)||stock<0||!Number.isInteger(category))return fail(res,400,"Completá los datos del producto correctamente.");
      const description=String(p.description||"").slice(0,2000),emoji=p.emoji?String(p.emoji).slice(0,16):null,image=p.image?String(p.image).slice(0,1000):null,featured=Boolean(p.featured);
      if(req.method==="POST"){const result=await sql`INSERT INTO products(name,description,price,stock,category_id,emoji,image,featured) VALUES(${name},${description},${price},${stock},${category},${emoji},${image},${featured}) RETURNING id`;await notifyProductChanged(result[0].id);return res.status(201).json(result[0]);}
      if(!Number.isInteger(id))return fail(res,400,"ID inválido.");const rows=await sql`UPDATE products SET name=${name},description=${description},price=${price},stock=${stock},category_id=${category},emoji=${emoji},image=${image},featured=${featured} WHERE id=${id} RETURNING id`;if(rows.length)await notifyProductChanged(id);return rows.length?res.json(rows[0]):fail(res,404,"Producto no encontrado.");
    }
    return fail(res,404,"Ruta no encontrada.");
  }catch(error){console.error("API error",error?.message);if(error?.code==="23505")return fail(res,409,"Ese valor ya existe.");if(error?.code==="23503")return fail(res,409,"No se puede completar la operación con los datos actuales.");return fail(res,500,"Ocurrió un error al procesar la solicitud.");}
}
