
import { useState ,useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  X,
  Heart,
} from "lucide-react";

import { useCart } from "../context/CartContext";





const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const suggestions = ["Suits", "Casual", "Trousers"];

  const{cartItems}=useCart();



 {/* search */}
 useEffect(()=>{

 const searchProduct = async()=>{

  try{

    const term = searchTerm.trim();

    if(!term){

      setSearchResults([])

      setSearchLoading(false)

      return;
    }

    setSearchLoading(true)

    const {data ,error} = await supabase
    .from('products')
    .select(`id , name ,image_url `)
    .ilike('name' , `%${term}%`)
    .limit(6);

    if(error){
      throw new Error(error.message)
    }


    setSearchResults(data ?? [])

    setSearchLoading(false)

  }
  catch(err){

  console.error("search error :",err.message)
  setSearchResults([])
  }
  finally{

    setSearchLoading(false)
  }
  
 }

 const timer =setTimeout(searchProduct,300);
 
  return ()=>clearTimeout(timer);

},[searchTerm])




const iconClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5DED3] bg-white/80 text-[#292824] transition duration-300 hover:bg-[#EDE5D9]";

const navLinks = [
    { label: "HOME", to: "/" },
    { label: "SUITS", to: "/products?category=suits" },
    { label: "CASUAL", to: "/products?category=casual" },
    { label: "TROUSERS", to: "/products?category=trousers" },
    
    
    { label: "All CATEGORY" , to :"/products"},
    { label: "ABOUT", to: "/#" },
  ];

return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-[#E5DED3]/70 bg-[#F7F5F0]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full items-center justify-between px-4 sm:px-8 lg:px-12">



          {/* Logo + Categories */}
        <div className="flex items-center gap-5 lg:gap-10">
          <Link
            to="/"
            className="text-xl font-semibold uppercase tracking-[0.18em] text-[#292824] sm:text-[18px]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            SAUDI
          </Link>

          <div className="hidden items-center gap-5 md:flex lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="border-b border-transparent py-2 text-[8px] 
                font-sm tracking-[0.11em] text-[#555149] transition
                 hover:border-[#A39585] hover:text-[#171717] lg:text-[11px]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Left Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={()=>{setSearchOpen(true)}}
            type="button"
            aria-label="Search"
            className={`relative group ${iconClass}`}
          >
            <Search size={19} strokeWidth={1.6} />

            <span className="
              absolute left-1/2 top-full mt-3
              -translate-x-1/2
              whitespace-nowrap
              rounded-md bg-[#171717] px-3 py-2
              text-xs text-white
              opacity-0 invisible
              transition-all duration-200
              group-hover:opacity-100
              group-hover:visible"
            >
              search in products
            </span>
          </button>

          <Link
            to="/login"
            aria-label="Account"
            className={`${iconClass} hidden sm:flex group relative`}
          >
            <UserRound size={19} strokeWidth={1.6} />
              <span className="
              absolute left-1/2 top-full mt-3
              -translate-x-1/2
              whitespace-nowrap
              rounded-md bg-[#171717] px-3 py-2
              text-xs text-white
              opacity-0 invisible
              transition-all duration-200
              group-hover:opacity-100
              group-hover:visible"
            >
              my profail
            </span>
            
          </Link>


          <Link
          to='/favorit'
          className={`${iconClass} hidden sm:flex group relative`}
          >
            
           <Heart  size={19} strokeWidth={1.6}/>
            <span className="
              absolute left-1/2 top-full mt-3
              -translate-x-1/2
              whitespace-nowrap
              rounded-md bg-[#171717] px-3 py-2
              text-xs text-white
              opacity-0 invisible
              transition-all duration-200
              group-hover:opacity-100
              group-hover:visible"
            >
              my wish list
            </span>
            
          </Link>

          <Link
            to="/cart"
            aria-label="Shopping bag"
            className={`relative group ${iconClass}`}
          >
            <ShoppingBag size={19} strokeWidth={1.6} />


            <span 
            className="absolute -right-2 -top-2 
            text-xs bg-[#A39585] text-white rounded-full px-1.5"
            >{cartItems.length}
            </span>

            <span className="
              absolute left-1/2 top-full mt-3
              -translate-x-1/2
              whitespace-nowrap
              rounded-md bg-[#171717] px-3 py-2
              text-xs text-white
              opacity-0 invisible
              transition-all duration-200
              group-hover:opacity-100
              group-hover:visible"
            >
              my bage
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className={`${iconClass} md:hidden`}
          >
            {menuOpen ? (
              <X size={20} strokeWidth={1.6} />
            ) : (
              <Menu size={20} strokeWidth={1.6} />
            )}
          </button>
        </div>

      
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-[#E5DED3] bg-[#F7F5F0] px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5">
          
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-xs tracking-[0.18em] text-[#292824]"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-xs tracking-[0.18em] text-[#292824]"
            >
              MY ACCOUNT
            </Link>

         
          </div>
        </div>
      )}





      {/* Search Popup */}
      {searchOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setSearchOpen(false)}
          />

          {/* Popup */}
          <div 
           className="
            fixed left-1/2 top-24 z-50
            w-[calc(100%-2rem)] max-w-3xl
            -translate-x-1/2
            max-h-[calc(100dvh-7rem)] overflow-y-auto
            rounded-2xl
            border border-[#E5DED3]
            bg-[#F7F5F0]
            px-4 py-6
            shadow-2xl
            sm:px-8 sm:py-8"
          
          >
            <div className="mx-auto max-w-3xl">

              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.25em] text-[#737373]">
                    DISCOVER SAUDI
                  </p>

                  <h2 className="mt-2 text-2xl text-[#171717] sm:text-3xl">
                    What are you looking for?
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
                  className="flex h-10 w-10 items-center
                   justify-center rounded-full border
                    border-[#E5DED3] hover:bg-[#EDE5D9]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Input */}
              <div className="flex items-center gap-3 border-b border-[#292824] py-3">
                <Search size={20} className="text-[#737373]" />

                <input
                  type="search"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent text-sm 
                  text-[#171717] outline-none placeholder:text-[#A39B90]"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-xs text-[#737373]"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Suggestions */}
              {!searchTerm.trim() && (
                <div className="mt-7">
                  <p className="mb-4 text-[10px] tracking-[0.2em] text-[#737373]">
                    POPULAR SEARCHES
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setSearchTerm(suggestion)}
                        className="rounded-full border border-[#E5DED3] px-4 py-2 text-xs text-[#555149] transition hover:bg-[#EDE5D9]"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {searchTerm.trim() && (
                <div className="mt-7">
                  <p className="mb-4 text-[10px] tracking-[0.2em] text-[#737373]">
                    SEARCH RESULTS
                  </p>

                  {searchLoading ? (
                    <p className="py-4 text-sm text-[#737373]">
                      Searching products...
                    </p>
                  ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-4 rounded-lg p-2 hover:bg-[#EDE5D9]"
                        >
                          <img
                            src={product.image_url || "/cauol.jpg"}
                            alt={product.name}
                            className="h-16 w-14 shrink-0 bg-[#E7E2D9] object-cover"
                          />

                          <div>
                            <p className="text-sm text-[#292824]">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs text-[#737373]">
                              {product.price}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    !searchLoading && (
                      <p className="py-4 text-sm text-[#737373]">
                        No products found. Try another search.
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </nav>
  );
};

export default Navbar;
