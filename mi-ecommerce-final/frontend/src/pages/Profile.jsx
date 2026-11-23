import {useEffect,useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {UserRound,Save,ShoppingBag,Heart,Clock3} from "lucide-react";
import {authApi} from "../services/api";
import {useStore} from "../context/StoreContext";
export default function Profile(){
 const {session,setSession}=useStore(),navigate=useNavigate();
 const [name,setName]=useState(session?.user?.name||""),[avatar,setAvatar]=useState(session?.user?.avatar_url||""),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
 useEffect(()=>{setName(session?.user?.name||"");setAvatar(session?.user?.avatar_url||"")},[session?.user?.name,session?.user?.avatar_url]);
 if(!session)return <section className="notice"><h2>Tu perfil</h2><p>Ingresá para acceder a tu cuenta.</p><Link className="button" to="/login">Ingresar</Link></section>;
 async function save(e){e.preventDefault();setBusy(true);setError("");setMessage("");try{const user=await authApi.updateProfile({name,avatar_url:avatar},session.token);setSession({...session,user});setMessage("Perfil actualizado correctamente.")}catch(e){setError(e.message)}finally{setBusy(false)}}
 return <section className="account-page"><Link className="breadcrumb" to="/">← Inicio</Link><h1>Mi perfil</h1>
 <div className="account-head"><div className="profile-avatar large-avatar">{session.user?.avatar_url?<img src={session.user.avatar_url} alt="Foto del perfil" onError={e=>e.currentTarget.style.display="none"}/>:<UserRound size={35}/>}</div><div><h2>{session.user?.name}</h2><p>{session.user?.email}</p></div></div>
 <div className="account-shortcuts"><Link to="/mis-compras"><ShoppingBag/> Mis compras</Link><Link to="/favoritos"><Heart/> Favoritos</Link><Link to="/historial"><Clock3/> Historial</Link></div>
 <form className="profile-form" onSubmit={save}><h2>Datos personales</h2><label>Nombre completo<input required minLength={2} maxLength={100} value={name} onChange={e=>setName(e.target.value)}/></label>
 <label>Correo electrónico<input value={session.user?.email||""} readOnly aria-label="Correo electrónico"/></label>
 <label>Foto del perfil (URL HTTPS)<input type="url" value={avatar} placeholder="https://ejemplo.com/foto.jpg" onChange={e=>setAvatar(e.target.value)}/></label>
 <button disabled={busy}><Save size={18}/>{busy?"Guardando...":"Guardar cambios"}</button>{message&&<p role="status" className="success-text">{message}</p>}{error&&<p role="alert" className="error-text">{error}</p>}</form></section>;
}
