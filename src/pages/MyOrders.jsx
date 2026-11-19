
import { useAuth } from "../context/AuthContext";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {supabase} from "../supabase";



export default function MyOrders() {
  const { user, loading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);



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
        .select('*')
        .eq('user_id', user.id)
        .order('created_at' ,{ascending:true})

        console.log("User ID:", user.id);
        console.log("Orders Data:", data);
        console.log("Orders Count:", data?.length);

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

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-6 py-16 text-[#292722] mt-10">
      <div className="mx-auto max-w-5xl">

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
                        {order.status}
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
                </div>

                </div>
            ))
            )}

          </div>
         ) : (
          <div>
            
            <div className="max-w-md rounded-xl border border-[#E7E2D9] bg-white p-6">

            <h2 className="mb-6 text-lg font-medium">
                Track Your Order
            </h2>

            <form className="space-y-5">

                <div>
                <label className="mb-2 block text-sm">
                    Order ID
                </label>

                <input
                    type="text"
                    placeholder="Enter your order ID"
                    className="w-full rounded-md border border-[#E7E2D9] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#A39585]"
                />
                </div>

                <div>
                <label className="mb-2 block text-sm">
                    Phone Number
                </label>

                <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full rounded-md border border-[#E7E2D9] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#A39585]"
                />
                </div>

                <button
                type="submit"
                className="w-full bg-[#292722] py-3 text-sm text-white transition hover:bg-[#44413A]"
                >
                TRACK ORDER
                </button>

            </form>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
