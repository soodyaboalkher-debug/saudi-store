
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../supabase";







const CartContext = createContext();

export const useCart = () => useContext(CartContext);








// المكوّن الخارجي: مسؤول عن معرفة المستخدم
export const CartProvider = ({ children }) => {

  const { user, loading } = useAuth();

  // نستنى لحد ما نعرف المستخدم الحالي
  if (loading) return null;

  // مفتاح مختلف لكل مستخدم
  const storageKey = user
    ? `saudi_cart_${user.id}`
    : "saudi_cart_guest";

  return (
    <CartStateProvider
      key={storageKey}
      storageKey={storageKey}
      userId={user?.id ?? null}
    >
      {children}
    </CartStateProvider>
  );
};


// المكوّن الداخلي: مسؤول عن إدارة السلة
function CartStateProvider({ children, storageKey, userId }) {

 const [cartItems, setCartItems] = useState([]);
 const [cartLoading, setCartLoading] = useState(true);

 const [addLoading ,setAddLoading]=useState(false);


 // جلب بيانات السلة
  useEffect(() => {

    let active = true;

    const loadCart = async () => {

      setCartLoading(true);

      // لو المستخدم زائر: نجيب السلة من localStorage
      if (!userId) {

        try {
          const savedCart = localStorage.getItem(storageKey);

          if (active) {
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
          }

        } catch (error) {
          console.error("Error loading guest cart:", error);
        }

        if (active) setCartLoading(false);

        return;
      }


      // لو المستخدم مسجل: نجيب السلة من Supabase
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          variant_id,
          quantity,
          product_variants (
            id,
            price,
            stock,
            products (
              id,
              name,
              image_url
            ),
            sizes (
              name
            )
          )
        `)
        .eq("user_id", userId);


      if (error) {

        console.error("Error fetching cart:", error);

        if (active) {
          setCartItems([]);
          setCartLoading(false);
        }

        return;
      }


      // تحويل بيانات Supabase لشكل CartItem المستخدم في React
      const formattedCart = data.map((item) => {

        const variant = item.product_variants;
        const product = variant.products;

        return {
          id: product.id,
          name: product.name,
          image_url: product.image_url,

          variantId: item.variant_id,
          size: variant.sizes.name,

          price: variant.price,
          stock: variant.stock,
          quantity: item.quantity
        };

      });


      if (active) {
        setCartItems(formattedCart);
        setCartLoading(false);
      }

    };


    loadCart();

    return () => {
      active = false;
    };

  }, [userId, storageKey]);


 // حفظ سلة الزائر فقط في localStorage
  useEffect(() => {

    if (userId || cartLoading) return;

    localStorage.setItem(
      storageKey,
      JSON.stringify(cartItems)
    );

  }, [cartItems, storageKey, userId ,cartLoading]);


  // إضافة منتج للسلة
  const addToCart = async (product, quantity, selectedVariant) => {
    
    const cartItem = {
      id: product.id,
      name: product.name,
      image_url: product.image_url,

      variantId: selectedVariant.id,
      size: selectedVariant.sizes.name,

      price: selectedVariant.price,
      stock: selectedVariant.stock,
      quantity:Math.min(selectedVariant.stock, quantity)
    };

    


    /* لو زائر  */

    if(!userId){

        setCartItems((prevItems) =>{
        // هل مقاس المنتج موجود؟
          const existingItem = prevItems.find((prev)=>prev.variantId === cartItem.variantId);

          /* لو موجود عدل الكميه فقط ولو مش موجود ضيفة كعنصر جديد للسه */
        if (existingItem){

        return prevItems.map((item)=>
          item.variantId === cartItem.variantId 
          ? {
            ...item , quantity : Math.min (item.stock, item.quantity +cartItem.quantity)
            }
            : item
          )
      }

      return [...prevItems , cartItem]

      });

      return;
    }

    

    /* لو مسجل */
    setAddLoading(true);
    const { data: existingItem, error: findError } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("variant_id", selectedVariant.id)
    .maybeSingle();

    if (findError) {
      console.error("Error searching cart:", findError);
      return;
    }
    // لو المنتج موجود في السله
    if (existingItem) {

        const newQuantity = Math.min(
         cartItem.stock,
         existingItem.quantity + cartItem.quantity
        );

        const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id);


        if (updateError) {
         console.error("Error updating cart:", updateError);
         return;
        }

        setCartItems((prevItems) => {

         const itemExists = prevItems.some(
         (item) => item.variantId === selectedVariant.id
         );

         if (itemExists) {
          return prevItems.map((item) =>
           item.variantId === selectedVariant.id
             ? { ...item, quantity: newQuantity }
              : item
          );
         }

         return [...prevItems, { ...cartItem, quantity: newQuantity }];

        });

        setAddLoading(false);

      return;
    }

   

    // لو المنتج مش موجود في السلة

    setAddLoading(true);
    const { error: insertError } = await supabase
      .from("cart_items")
      .insert({
        user_id: userId,
        variant_id: selectedVariant.id,
        quantity: cartItem.quantity
      });

    if (insertError) {
      console.error("Error adding cart item:", insertError);
      return;
    }

    // تحديث React State
    setCartItems((prevItems) => [
      ...prevItems,
      cartItem
    ]);

    setAddLoading(false);

  };


  // تفريغ السلة
  const clearCart =async () => {

    if(!userId){ 
    setCartItems([]);
    return;
    }

    const {error}= await supabase
    .from('cart_items')
    .delete()
    .eq('user_id' , userId);

    if(error){
      console.error('Error in Delete all',error);
      return;
    }

    setCartItems([]);


  };


  // زيادة الكمية
  const increaseQuantity =async (variantId) => {
    if(!userId){

      setCartItems((prevItems) =>
      prevItems.map((prev) =>
      prev.variantId === variantId ? {
      ...prev,quantity: Math.min(prev.stock, prev.quantity + 1) } : prev ) );
      return;
    }

    // المستخدم المسجل: نبحث عن العنصر
    const cartItem = cartItems.find(
    (item) => item.variantId === variantId
    );


    if(!cartItem) return;

    // نحسب الكمية الجديدة
    const newQuantity = Math.min(
      cartItem.stock,
      cartItem.quantity + 1
    );
    if (newQuantity === cartItem.quantity) return;
    

    const {error} = await supabase
    .from('cart_items')
    .update({quantity :newQuantity})
    .eq('user_id',userId)
    .eq('variant_id' , variantId);


    if (error) {
    console.error('Error increasing quantity:', error);
    return;
    }

    setCartItems((prevItems)=>{
    return prevItems.map((prev)=>
    prev.variantId === variantId ? {
    ...prev, quantity:newQuantity} 
    : prev);

    });




  };


  // تقليل الكمية
  const decreaseQuantity = (variantId) => {

    setCartItems((prevItems) =>
      prevItems.map((prev) =>
        prev.variantId === variantId
          ? {
              ...prev,
              quantity: Math.max(1, prev.quantity - 1)
            }
          : prev
      )
    );

  };


  // حذف منتج من السلة
  const deleteItemCart = (variantId) => {

    setCartItems((prevItems) =>
      prevItems.filter((prev) =>
        prev.variantId !== variantId
      )
    );

  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        setCartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        deleteItemCart,
        clearCart,
        addLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );

}
