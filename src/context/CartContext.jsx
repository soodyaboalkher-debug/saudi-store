import { createContext ,useContext ,useState ,useEffect} from "react";


const CartContext = createContext();



export const useCart = () => useContext(CartContext);



export const CartProvider = ({children})=>{

 
 const [cartItems ,setCartItems]=useState(()=>{

  const savedCart = localStorage.getItem("cartItem")

  return savedCart ? JSON.parse(savedCart) : [];
 }
 );

 useEffect(()=>{
  localStorage.setItem("cartItem" ,JSON.stringify(cartItems));
 },[cartItems])



// available stock







// add to cart
const addToCart = (product, quantity, selectedVariant) => {

  const cartItem = {
    id: product.id,
    name: product.name,
    image_url: product.image_url,

    variantId: selectedVariant.id,
    size: selectedVariant.sizes.name,

    price: selectedVariant.price,
    stock: selectedVariant.stock,
    quantity: quantity
  };

  setCartItems((prevItems) => {

    const existingItem = prevItems.find(
      (item) => item.variantId === cartItem.variantId
    );

    if (existingItem) {

      return prevItems.map((item) =>
        item.variantId === cartItem.variantId
          ? {
              ...item,
              quantity: Math.min(
                item.stock,
                item.quantity + quantity
              )
            }
          : item
      );

    }

    return [...prevItems, cartItem];

  });

};




// clear cart
const clearCart =()=>{setCartItems([])}



// increaseQuantity +
const increaseQuantity = (variantId)=>{

  setCartItems((prevItems)=>
     prevItems.map((prev)=>
      prev.variantId === variantId ? {...prev,quantity:Math.min(prev.stock, prev.quantity +1)} :prev))
}


// decreaseQuantity -
const decreaseQuantity = (variantId) =>{

 setCartItems((prevItems)=>
  prevItems.map((prev)=>
  prev.variantId === variantId ? {...prev,quantity:Math.max(1, prev.quantity -1)}:prev ))

}



const deleteItemCart = (variantId)=> {
  setCartItems((prevItems)=>
    prevItems.filter((prev)=>
    prev.variantId !== variantId))}






return(

    <CartContext.Provider 
    value={{
      cartItems ,
    setCartItems ,
    addToCart ,
    increaseQuantity,
    decreaseQuantity,
    deleteItemCart,
    clearCart,
    
    }}>

        {children}

    </CartContext.Provider>
 )



}