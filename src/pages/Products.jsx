
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { supabase } from "../supabase";
import Card from "../components/Card";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const categorySlug = searchParams.get("category");

  const matchedCategory = categories.find(
    (cat) => cat.slug === categorySlug
  );

  const selectedCategory = categorySlug
    ? matchedCategory?.id
    : "all";

  // جلب التصنيفات
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

  // جلب المنتجات
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
          .select("*")
          .order("id", { ascending: true });

        if (selectedCategory !== "all") {
          query = query.eq("category_id", selectedCategory);
        }

        const { data, error } = await query;

        if (error) throw error;

        setProducts(data ?? []);
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

      {/* التصنيفات */}
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
            onClick={() =>
              setSearchParams({ category: cate.slug })
            }
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


 
      { categoriesLoading || loading ? (
      <div
        className="flex bg-[#F7F5F0] flex-col items-center justify-center gap-3 text-center text-zinc-500"
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
      products.length === 0 ?
      (   <div className="flex items-center justify-center bg-[#F7F5F0]">
        <p className="text-center text-zinc-500">
          No products found in this collection.
        </p>
      </div>
      ):(

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
      )
    
    
    }

      
   

    </div>
  );
}

export default Products;
