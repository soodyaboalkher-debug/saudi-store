
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import { Routes,Route } from "react-router-dom"
import Products from "./pages/Products"
import Card from "./components/Card"
import ProductDetails from "./pages/ProductDetails"
import { CartProvider } from "./context/CartContext"
import {CartProduct} from "./pages/CartProduct"
const App =()=>{




  return(
    <>

    <CartProvider>
     
     <Navbar/>

     <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/products" element={<Products/>} />
      <Route path="/card" element={<Card/>} />
      <Route path="/products/:id" element={<ProductDetails/>} />
      <Route path="/cart" element={<CartProduct/>} />
    
     </Routes>
    </CartProvider>

    </>
  )
}

export default App;