

import { Search } from "lucide-react";
import { Link } from "react-router-dom";


const Card = ({ product }) => {







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
        <Link
          to={`/products/${product.id}`}
          aria-label={`View details for ${product.name}`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center
           justify-center rounded-full bg-white text-[#262626] shadow-sm 
           transition hover:bg-[#262626] hover:text-white"
        >
          <Search size={18} strokeWidth={1.7} />
        </Link>
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

       
      </div>
    </article>
  );
};

export default Card;
