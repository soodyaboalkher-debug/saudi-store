

import { supabase } from "../supabase";
import { categories } from "../data/categories";
import Card from "../components/Card";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect ,useState } from "react";


function Products (){
  const [products, setProducts] = useState([]);
  
  const [searchParams ,setSearchParams]=useSearchParams();

  const categorySlug = searchParams.get("category");

  const selectedCategory = categories.find(cat => cat.slug === categorySlug)?.id ?? "all";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  


 useEffect(()=>{

  const getProducts =async ()=>{

   setError("")
   setLoading(true)


   try{

    let query = supabase
    .from ("products")
    .select("*")
    .order("id" , {ascending:true})


    if(selectedCategory !== "all"){

      query =query.eq("category_id" , selectedCategory);

    }
    const {data , error} =await query;

    if(error){
     throw error;
    }

    setProducts(data ?? [])



   }
   catch(err){

   console.error(err.message)

   setError("An error occurred while retrieving data. Please try again")
   }
   finally{


    setLoading(false)
   }

  }

  getProducts()


 },[selectedCategory ,retry])
  
  









 

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      {/* المقدمة والعناوين */}
      <div className="flex flex-col items-center justify-center bg-[#F5F1E9] px-6 py-20 sm:py-20 text-center">
        <p className="text-sm tracking-[0.3em] text-[#737373] pt-8">
          OUR COLLECTION
        </p>

        <h1
          className="mt-4 text-4xl font-light tracking-tight text-[#171717] md:text-5xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Timeless Pieces. Modern You.
        </h1>

        <p className="mt-4 max-w-xl text-base leading-7 text-[#737373]">
          Discover our collection of carefully crafted essentials,
          designed for modern men who appreciate timeless style.
        </p>
      </div>



      <div className="flex items-center justify-center pt-6 tracking-[0.2em]">JUST LANDED</div>

      {/* أزرار التصنيفات */}
      <nav className="flex min-h-16 flex-wrap items-center justify-center gap-4 px-4 py-2 text-black sm:gap-8">

        
        <button
          onClick={() => setSearchParams({})}
          className={`border-b py-2 text-sm transition ${
            selectedCategory === "all"
              ? "border-[#A39585] text-[#A39585]"
              : "border-transparent hover:text-[#A39585]"
          }`}
        >
          All
        </button>

        {categories.map((cate) => (
          <button
            key={cate.id}
            onClick={() => setSearchParams({category:cate.slug})}
            className={`border-b px-2 py-2 text-sm transition ${
              selectedCategory === cate.id
                ? "border-[#A39585] text-[#A39585]"
                : "border-transparent hover:text-[#A39585]"
            }`}
          >
            {cate.name}
          </button>
        ))}
      </nav>

      {/* تحميل أو خطأ أو منتجات */}
      {loading ? (
        <div
          className="flex flex-col items-center justify-center gap-3 py-12 text-center text-zinc-500"
          role="status"
        >
          <LoaderCircle
            className="h-10 w-10 animate-spin text-[#A39585]"
          />
          <p className="text-sm tracking-wide">
            Loading products...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => setRetry((old) => old +1)}
            className="border border-[#A39585] px-5 py-2 text-sm transition hover:bg-[#E7E2D9]"
          >
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <p className="py-12 text-center text-zinc-500">
          No products found in this collection.
        </p>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} product={product}  />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
