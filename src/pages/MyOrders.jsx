
import { useAuth } from "../context/AuthContext";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {supabase} from "../supabase";



export default function MyOrders() {
  const { user, loading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);


  const [orderId, setOrderId] = useState(()=>
    localStorage.getItem("guestOrderId") || ""
  );
  const [phone, setPhone] = useState("");
  const [guestOrder, setGuestOrder] = useState(null);
  const [error, setError] = useState("");

// جلب اوردر الزائر
  const trackOrder = async (e) => {
  e.preventDefault();

  setOrdersLoading(true);
  setError("");

  try {
    const { data, error } = await supabase.rpc("get_order", {
      p_order_id: orderId.trim(),
      p_phone: phone.trim(),
    });

    if (error) throw error;

    setGuestOrder(data);

  } catch (err) {
    setGuestOrder(null);
    setError("Order not found. Please check your details.");

  } finally {
    setOrdersLoading(false);
  }
  };


// جلب اوردر اليوزر
  useEffect(()=>{

    async function getOrders () {

        if(!user){
            setOrders([]);
            setOrdersLoading(false);
            return;
            
        }

        try{

        

        const {data , error} = await supabase
        .from('orders')
        .select(`
        *,
        order_items (*,
            
            product_variants (
            products (*),
            sizes (name)
            )
        )
        `)
            
        .eq('user_id', user.id)
        .order('created_at' ,{ascending:true})

        if(error){
            throw error;
        }

        setOrders(data);

        }catch(err){
            console.log(err)
        }finally{

            setOrdersLoading(false);
        }
        
    }

    getOrders();
  },[user])


  if (loading) {
  return (
    <LoaderCircle className="h-10 w-10 animate-spin" />
  );
  }

const handleCancelOrder = async (orderId) => {
  const confirmed = window.confirm("Are you sure you want to cancel this order?");

  if (!confirmed) return;

  console.log("Cancel clicked:", orderId);

  const { data, error } = await supabase.rpc("cancel_order", {
    p_order_id: orderId,
  });

  console.log("RPC data:", data);
  console.log("RPC error:", error);

  if (error) {
    alert(error.message);
    return;
  }

  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === orderId
        ? { ...order, status: "cancelled" }
        : order
    )
  );

  alert("Order cancelled successfully");
};

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-6 py-8 text-[#292722] mt-12">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-2 font-serif text-3xl">
          {user ? "My Orders" : "Track Your Order"}
        </h1>

        <p className="mb-10 text-sm text-[#737373]">
          {user
            ? "View and manage your orders."
            : "Enter your order details to track your purchase."}
        </p>

        {user ? (
          <div className="space-y-4">

            {ordersLoading ? (
            <LoaderCircle className="h-8 w-8 animate-spin" />
            ) : orders.length === 0 ? (
            <p className="text-sm text-[#737373]">
                You haven't placed any orders yet.
            </p>
            ) : (
            orders.map((order) => (
                <div
                key={order.id}
                className="rounded-xl border border-[#E7E2D9] bg-white p-6"
                >
                <div className="flex flex-wrap justify-between gap-4">

                    <div>

                    <p className="text-xs text-[#737373]">
                        ORDER ID
                    </p>

                    <p className="mt-1 text-sm font-medium">
                        {order.id}
                    </p>

                    </div>

                    <div>
                    <p className="text-xs text-[#737373]">
                        STATUS
                    </p>

                    <p className="mt-1 text-sm font-medium uppercase">
                        {order.status === 'cancelled' ? <p className="text-red-600">cancelled</p>:
                        <p className="text-green-600">{order.status}</p>}
                    </p>

                    <p className="mt-1 text-sm font-medium uppercase">
                        {order.full_name}
                    </p>
                    </div>

                    <div>
                    <p className="text-xs text-[#737373]">
                        TOTAL
                    </p>

                    <p className="mt-1 text-sm font-medium">
                        {order.total} EGP
                    </p>
                    </div>

                </div>

                <div className="mt-5 border-t border-[#E7E2D9] pt-4">
                    <p className="text-xs text-[#737373]">
                     ORDER DATE
                    </p>

                    <p className="mt-1 text-sm">
                     {new Date(order.created_at).toLocaleDateString("en-GB")}
                    </p>

                    <div className="mt-5 border-t border-[#E7E2D9] pt-4">

                    <p className="mb-3 text-xs text-[#737373]">
                        ORDER ITEMS
                    </p>

                    <div className="space-y-4">

                        {(order.order_items || []).map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between gap-4 text-sm"
                        >
                            <div>
                                <img
                                className="w-16 h-16 object-cover rounded-md"
                                 src={item.product_variants?.products?.image_url}
                                 alt={item.product_variants?.products?.name} />
                                <p className="font-medium">
                                    {item.product_variants?.products?.name}
                                </p>

                                <p className="mt-1 text-xs text-[#737373]">
                                    Size: {item.product_variants?.sizes?.name} · Qty: {item.quantity}
                                </p>
                            </div>

                            <p className="whitespace-nowrap">
                            {item.price * item.quantity} EGP
                            </p>
                        </div>
                        ))}

                    </div>

                    </div>

                        {order.status === "pending" && (
                         <div className="mt-6 border-t border-[#E7E2D9] pt-4">
                            <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="border border-red-700 px-5 py-2 text-sm text-red-700
                             transition hover:bg-red-700 hover:text-white"
                            >
                            CANCEL ORDER
                            </button>
                         </div>
                        )}
                </div>

                </div>
            ))
            )}

          </div>
        ) : (

          <div className="flex gap-10 w-full">
            
            <div 
            className="
            rounded-xl border border-[#E7E2D9] bg-white p-6 w-[40%]
            "
            >

                <div>
                    <h2 className="mb-6 text-lg font-medium">
                    Track Your Order
                    </h2>

                 <form onSubmit={trackOrder} className="space-y-5">

                    <div>
                    <label className="mb-2 block text-sm">
                        Order ID
                    </label>

                    <input
                    type="text"
                    placeholder="Enter your order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                    className="w-full rounded-md border 
                    border-[#E7E2D9] bg-transparent px-4 py-3 text-sm 
                    outline-none focus:border-[#A39585]"
                    />
                    </div>

                    <div>
                    <label className="mb-2 block text-sm">
                        Phone Number
                    </label>

                    <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full rounded-md border 
                    border-[#E7E2D9] bg-transparent px-4 py-3 text-sm 
                    outline-none focus:border-[#A39585]"
                    />
                    </div>

                    {error && (
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                    )}

                    <button
                    type="submit"
                    disabled={ordersLoading}
                    className="w-full bg-[#292722] py-3 text-sm text-white transition hover:bg-[#44413A] disabled:opacity-50"
                    >
                    {ordersLoading ? "TRACKING..." : "TRACK ORDER"}
                    </button>

                 </form>

                 <button
                  type="button"
                  onClick={() => {
               
                
                  setGuestOrder(null);
                  setError("");
                  localStorage.removeItem("guestOrderId");
                  }}
                  className="mt-4 text-xs text-[#737373] underline"
                  >
                  Clear
                  </button>
                </div>

            </div>

            {guestOrder && (
                <div className="rounded-xl border border-[#E7E2D9] bg-white p-6 w-[50%]">

                    <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs text-[#737373]">ORDER ID</p>
                        <p className="mt-1 text-sm">{guestOrder.id}</p>
                    </div>

                    <p className="text-sm font-medium uppercase bg-green-600/30 px-2 py-1 rounded-full">
                        {guestOrder.status}
                    </p>
                    </div>

                    <div className="mt-6 border-t border-[#E7E2D9] pt-5">

                    <p className="text-xs text-[#737373]">CUSTOMER</p>
                    <p className="mt-1 text-sm">{guestOrder.full_name}</p>

                    <p className="mt-4 text-xs text-[#737373]">TOTAL</p>
                    <p className="mt-1 text-sm font-medium">
                        {guestOrder.total} EGP
                    </p>

                    </div>

                    <div className="mt-6 border-t border-[#E7E2D9] pt-5">

                    <h3 className="mb-4 text-sm font-medium">ORDER ITEMS</h3>

                    {guestOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between gap-4 py-3 text-sm">

                        <div>
                            <p>{item.product_name}</p>
                            <p className="mt-1 text-xs text-[#737373]">
                            Size: {item.size} · Qty: {item.quantity}
                            </p>
                        </div>

                        <p>{item.price} EGP</p>

                        </div>
                    ))}

                    </div>

                </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
