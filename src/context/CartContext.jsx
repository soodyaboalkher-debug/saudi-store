
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

 const [addLoading ,setAddLoading] = useState(false);


  useEffect(() => {

    let isActive = true;

    const loadCart = async () => {

      setCartLoading(true);

      try {

        // لو المستخدم زائر
        if (!userId) {

          const savedCart = localStorage.getItem(storageKey);

          const parsedCart = savedCart
            ? JSON.parse(savedCart)
            : [];

          if (!Array.isArray(parsedCart)) {
            throw new Error("Invalid cart data");
          }

          if (isActive) {
            setCartItems(parsedCart);
          }

          return;
        }


        // لو المستخدم مسجل
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

        if (error) throw error;

        if (!isActive) return;


        // تحويل البيانات لشكل React
        const formattedCart = (data ?? [])
          .map((item) => {

            const variant = item.product_variants;
            const product = variant?.products;

            if (!variant || !product) return null;

            return {
              id: product.id,
              name: product.name,
              image_url: product.image_url,

              variantId: item.variant_id,
              size: variant.sizes?.name ?? "Size",

              price: variant.price,
              stock: variant.stock,
              quantity: item.quantity
            };

          })
          .filter(Boolean);


        setCartItems(formattedCart);


      } catch (error) {

        console.error("Error loading cart:", error);

        if (isActive) {
          setCartItems([]);
        }

      } finally {

        if (isActive) {
          setCartLoading(false);
        }

      }

    };


    loadCart();

    return () => {
      isActive = false;
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
      quantity: Math.min(selectedVariant.stock, quantity)
    };

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      selectedVariant.stock <= 0
    ) {
      return;
    }

    // لو زائر
    if (!userId) {

      setCartItems((prevItems) => {

        const existingItem = prevItems.find(
          (prev) => prev.variantId === cartItem.variantId
        );

        if (existingItem) {

          return prevItems.map((item) =>
            item.variantId === cartItem.variantId
              ? {
                  ...item,
                  quantity: Math.min(
                    item.stock,
                    item.quantity + cartItem.quantity
                  )
                }
              : item
          );
        }

        return [...prevItems, cartItem];

      });

      return;
    }

    // لو مستخدم مسجل
    try {

      setAddLoading(true);

      const { data: existingItem, error: findError } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("variant_id", selectedVariant.id)
        .maybeSingle();

      if (findError) throw findError;

      // لو المنتج موجود
      if (existingItem) {

        const newQuantity = Math.min(
          cartItem.stock,
          existingItem.quantity + cartItem.quantity
        );

        const { error: updateError } = await supabase
          .from("cart_items")
          .update({ quantity: newQuantity })
          .eq("id", existingItem.id);

        if (updateError) throw updateError;

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

        return;
      }

      // لو المنتج مش موجود
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert({
          user_id: userId,
          variant_id: selectedVariant.id,
          quantity: cartItem.quantity
        });

      if (insertError) throw insertError;

      setCartItems((prevItems) => [
        ...prevItems,
        cartItem
      ]);

    } catch (err) {

      console.error("Error adding cart item:", err);

    } finally {

      setAddLoading(false);

    }

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

    if (cartItem.quantity >= cartItem.stock) {
      return;
    }

    const newQuantity = cartItem.quantity + 1;
    

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
  const decreaseQuantity =async (variantId) => {

    if(!userId){

      
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
    return;
    }

    const cartItem = cartItems?.find((item)=>item.variantId === variantId);

    if(!cartItem) return;

    const newQuantity = Math.max(1, cartItem.quantity -1 );

    

    const {error}= await supabase
    .from('cart_items')
    .update({quantity:newQuantity})
    .eq('user_id' ,userId)
    .eq('variant_id' , variantId)

    if(error){
      console.error('ERROR IN decreaseQuantity' ,error)
      return;
    }

    setCartItems((prevItems)=>{
       return prevItems.map(prev => 
        prev.variantId === cartItem.variantId ? {...prev ,quantity: newQuantity} : prev );
    });




  };


  // حذف منتج من السلة
  const deleteItemCart =async (variantId) => {
    if(!userId){

      setCartItems((prevItems) =>
      prevItems.filter((prev) =>
        prev.variantId !== variantId
      )
      );

      return;
    }

    const {error} = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id' , userId)
    .eq('variant_id' , variantId)

    if(error){
      console.error('ERROR in deleteItemFromCart' ,error)
      return;
    }

    setCartItems((prevItems)=>{
      return prevItems.filter((prev)=> prev.variantId !== variantId)
    })

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
