import {Routes,Route} from "react-router-dom";
import Layout from "./components/Layout";
import {StoreProvider} from "./context/StoreContext";
import Catalog from "./pages/Catalog";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import StudyGuide from "./pages/StudyGuide";
import Academia from "./pages/Academia";
import Profile from "./pages/Profile";
import Purchases from "./pages/Purchases";
import Favorites from "./pages/Favorites";
export default function App(){return <StoreProvider><Routes><Route element={<Layout/>}><Route index element={<Catalog/>}/><Route path="products/:id" element={<Detail/>}/><Route path="cart" element={<Cart/>}/><Route path="login" element={<Login/>}/><Route path="admin" element={<Admin/>}/><Route path="guia" element={<StudyGuide/>}/><Route path="perfil" element={<Profile/>}/><Route path="estudiar" element={<Academia/>}/><Route path="mis-compras" element={<Purchases/>}/><Route path="historial" element={<Purchases history/>}/><Route path="favoritos" element={<Favorites/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></StoreProvider>}
