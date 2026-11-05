


import { FaHeart } from "react-icons/fa"; 
import { Link } from "react-router-dom";
import { useWish } from "../context/WishContext";

const Card = ({ product }) => {




 
 const {wishListItem,toggleWishList} = useWish();


 const isWishList = wishListItem.some(
  (item) => item.id === product.id
);



  return (
    <article className="group w-full max-w-[340px] bg-white">
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F0EDE7]">
        <Link
          to={`/products/${product.id}`}
          aria-label={`View ${product.name}`}
          className="block h-full w-full"
        >
          <img
            src={product.image_url || "/cauol.jpg"}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        {/* Product Details Icon */}
       
      </div>

      {/* Product Details */}
      <div className="flex items-start justify-between gap-3 px-1 py-4">

        
        <div className="min-w-0">
          <Link
            to={`/products/${product.id}`}
            className="text-sm font-medium text-[#262626] transition-colors hover:text-[#A39585]"
          >
            {product.name}
          </Link>

        </div>

          <button
           onClick={()=>{
            
            
            toggleWishList(product);

           }}
           
             className={`flex items-center justify-center
             hover:text-red-700 ${isWishList? 'text-red-700':'text-stone-300'}`}
           
          >
            <FaHeart size={18} strokeWidth={1.7} 
           />
          </button>

       
      </div>
    </article>
  );
};

export default Card;
