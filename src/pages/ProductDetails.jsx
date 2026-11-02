
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {supabase} from "../supabase"
import { useCart } from '../context/CartContext';






export default function ProductDetails() {
  const { id } = useParams();
  const {addToCart}=useCart();
  


  const [product,setProduct]=useState(null)
  const [wrong ,setWrong]=useState('');
  const [loading,setLoading]=useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity,setQuantity]=useState(1)



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















 if(loading) return <div className='h-full flex items-center justify-center mt-18 p-7'
 >SAUDI_LOADING...
 </div>;


 if(wrong) return <div className='flex items-center justify-center mt-20 p-7'
 >{wrong}
 </div>;


 if(!product) return <div className='flex items-center justify-center mt-20 p-7'
 >product is empety
 </div>;
 


  return (
    <div className="min-h-screen bg-[#F7F5F0] pt-24 pb-16 px-6 md:px-12 text-[#2C2C2C]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* --- قسم صورة المنتج --- */}
        <div className="w-full bg-[#E7E2D9] rounded-2xl overflow-hidden aspect-[3/4] flex items-center justify-center border border-[#C5BCAC]/30 shadow-sm">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* --- قسم تفاصيل المنتج والخيارات --- */}
        <div className="flex flex-col justify-between h-full space-y-8 py-2">
          
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
                  setQuantity(1)}
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
                Quantity : {selectedVariant.stock}
              </span>
              <div className="inline-flex items-center border border-[#C5BCAC] rounded-lg bg-transparent">


                <button 
                 onClick={()=>setQuantity((prev)=>Math.max(1, prev -1))}
                className="px-4 py-2 text-base text-[#2C2C2C] hover:bg-[#E7E2D9] transition rounded-l-lg"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-medium text-[#2C2C2C]">
                 {quantity}
                </span>
                <button
                onClick={()=>setQuantity((prev)=>Math.min(selectedVariant.stock ,prev +1))}
                 className="px-4 py-2 text-base text-[#2C2C2C] hover:bg-[#E7E2D9] transition rounded-r-lg">
                  +
                </button>


              </div>
            </div>
          </div>

          {/* زر الإضافة إلى السلة */}
          <div className="pt-4">

            

            <button 
             className="w-full py-4 bg-[#2C2C2C] 
             text-[#F7F5F0] text-sm uppercase tracking-widest 
             font-medium rounded-xl hover:bg-[#403E3B] 
             active:scale-[0.99] transition-all duration-200 shadow-md"
             onClick={() => {
                addToCart(product, quantity, selectedVariant);
              }}
             

            >

              ADD TO CART

            </button>

          </div>

        </div>

      </div>
    </div>
  );
}