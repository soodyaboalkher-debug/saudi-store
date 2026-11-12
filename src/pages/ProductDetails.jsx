
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {supabase} from "../supabase"
import { useCart } from '../context/CartContext';
import { LoaderCircle } from 'lucide-react';
import { useWish } from '../context/WishContext';
import { Heart } from 'lucide-react';




export default function ProductDetails() {
  const { id } = useParams();
  const {addToCart ,addLoading}=useCart();
  const {toggleWishList ,wishListItem}=useWish();


  const [product,setProduct]=useState(null)
  const [wrong ,setWrong]=useState('');
  const [loading,setLoading]=useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [quantity,setQuantity]=useState(1);
  const [showMessage, setShowMessage] = useState(false);

 



  const isWishList =wishListItem.some((wish) => wish.id === Number (id))




 useEffect(()=>{
  
  const getProduct = async()=>{


    try{

    setLoading(true)
    setWrong('')

    const {data,error}=await supabase

   .from ('products')
   .select(`* , 
    product_variants(
    id ,
    price ,
    stock,
    sizes(
      id,
      name
    )
        
    )`)
    

    .eq('id' ,id)
    .single()

    if(error){
      throw error;
    }

    setProduct(data);
    const { data: sizesData, error: sizesError } = await supabase
   .from('sizes')
   .select('*');

   

    if (data && data.product_variants && data.product_variants.length > 0) {
      setSelectedVariant(data.product_variants[0]);
    }


    }catch(err){
    
      console.error(err.message);
      setWrong('an error occurred try agin')

    }finally{

      setLoading(false)
    }
  
  };

  getProduct();



 },[id])















 if(loading) return <div 
 className='bg-[#F7F5F0] h-screen flex flex-col items-center justify-center p-7 gap-4'
 >
  <LoaderCircle className='animate-spin w-11 h-11 '/>
  <p className='text-[11px]'>SAUDI_LOADING...</p>
 </div>;


 if(wrong) return <div className='h-screen bg-[#F7F5F0] flex items-center justify-center mt-20 p-7'
 >{wrong}
 </div>;


 if(!product) return <div className='flex items-center justify-center mt-20 p-7'
 >product is empety
 </div>;
 
 

  return (
 
    <div className="min-h-screen bg-[#F7F5F0] pt-24 pb-16 px-6 md:px-12 text-[#2C2C2C]">
         {showMessage && !addLoading &&(
            <div className="
              fixed top-20 left-1/2 -translate-x-1/2
              z-50
              bg-[#292722]
              text-white
              px-8 py-4
              shadow-xl
              rounded-lg
              text-sm
              tracking-wide
              whitespace-nowrap
            ">
              Product added to your bag successfully
            </div>
          )}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* --- قسم صورة المنتج --- */}
        <div className="w-full bg-[#E7E2D9] rounded-2xl 
        overflow-hidden aspect-[3/4] flex items-center justify-center 
        border border-[#C5BCAC]/30 shadow-sm">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* --- قسم تفاصيل المنتج والخيارات --- */}
        <div className="flex flex-col justify-between space-y-6 py-2">
          
          <div>
            {/* عنوان المنتج */}
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-wide mb-3">
             {product.name}
            </h1>
            
            {/* السعر */}
            <p className="text-xl md:text-2xl font-light text-[#5A524C] mb-6">
            {selectedVariant ? selectedVariant.price : '---'} EGP
            </p>

            {/* وصف المنتج */}
            <p className="text-sm md:text-base leading-relaxed text-[#6E665E] font-light mb-8">
              A refined minimalist wardrobe essential crafted from breathable luxury fabric. 
              Designed for a relaxed yet tailored fit.
            </p>

            {/* اختيار المقاسات (Sizes) */}
            <div className="mb-8">

              
              <span className="block text-xs uppercase tracking-widest text-[#8C8275] mb-3">
                Select Size
              </span>

              <div className="flex flex-wrap gap-3">

               {/* جدول البروداكت فايرنتس بيحتوى على
                العنصر بتاعنا بس ممكن العنصر يكون 
               بيحتوى على كذا مقاس كل مقاس واخد صف الماب بتمر
                عليهم وكل فايرنت في الماب بتحتوى على صف كامل  */}

                {/* الصف ده بيحتوى على الستوك والاي دى
                 والبروداكت اي دى والسعر والمقاس اللى هوا السايز 
                 */}
               {product.product_variants?.map((variant)=>{

                const isSelected = selectedVariant?.id === variant.id;

                return(
                <button
                key={variant.id}
                onClick={()=>{setSelectedVariant(variant)
                  setQuantity(variant?.stock > 0 ?  1 : 0)}
                }
                
                  className={`min-w-[48px] h-11 px-4 text-xs tracking-wider 
                  border rounded-lg transition-all ${isSelected
                    ? 'bg-[#2C2C2C] text-[#F7F5F0] border-[#2C2C2C]'
                    : 'border-[#C5BCAC] text-[#2C2C2C] hover:border-[#2C2C2C] bg-transparent'
                }`}
               >{variant?.sizes?.name || 'Size'}</button>
              )
               })}
              </div>
            </div>

            {/* العداد والكمية (Quantity) */}
            <div className="mb-8">
              <span className="block text-xs uppercase tracking-widest text-[#8C8275] mb-3">
                Available Stock : {selectedVariant.stock}
              </span>
              <div className="inline-flex items-center border border-[#C5BCAC] rounded-lg bg-transparent">


                <button 
                disabled={selectedVariant?.stock <= 0}
                 onClick={()=>setQuantity((prev)=>Math.max(1, prev -1))}
                className="disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 text-base text-[#2C2C2C] hover:bg-[#E7E2D9] transition rounded-l-lg"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-medium text-[#2C2C2C]">
                 {quantity}
                </span>


                <button
                disabled={selectedVariant?.stock <= 0}
                onClick={()=>setQuantity((prev)=>Math.min(selectedVariant.stock ,prev +1))}
                 className="disabled:cursor-not-allowed disabled:opacity-30 px-4 py-2 text-base text-[#2C2C2C] hover:bg-[#E7E2D9] transition rounded-r-lg">
                  +
                </button>


              </div>
            </div>
          </div>



      
          {/* Product Actions */}
          <div className="flex flex-col gap-3 pt-6">
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishList(product)}
              className="
                w-full h-14
                flex items-center justify-center gap-3
                border border-[#D8D1C7]
                bg-transparent
                text-[#292722]
                text-xs font-medium uppercase tracking-[0.2em]
                hover:bg-[#EEEAE3]
                transition-all duration-300
              "
            >
              <Heart
                size={19}
                strokeWidth={1.5}
                className={`transition-colors duration-300 ${
                  isWishList
                    ? "text-red-600 fill-red-600"
                    : "text-[#292722] fill-transparent"
                }`}
              />

              {isWishList ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
            </button>

            {/* Add To Cart Button */}
            <button
              disabled={!selectedVariant || selectedVariant.stock <= 0}
              className="
                relative
                w-full h-14
                flex items-center justify-center
                bg-[#292722]
                text-[#F7F5F0]
                text-xs font-medium uppercase tracking-[0.2em]
                hover:bg-[#403E3B]
                disabled:opacity-40
                disabled:cursor-not-allowed
                active:scale-[0.99]
                transition-all duration-300
              "
              onClick={() =>{
                 addToCart(product, quantity, selectedVariant);
                  setShowMessage(true);
                  setTimeout(() => {
                    setShowMessage(false)
                  }, 2000);
                }}
            >
              {!selectedVariant
                ? "SELECT A SIZE"
                : selectedVariant.stock <= 0
                ? "OUT OF STOCK" :
                addLoading ? <LoaderCircle className='animate-spin' size={18}/>
                : "ADD TO BAG"}
            </button>

         

          </div>


        </div>

      </div>
    </div>
  );
}