
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LoaderCircle ,Search } from "lucide-react";
import { supabase } from "../supabase";
import Card from "../components/Card";

function Products() {



  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [search ,setSearch]=useState('');

  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');



  const min = appliedMinPrice === '' ? -Infinity : Number(appliedMinPrice);
  const max = appliedMaxPrice === '' ? Infinity : Number(appliedMaxPrice);



  const [searchParams, setSearchParams] = useSearchParams();

  const categorySlug = searchParams.get("category");

  const matchedCategory = categories.find(
    (cat) => cat.slug === categorySlug
  );
 
  
  useEffect(()=>{

    if(minPrice === '' && maxPrice === ''){
      setAppliedMinPrice('');
      setAppliedMaxPrice('');
    }

  },[minPrice ,maxPrice]);



  const selectedCategory = categorySlug
    ? matchedCategory?.id
    : "all";


  // Filter products
  const hasPriceFilter =
  appliedMinPrice !== '' || appliedMaxPrice !== '';

  const filtredProducts = products.filter((product) => {

    // 1. Search condition
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    // 2. Price condition
    const matchesPrice = hasPriceFilter? 
    ( product.product_variants?.some((variant) => {
       return (variant.stock > 0 
        && Number(variant.price) >= min 
        &&Number(variant.price) <= max);
      }) ?? false
  
    ): true;
      

    // 3. Final result
    return matchesSearch && matchesPrice;
  });



  // get categories from supabase
  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;

        setCategories(data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to retrieve categories.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    getCategories();
  }, []);

  // get products from supabase
  useEffect(() => {
    if (categoriesLoading) return;

    const getProducts = async () => {
      setLoading(true);
      setError("");

      if (categorySlug && !matchedCategory) {
        setProducts([]);
        setError("Category not found.");
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from("products")
          .select(`* ,product_variants(
            price,
            stock
            )`)
          .order("id", { ascending: true });

        if (selectedCategory !== "all") {
          query = query.eq("category_id", selectedCategory);
        }

        const { data, error } = await query;

        if (error) throw error;

        const productsWithPrice= (data ?? []).map((product)=>{
         const availableVariant = product.product_variants.filter((variant)=> variant.stock > 0  );

         const minPrice = availableVariant.length > 0 
         ?Math.min(...availableVariant.map(variant => Number(variant.price))) : null;

         return {...product , minPrice};

        });


        setProducts(productsWithPrice);
        
         
        


      } catch (err) {
        console.error(err);
        setError(
          "An error occurred while retrieving data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [
    categoriesLoading,
    categorySlug,
    matchedCategory,
    selectedCategory,
    retry,
  ]);

 


  
  

  
  
 

  return (
    <div className="mt-20 min-h-screen bg-[#F7F5F0] px-8">

      {/* المقدمة */}
      <div className="flex flex-col items-start justify-center">
        <p
          className="pt-8 text-4xl font-light tracking-[0.11em] text-black sm:text-5xl sm:tracking-[0.2em] md:text-7xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          COLLECTION
        </p>

        <p className="mt-3 text-sm font-normal tracking-wide text-[#737373] sm:text-base">
          Curated essentials for the modern man.
        </p>
      </div>



      <div className="flex flex-col gap-5 pt-6 lg:flex-row lg:items-center lg:justify-between">

        {/* navbar categories */}
        <nav className="flex flex-wrap items-center justify-center gap-4 px-2 text-black sm:gap-8">

          <button
            onClick={() => setSearchParams({})}
            className={`border-b py-2 text-sm tracking-wide transition-all duration-300 ${
              selectedCategory === "all"
                ? "border-[#A39585] text-[#A39585]"
                : "border-transparent text-[#737373] hover:border-[#A39585] hover:text-[#A39585]"
            }`}
          >
            All
          </button>

          {categories.map((cate) => (
            <button
              key={cate.id}
              onClick={() =>
                setSearchParams({ category: cate.slug })
              }
              className={`border-b px-3 py-2 text-sm tracking-wide transition-all duration-300 ${
                selectedCategory === cate.id
                  ? "border-[#A39585] text-[#A39585]"
                  : "border-transparent text-[#737373] hover:border-[#A39585] hover:text-[#A39585]"
              }`}
            >
              {cate.name}
            </button>
          ))}

        </nav>

        {/* search */}
        <div  className=" flex items-center justify-center ">
         <Search className="text-[#A39585]"/>
         <input type="text"
         value={search} 
         onChange={(e)=>setSearch(e.target.value)}
         placeholder="SEARCH IN CATEGORY"
         className="focus:outline-none focus:ring-0" />
        </div>


        {/* priceFilter */}
        <div className="flex items-center justify-center gap-3 px-4">

          <span className="text-[10px] font-medium uppercase tracking-widest text-[#737373]">
            Price
          </span>

          <div className="flex items-center gap-2">

            <input
              
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              type="number"
              placeholder="Min"
              className="w-20 border-b border-[#D8D0C5] bg-transparent 
              px-2 py-2 text-sm text-[#171717] outline-none transition 
              placeholder:text-[#A39B90] focus:border-[#A39585]"
            />

            <span className="text-xs text-[#A39585]">—</span>

            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              type="number"
              placeholder="Max"
              className="w-20 border-b border-[#D8D0C5]
              bg-transparent px-2 py-2 text-sm text-[#171717] 
              outline-none transition placeholder:text-[#A39B90]
              focus:border-[#A39585]"
            />

            <button
              onClick={() => {
                setAppliedMinPrice(minPrice);
                setAppliedMaxPrice(maxPrice);
              }}
              className="uppercase text-xs bg-black text-white py-2 px-4 hover:cursor-pointer"
            >
              MATCHING
            </button>


          </div>

        </div>

      </div>



 
      { categoriesLoading || loading ? (
      <div
        className="flex bg-[#F7F5F0] flex-col items-center justify-center gap-3 text-center text-zinc-500 pt-6"
        role="status"
      >
        <LoaderCircle className="h-10 w-10 animate-spin text-[#A39585]" />
        <p className="text-sm tracking-wide">
          Loading products...
        </p>
      </div>
      ):
      error ? 
      (

      <div className="flex flex-col items-center justify-center gap-4 text-center bg-[#F7F5F0]">
        <p className="text-red-600">{error}</p>

        <button
          onClick={() => {
            setRetry((old) => old + 1);
            if (categories.length === 0) {
              setCategoriesLoading(true);
            }
          }}
          className="border border-[#A39585] px-5 py-2 text-sm transition hover:bg-[#E7E2D9]"
        >
          Try Again
        </button>
      </div>
      ):
      filtredProducts.length === 0 ?
      ( <div className="flex items-center justify-center bg-[#F7F5F0] pt-6">
          <p className="text-center text-zinc-500">
             No products found in this collection.
          </p>
        </div>
      ):(

        <div 
        className="
        mx-auto grid max-w-7xl grid-cols-1 gap-6
        px-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        "
        >
        {filtredProducts.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
      )
    
    
    }

      
    </div>
  );
}

export default Products;
