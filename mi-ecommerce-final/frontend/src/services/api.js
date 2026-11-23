const BASE = import.meta.env.VITE_API_URL || "/api";
export async function request(path, {token, ...options} = {}) {
  const headers = { ...(options.body ? {"Content-Type":"application/json"} : {}), ...(token ? {Authorization:`Bearer ${token}`} : {}), ...options.headers };
  let response;
  try { response = await fetch(BASE + path, {...options,headers}); }
  catch { throw new Error("No se pudo conectar con el backend. Verificá que Express esté ejecutándose."); }
  const data = await response.json().catch(()=>null);
  if(!response.ok) throw new Error(data?.error || `Error HTTP ${response.status}`);
  return data;
}
export const productsApi = {
  all:()=>request("/products"),
  categories:()=>request("/categories"),
  create:(item,token)=>request("/products",{method:"POST",body:JSON.stringify(item),token}),
  update:(id,item,token)=>request(`/products/${id}`,{method:"PUT",body:JSON.stringify(item),token}),
  remove:(id,token)=>request(`/products/${id}`,{method:"DELETE",token})
};
export const authApi = {
  login:(email,password)=>request("/auth/login",{method:"POST",body:JSON.stringify({email,password})}),
  register:(name,email,password)=>request("/auth/register",{method:"POST",body:JSON.stringify({name,email,password})}),
  me:token=>request("/auth/me",{token})
};
