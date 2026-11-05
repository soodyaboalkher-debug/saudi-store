
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
const App =()=>{




  return(
    <>

    <CartProvider>
      <WishProvider>
        
        <Navbar/>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/products" element={<Products/>} />
      
          <Route path="/products/:id" element={<ProductDetails/>} />
          <Route path="/cart" element={<CartProduct/>} />
           <Route path="/favorit" element={<Wish/>} />
        
        </Routes>

        <Footer/>
        <WhatsAppButton />
      </WishProvider>
    </CartProvider>

    </>
  );
};

export default App;