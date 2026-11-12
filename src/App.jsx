
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Routes,Route } from "react-router-dom";
import Products from "./pages/Products";

import ProductDetails from "./pages/ProductDetails";
import { CartProvider } from "./context/CartContext";
import {CartProduct} from "./pages/CartProduct";
import {Footer} from "./components/Footer"
import WhatsAppButton from "./components/WhatsAppButton";
import { WishProvider } from "./context/WishContext";
import {Wish} from "./pages/Wish"
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";



export default function App(){




  return(
    <>

    <AuthProvider>

      <CartProvider>
        <WishProvider>
          
          <Navbar/>

          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/products" element={<Products/>} />
        
            <Route path="/products/:id" element={<ProductDetails/>} />
            <Route path="/cart" element={<CartProduct/>} />
            <Route path="/favorit" element={<Wish/>} />

           

            <Route path="/login" element={<Login/>} />
            <Route path="/register"  element={<Register/>}/>
          
          </Routes>

          <Footer/>
          <WhatsAppButton />
        </WishProvider>
      </CartProvider>

    </AuthProvider>

    </>
  );
};

