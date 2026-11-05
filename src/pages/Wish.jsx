import { Link } from "react-router-dom";
import { useWish } from "../context/WishContext";
import Card from "../components/Card"
export function Wish() {
  const { wishListItem, toggleWishList } = useWish();

  return (
    <div className="min-h-screen bg-[#F7F5F0] px-5 pb-16 pt-32 sm:px-10">

      <h1 className="mb-2 text-3xl md:text-7xl font-bold text-[#171717]">
        MY WISHLIST
      </h1>

      <p className="mb-10 text-sm text-[#737373]">
        YOUR SAVED PIECES
      </p>

      {wishListItem.length === 0 ? (

        <div className="py-20 text-center">
          <p className="mb-5 text-[#737373]">
            Your wishlist is empty.
          </p>

          <Link
            to="/products"
            className="border-b border-[#171717] pb-1 text-sm"
          >
            EXPLORE COLLECTION
          </Link>
        </div>

      ) : (

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">

          {wishListItem.map((wish) => (
           
           <Card   key={wish.id}  product={wish}/> 

          ))}

        </div>

      )}

    </div>
  );
}