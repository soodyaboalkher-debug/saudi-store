
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import { Routes,Route } from "react-router-dom"
import Products from "./pages/Products"
import Card from "./components/Card"
import ProductDetails from "./pages/ProductDetails"
const App =()=>{




  return(
    <>
     
     <Navbar/>

     <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/products" element={<Products/>} />
      <Route path="/card" element={<Card/>} />
      <Route path="/products/:id" element={<ProductDetails/>} />
    
     </Routes>

    </>
  )
}

export default App;