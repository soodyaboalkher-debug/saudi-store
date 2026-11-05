import { createContext ,useContext ,useState} from "react";






const wishContext = createContext();

export const useWish = () =>  useContext (wishContext);



export function WishProvider ({children}){


    const [wishListItem , setWishListItem] =useState([]);
  

    
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


};


