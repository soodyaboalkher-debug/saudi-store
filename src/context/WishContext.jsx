
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../supabase";


const WishContext = createContext();

export const useWish = () => useContext(WishContext);



//اول داله
export function WishProvider({ children }) {

    const { user, loading } = useAuth();

    if (loading) return null;

    const userId = user?.id ?? null;

    const storageKey = userId
        ? `saudi_wish_${userId}`
        : "saudi_wish_guest";

    return (
        <WishStateProvider
            key={storageKey}
            storageKey={storageKey}
            userId={userId}
        >
            {children}
        </WishStateProvider>
    );
}


function WishStateProvider({ children, storageKey, userId }) {

    const [wishListItem, setWishListItem] = useState([]);

    const [wishLoading, setWishLoading] = useState(true);

    const [wishError, setWishError] = useState(null);

    const [retryCount, setRetryCount] = useState(0);

    const [wishActionLoading, setWishActionLoading] = useState(null);

    const [wishActionError, setWishActionError] = useState(null);

    const [wishSaveError, setWishSaveError] = useState(null);

    const retryWish = () => {
    setWishLoading(true);
    setWishError(null);
    setRetryCount(prev => prev + 1);
    };

    


   // جلب البيانات
   useEffect(() => {

    let isActive = true;

    const getData = async () => {

        try {

            // بداية التحميل
            setWishLoading(true);
            setWishError(null);

            // أولاً: لو المستخدم Guest
            if (!userId) {

                const savedWish = localStorage.getItem(storageKey);

                const parsedWish = savedWish
                    ? JSON.parse(savedWish)
                    : [];

                // نتأكد إن البيانات مصفوفة
                if (!Array.isArray(parsedWish)) {
                    throw new Error("Invalid wishlist data");
                }

                if (isActive) {
                    setWishListItem(parsedWish);
                    setWishLoading(false);
                }

                return;
            }

            // ثانياً: لو المستخدم مسجل
            const { data, error } = await supabase
                .from("wishlist_items")
                .select(`
                    product_id,
                    products (
                        id,
                        name,
                        image_url
                    )
                `)
                .eq("user_id", userId);

            if (error) {
                throw error;
            }

            if (!Array.isArray(data)) {
                throw new Error("Invalid wishlist response");
            }

            if (isActive) {
                setWishListItem(
                    data.map(item => item.products).filter(Boolean)
                );

                setWishLoading(false);
            }

        } catch (error) {

            console.error("Wishlist loading error:", error);

           

            if (isActive) {
                setWishError(error.message);
                setWishLoading(false);
            }

        }

    };

    getData();

    return () => {
        isActive = false;
    };

   },[userId, storageKey, retryCount]);



   // حفظ البيانات
    useEffect(() => {

        if (userId || wishLoading || wishError) return;

        try {

            localStorage.setItem(
                storageKey,
                JSON.stringify(wishListItem)
            );

            setWishSaveError(null);

        } catch (error) {

            console.error("Wishlist save error:", error);

            setWishSaveError("Could not save wishlist.");

        }

    }, [wishListItem, storageKey, userId, wishLoading, wishError]);





    const toggleWishList = async (product) => {

        if (wishLoading || wishError || wishActionLoading !== null) return;

        const isExist = wishListItem.some(
            item => item.id === product.id
        );

        // Guest
        if (!userId) {

            if (isExist) {
                setWishListItem(prevItems =>
                    prevItems.filter(item => item.id !== product.id)
                );
            } else {
                setWishListItem(prevItems => [...prevItems, product]);
            }

            return;
        }

        // Logged-in User
        try {

            setWishActionLoading(product.id);
            setWishActionError(null);

            if (isExist) {

             const { data, error } = await supabase
                .from("wishlist_items")
                .delete()
                .eq("user_id", userId)
                .eq("product_id", product.id)
                .select("product_id");

            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error("Wishlist item was not deleted");
            }



                setWishListItem(prevItems =>
                    prevItems.filter(item => item.id !== product.id)
                );

            } else {

                const { error } = await supabase
                    .from("wishlist_items")
                    .insert({
                        user_id: userId,
                        product_id: product.id
                    });

                if (error) throw error;

                setWishListItem(prevItems => [...prevItems, product]);

            }

        } catch (error) {

            console.error("Wishlist action error:", error);
            setWishActionError("Could not update your wishlist. Please try again.");

        } finally {

            setWishActionLoading(null);

        }
    };



   

    return (
        <WishContext.Provider 
        value={{
        wishListItem,
        wishLoading,
        wishError,
        retryWish,
        toggleWishList,
        wishActionLoading,
        wishActionError,
        wishSaveError
        }}>
            {children}
        </WishContext.Provider>
    );
}

