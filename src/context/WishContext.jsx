import { createContext ,useContext ,useState ,useEffect} from "react";
import { useAuth } from "./AuthContext";

const wishContext = createContext();

export const useWish = () =>  useContext (wishContext);





export function WishProvider ({children}){


    
   

    const {user , loading} = useAuth();

    if(loading) return null;

    const storageKey = user ? `saudi_wish_${user.id}` : 'saudi_wish_guest';



    return(
        <WishStateProvider key={storageKey} storageKey={storageKey}>

         {children}

        </WishStateProvider>
    )


};


function WishStateProvider ({children , storageKey}){

 const [wishListItem , setWishListItem] =useState(()=>{

    try{
        const savedWish = localStorage.getItem(storageKey)

        return savedWish? JSON.parse(savedWish) :[];

        

    }catch(error){
     
    console.error("Error loading wish:" ,error);

    return [];
        
    }
 });



   useEffect(()=>{

    localStorage.setItem(storageKey ,JSON.stringify(wishListItem))

    },[storageKey,wishListItem]);





   const toggleWishList = (product)=>{

        setWishListItem((prevItem)=>{
            const existingItem =
            prevItem.find((prev)=>prev.id === product.id);

            if(existingItem){
            return prevItem.filter((prev)=> 
            prev.id !== product.id)}

            return[...prevItem,product]
        }

        );
    };


    return (


        <wishContext.Provider value={{wishListItem ,toggleWishList}}>

           {children}

        </wishContext.Provider>
    );





}

  
   


    




  





