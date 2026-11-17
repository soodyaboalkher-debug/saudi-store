
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useState } from "react";
import { supabase } from "../supabase";

export default function Checkoute() {
  const { cartItems, decreaseQuantity, increaseQuantity } = useCart();

  const [formData ,setFormData]=useState({
    fullname :'',
    phone : '',
    governorate : '',
    city : '',
    address : '',
  })

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const shipping = 60;
  const subtotal = cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );


  const total = shipping + subtotal;

  const inputClass =
    "w-full border-b border-stone-300 bg-transparent py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#A39585]";

  const labelClass =
    "text-[10px] uppercase tracking-[2px] text-stone-500";


    const handleOrder =async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty");
            return;
        }



        if(!formData.fullname.trim() || 
        !formData.phone.trim() ||
        !formData.governorate.trim() ||
        !formData.city.trim() ||
        !formData.address.trim()

        ){
            alert('please fill in all fields')
            return;
        }

        if (formData.phone.length !== 11) {
        alert("Phone number must be 11 digits");
        return;
        }

  

        const { data, error } = await supabase.rpc(
        "create_order",
        {
            p_customer: formData,
            p_items: cartItems.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            })),
            p_payment_method: paymentMethod,
        }

        
        );

        if(error){
         alert(error.message);
         return;
        }

        console.log("Order ID:", data);
        alert("Your order has been created successfully!");
    };

  return (
    <div className="mt-20 min-h-screen bg-[#F7F5F0] px-5 py-10 md:px-12 lg:px-20">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-stone-300 pb-5">
        <Link to="/cart" className="text-xs tracking-widest text-stone-500 hover:text-black">
          ← BACK TO BAG
        </Link>

        <p className="text-[10px] tracking-[3px] text-stone-500">
          SAUDI / 02
        </p>
      </div>

      {/* TITLE */}
      <div className="py-12 md:py-16">
        <p className="mb-4 text-[10px] tracking-[4px] text-[#A39585]">
          COMPLETE YOUR PURCHASE
        </p>

        <h1 className="font-serif text-5xl tracking-tight md:text-8xl">
          CHECKOUT<span className="text-[#A39585]">.</span>
        </h1>

        <p className="mt-5 max-w-sm text-sm leading-7 text-stone-500">
          A few final details before your selected pieces are on their way to you.
        </p>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.3fr_0.8fr]">

        {/* SHIPPING FORM */}
        <div>
          <div className="mb-10 flex items-center justify-between border-b border-stone-300 pb-5">
            <h2 className="font-serif text-2xl">Shipping Details</h2>
            <span className="text-xs tracking-widest text-[#A39585]">01 / 02</span>
          </div>

          <form 
          className="grid grid-cols-1 gap-x-10 gap-y-9 md:grid-cols-2"
          id="checkoute-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleOrder();
          }}
          >

            <div className="flex flex-col gap-2">
              <label htmlFor="fullname" className={labelClass}>Full Name</label>

              <input id="fullname"
              type="text"
              placeholder="Your full name" 
              className={inputClass} 
              value={formData.fullname}
              onChange={(e)=>setFormData({...formData,fullname:e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="number" className={labelClass}>Phone Number</label>
              <input
               id="number"
               type="tel"
               placeholder="Your phone number"
               className={inputClass} 
               value={formData.phone}
               onChange={(e)=>{
                const value = e.target.value ;
               if (/^\d{0,11}$/.test(value)) {
                  setFormData({...formData,phone:value})
                }
               
               }}
               />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="covernorate" className={labelClass}>Governorate</label>
              <input 
              id="covernorate"
              type="text" placeholder="Governorate"
              className={inputClass} 
              value={formData.governorate}
              onChange={(e)=>setFormData({...formData,governorate:e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="city" className={labelClass}>City</label>
              <input 
              id="city" 
              type="text" 
              placeholder="Your city" 
              className={inputClass} 
              value={formData.city}
              onChange={(e)=>setFormData({...formData,city:e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="address" className={labelClass}>Full Address</label>
              <input 
              id="address" 
              type="text" 
              placeholder="Street, building, apartment..." 
              className={inputClass} 
              value={formData.address}
              onChange={(e)=>setFormData({...formData,address:e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-4 md:col-span-2">
                <h3 className={labelClass}>Payment Method</h3>

                <label className="flex items-center gap-3 border border-stone-300 p-4 cursor-pointer">
                    <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}  
                    />

                    <span className="text-sm">Cash on Delivery</span>
                </label>
            </div>

          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="h-fit bg-[#EAE5DC] p-6 md:p-9">

          <div className="mb-8 flex items-center justify-between border-b border-stone-400/50 pb-5">
            <h2 className="font-serif text-2xl">Your Selection</h2>
            <span className="text-[10px] tracking-widest text-stone-500">
              {cartItems.length} ITEMS
            </span>
          </div>

          <div className="flex flex-col gap-7">
            {cartItems.map((item) => (
              <div key={item.variantId} className="flex gap-4">

                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-28 w-24 object-cover bg-[#F7F5F0]"
                />

                <div className="flex flex-1 flex-col justify-between py-1">

                  <div>
                    <h3 className="font-serif text-base">{item.name}</h3>
                    <p className="mt-1 text-xs text-stone-500">
                      Size: {item.size}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {item.price} EGP
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.variantId)}
                      aria-label="Decrease quantity"
                      className="text-stone-500 transition hover:text-black"
                    >
                      <FaMinus size={9} />
                    </button>

                    <span className="text-xs tabular-nums">{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.variantId)}
                      aria-label="Increase quantity"
                      className="text-stone-500 transition hover:text-black"
                    >
                      <FaPlus size={9} />
                    </button>
                  </div>

                </div>

                <p className="pt-1 text-xs font-medium">
                  {item.price * item.quantity} EGP
                </p>

              </div>
            ))}
          </div>

          {/* TOTALS */}
          <div className="mt-10 flex flex-col gap-4 border-t border-stone-400/50 pt-6 text-sm">

            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span>{subtotal} EGP</span>
            </div>

            <div className="flex justify-between text-stone-500">
              <span>Delivery</span>
              <span>{shipping} EGP</span>
            </div>

            <div className="mt-2 flex justify-between border-t border-stone-400/50 pt-5">
              <span className="font-serif text-xl">Total</span>
              <span className="text-lg font-medium">{total} EGP</span>
            </div>

            <div className="flex justify-between text-stone-500">
            <span>Payment</span>
            <span>Cash on Delivery</span>
            </div>

          </div>

          <button
            type="submit"
            form="checkoute-form"
            className="mt-8 w-full bg-[#211F1C] py-5 text-xs tracking-[3px] text-white transition hover:bg-[#A39585]"
          >
            PLACE YOUR ORDER
          </button>

          <p className="mt-4 text-center text-[10px] tracking-wider text-stone-500">
            THANK YOU FOR CHOOSING SAUDI
          </p>

        </div>
      </div>
    </div>
  );
}
