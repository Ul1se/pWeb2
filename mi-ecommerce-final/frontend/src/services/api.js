// Modo demostración académica: persistencia local por navegador, sin servidor ni pagos reales.
const STORAGE="miecommerce-demo-products-v1";
const CATEGORIES=["Electrónica","Alimentos","Bebidas","Indumentaria","Juegos","Automotor","Hogar","Otros"].map((name,i)=>({id:i+1,name}));
const SEED=[
 ["Auriculares Bluetooth","Electrónica",18500,"🎧","Audio inalámbrico para todos los días."],
 ["Notebook Pro 14","Electrónica",245000,"💻","Notebook liviana para estudiar y trabajar."],
 ["Café premium","Alimentos",4500,"☕","Café tostado de aroma intenso."],
 ["Combo snacks","Alimentos",3900,"🍪","Selección de snacks para compartir."],
 ["Botella térmica","Bebidas",9800,"🥤","Conserva tus bebidas frías o calientes."],
 ["Buzo urbano","Indumentaria",22000,"👕","Buzo cómodo de uso diario."],
 ["Joystick inalámbrico","Juegos",27000,"🎮","Control ergonómico para jugar."],
 ["Kit de limpieza auto","Automotor",13500,"🚗","Accesorios para cuidar tu vehículo."],
 ["Lámpara de escritorio","Hogar",12500,"💡","Iluminación práctica para tu espacio."],
 ["Caja de regalo","Otros",7500,"🎁","Una opción ideal para regalar."]
].map(([name,category,price,emoji,description],i)=>({id:i+1,name,category,category_id:CATEGORIES.find(c=>c.name===category).id,price,emoji,description,stock:20,featured:i<4,image:null}));
const read=()=>{try{const saved=JSON.parse(localStorage.getItem(STORAGE));return Array.isArray(saved)?saved:SEED}catch{return SEED}};
const write=items=>localStorage.setItem(STORAGE,JSON.stringify(items));
const wait=async value=>value;
const publicUser=u=>({id:u.id,name:u.name,email:u.email,role:u.role});
const accountsKey="miecommerce-demo-accounts-v1";
const accounts=()=>{try{return JSON.parse(localStorage.getItem(accountsKey))||[]}catch{return []}};
const saveAccounts=a=>localStorage.setItem(accountsKey,JSON.stringify(a));
const apiError=message=>{throw new Error(message)};
export const productsApi={
 all:()=>wait(read()),categories:()=>wait(CATEGORIES),
 create:async(item)=>{const items=read();const id=Math.max(0,...items.map(p=>Number(p.id)))+1;const category=CATEGORIES.find(c=>c.id===Number(item.category_id));const product={...item,id,category:category?.name||"Otros"};write([...items,product]);return product},
 update:async(id,item)=>{const category=CATEGORIES.find(c=>c.id===Number(item.category_id));write(read().map(p=>String(p.id)===String(id)?{...p,...item,category:category?.name||p.category}:p));return {ok:true}},
 remove:async id=>{write(read().filter(p=>String(p.id)!==String(id)));return {ok:true}}
};
export const authApi={
 register:async(name,email,password)=>{if(!name.trim()||!email.trim()||password.length<8)apiError("Completá tus datos y una contraseña de 8 caracteres como mínimo.");const users=accounts();if(users.some(u=>u.email===email.trim().toLowerCase()))apiError("Ese correo ya está registrado en este navegador.");const user={id:Date.now(),name:name.trim(),email:email.trim().toLowerCase(),password,role:"user"};saveAccounts([...users,user]);return {ok:true}},
 login:async(email,password)=>{const user=(email.trim().toLowerCase()==="admin@demo.local"&&password==="Demo12345!")?{id:0,name:"Administrador Demo",email:"admin@demo.local",role:"admin"}:accounts().find(u=>u.email===email.trim().toLowerCase()&&u.password===password);if(!user)apiError("Datos incorrectos. Registrate primero para probar el acceso.");return {token:"demo-local-session",user:publicUser(user)}},
 me:async()=>apiError("Sesión de demostración: iniciá sesión nuevamente.")
};
