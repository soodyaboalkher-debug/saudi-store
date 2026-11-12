
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useWish } from "../context/WishContext";

const Card = ({ product }) => {
  const { wishListItem, toggleWishList } = useWish();

  const isWishList = wishListItem.some(
    (item) => item.id === product.id
  );

  return (
    <article className="group w-full">

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#EAE6DE]">

        <Link
          to={`/products/${product.id}`}
          aria-label={`View ${product.name}`}
          className="block h-full w-full"
        >
          <img
            src={product.image_url || "/cauol.jpg"}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Edition Label */}
        <span className="absolute left-3 top-3 bg-[#F7F5F0] px-3 py-1.5 text-[9px] tracking-[0.18em] text-[#34312C]">
          SAUDI EDITION
        </span>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishList(product)}
          aria-label="Toggle wishlist"
          className={`absolute right-3 top-3 flex h-9 w-9 items-center
             justify-center rounded-full bg-white/90 backdrop-blur-sm 
             transition-all duration-300 hover:scale-110 ${
            isWishList ? "text-red-600" : "text-[#A39585]"
          }`}
        >
          <FaHeart size={15} />
        </button>

        {/* Quick View */}
        <Link
          to={`/products/${product.id}`}
          className="absolute bottom-0 left-0 w-full
          translate-y-full bg-[#171717] py-4 text-center
          text-[10px] tracking-[0.22em] text-white 
          transition-transform duration-300 group-hover:translate-y-0"
        >
          QUICK VIEW
        </Link>

      </div>

      {/* Product Information */}
      <div className="flex items-start justify-between gap-3 pt-4">

        <div className="min-w-0">

          <Link
            to={`/products/${product.id}`}
            className="block truncate text-[13px] font-medium tracking-wide text-[#262626] transition-colors hover:text-[#A39585]"
          >
            {product.name}
          </Link>

          <p className="mt-2 text-[10px] tracking-[0.16em] text-[#999087]">
            MODERN ESSENTIALS
          </p>

        </div>

        <div className="shrink-0 text-right">
          {product.minPrice !== null &&
           product.minPrice !== undefined ? (
            <>
              <span className="block text-[9px] tracking-wider text-[#999087]">
                FROM
              </span>

              <p className="mt-1 text-xs font-medium tracking-wide text-[#262626]">
                {Number(product.minPrice).toLocaleString("en-US")} EGP
              </p>
            </>
          ) : (
            <span className="text-[10px] tracking-wide text-[#999087]">
              OUT OF STOCK
            </span>
          )}
        </div>

      </div>

    </article>
  );
};

export default Card;
