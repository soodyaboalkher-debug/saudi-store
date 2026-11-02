
import { useCart } from "../context/CartContext";

import {
  FaChevronLeft,
  FaChevronRight,
  FaRegTrashAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";

export function CartProduct() {

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    deleteItemCart,
    clearCart,
  } = useCart();

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-[#F7F5F0] pt-20">

      {/* PAGE TITLE */}
      <div className="px-5 sm:px-8 lg:px-12 py-8">

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight"
        >
          CART
        </h1>

        <p className="text-stone-400 text-xs tracking-[0.2em] mt-3">
          YOUR SELECTED PIECES
        </p>

      </div>


        {/* MAIN CONTENT */}
        <div 
        className="grid grid-cols-1 lg:grid-cols-[1fr_340px] 
        xl:grid-cols-[1fr_400px] gap-10 lg:gap-14 px-5 sm:px-8 lg:px-12 pb-16"
        >


            {/* PRODUCTS SECTION */}
            <section className="min-w-0">

            {/* SECTION HEADER */}
            <div className="flex items-center justify-between border-b border-stone-300 pb-4">

                <h2 className="text-xs tracking-[0.2em] text-stone-500">
                PRODUCTS ({cartItems.length})
                </h2>

                {cartItems.length > 0 && (
                <button
                    onClick={clearCart}
                    className="text-[11px] tracking-widest text-stone-500 hover:text-red-800 transition-colors"
                >
                    CLEAR CART
                </button>
                )}

            </div>


            {/* EMPTY CART */}
            {cartItems.length === 0 ? (

                <div className="py-20 text-center">

                <h2 className="text-2xl font-medium mb-3">
                    YOUR CART IS EMPTY
                </h2>

                <p className="text-sm text-stone-500 mb-8">
                    Discover our latest collection.
                </p>

                <Link
                    to="/products"
                    className="inline-block bg-[#171717] text-white px-8 py-4
                    text-xs tracking-widest hover:bg-stone-700 transition"
                >
                    CONTINUE SHOPPING
                </Link>

                </div>

            ) : (

                /* PRODUCTS LIST */
                cartItems.map((item) => (

                <div
                    key={`${item.id}-${item.variantId}`}
                    className="grid grid-cols-[88px_minmax(0,1fr)_auto] 
                    sm:grid-cols-[120px_minmax(0,1fr)_auto]
                     md:grid-cols-[144px_minmax(0,1fr)_auto] gap-3
                     sm:gap-5 py-6 border-b border-stone-200 items-start"
                >

                    {/* PRODUCT IMAGE */}
                    <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full aspect-[3/4] object-cover bg-[#F0EDE7]"
                    />


                    {/* PRODUCT DETAILS */}
                    <div className="flex flex-col min-w-0 gap-3">

                    <h3 className="text-sm sm:text-base font-medium line-clamp-2">
                        {item.name}
                    </h3>

                    <p className="text-sm text-stone-500">
                        EGP {item.price}
                    </p>
                    <p>

                        {item.size}
                    </p>


                    {/* QUANTITY */}
                    <div className="flex items-center gap-3 mt-2">

                        <div className="flex items-center border border-stone-300 px-2 py-2 gap-3">

                        <button
                            onClick={() => decreaseQuantity(item.variantId)}
                            aria-label="Decrease quantity"
                            className="text-stone-500 hover:text-black transition"
                        >
                            <FaChevronLeft size={11} />
                        </button>

                        <span className="text-sm min-w-4 text-center">
                            {item.quantity}
                        </span>

                        <button
                            onClick={() => increaseQuantity(item.variantId)}
                            aria-label="Increase quantity"
                            className="text-stone-500 hover:text-black transition"
                        >
                            <FaChevronRight size={11} />
                        </button>

                        </div>

                        <span className="hidden sm:inline text-[10px] tracking-widest text-stone-400">
                        QUANTITY
                        </span>

                    </div>

                    </div>


                    {/* DELETE BUTTON */}
                    <button
                    onClick={() => deleteItemCart(item.variantId)}
                    aria-label={`Remove ${item.name}`}
                    title="Remove product"
                    className="text-stone-400 hover:text-red-800 transition-colors p-2"
                    >
                    <FaRegTrashAlt size={15} />
                    </button>

                </div>

                ))

            )}

            </section>



            {/* SUMMARY SECTION */}
            <aside className="lg:sticky lg:top-28 h-fit">

                <div className="bg-white p-6 sm:p-8">

                    <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-4">
                    SAUDI / YOUR ORDER
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    ORDER SUMMARY
                    </h2>

                    <div className="border-b border-stone-200 my-7" />


                    {/* SUBTOTAL */}
                    <div className="flex justify-between items-center mb-6">

                        <span className="text-sm text-stone-500">
                            Subtotal
                        </span>

                        <span className="text-sm font-medium">
                            EGP {subtotal.toLocaleString("en-EG")}
                        </span>

                    </div>


                    {/* SHIPPING */}
                    <div className="flex justify-between items-start gap-3 mb-6">

                        <span className="text-sm text-stone-500">
                            Shipping
                        </span>

                        <span className="text-xs text-stone-400 text-right">
                            Calculated at checkout
                        </span>

                    </div>


                    <div className="border-b border-stone-200 my-6" />


                        {/* TOTAL */}
                        <div className="flex justify-between items-center">

                        <span className="font-medium text-sm">
                            Total
                        </span>

                        <span className="text-xl font-semibold">
                            EGP {subtotal.toLocaleString("en-EG")}
                        </span>

                    </div>


                    {/* CHECKOUT */}
                    <button
                    disabled={cartItems.length === 0}
                    className="w-full bg-[#171717] text-white py-4 mt-8 text-xs tracking-[0.15em] hover:bg-stone-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                    PROCEED TO CHECKOUT
                    </button>


                    <p className="text-center text-[10px] tracking-widest text-stone-400 mt-5">
                    SECURE CHECKOUT
                    </p>

                </div>

            </aside>

        </div>

    </div>
  );
}
