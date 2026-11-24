
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";

import {
  LoaderCircle,
  Package,
  CalendarDays,
  UserRound,
  Search,
  XCircle,
  ShoppingBag,
  Hash,
  Phone,
  ArrowRight,
} from "lucide-react";


export default function MyOrders() {
  const { user, loading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [orderId, setOrderId] = useState(() =>
    localStorage.getItem("guestOrderId") || ""
  );

  const [phone, setPhone] = useState("");
  const [guestOrder, setGuestOrder] = useState(null);
  const [error, setError] = useState("");


  // Status Colors
  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      processing: "bg-purple-50 text-purple-700 border-purple-200",
      shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
      delivered: "bg-green-50 text-green-700 border-green-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };

    return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };


  // Guest Order Tracking
  const trackOrder = async (e) => {
    e.preventDefault();

    setOrdersLoading(true);
    setError("");
    setGuestOrder(null);

    try {
      const { data, error } = await supabase.rpc("get_order", {
        p_order_id: orderId.trim(),
        p_phone: phone.trim(),
      });

      if (error) throw error;

      if (!data) {
        throw new Error("Order not found");
      }

      setGuestOrder(data);

    } catch (err) {
      setGuestOrder(null);
      setError("Order not found. Please check your details.");

    } finally {
      setOrdersLoading(false);
    }
  };


  // Logged-in User Orders
  useEffect(() => {
    async function getOrders() {
      if (!user) {
        setOrders([]);
        setOrdersLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (
              *,
              product_variants (
                products (*),
                sizes (name)
              )
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setOrders(data || []);

      } catch (err) {
        console.log(err);

      } finally {
        setOrdersLoading(false);
      }
    }

    getOrders();
  }, [user]);


  // Cancel Order
  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    const { error } = await supabase.rpc("cancel_order", {
      p_order_id: orderId,
    });

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


  // Clear Guest Tracking
  const clearTracking = () => {
    setGuestOrder(null);
    setError("");
    setOrderId("");
    setPhone("");
    localStorage.removeItem("guestOrderId");
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0]">
        <LoaderCircle className="h-9 w-9 animate-spin text-[#A39585]" />
      </div>
    );
  }


  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#292722] px-4 sm:px-6 lg:px-8 pt-28 pb-16">

      <div className="mx-auto max-w-6xl">

        {/* Page Header */}

        <div className="mb-10 sm:mb-12">

          <p className="mb-3 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A39585]">
            SAUDI / CUSTOMER SERVICE
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl">
            {user ? "My Orders" : "Track Your Order"}
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-[#737373]">
            {user
              ? "Keep track of your purchases and manage your orders."
              : "Enter your order details to view your purchase information and delivery status."}
          </p>

        </div>


        {/* Logged In User */}

        {user ? (

          <div className="space-y-6">

            {ordersLoading ? (

              <div className="flex justify-center py-20">
                <LoaderCircle className="h-9 w-9 animate-spin text-[#A39585]" />
              </div>

            ) : orders.length === 0 ? (

              <div className="rounded-xl border border-[#E7E2D9] bg-white px-5 py-16 text-center">

                <ShoppingBag className="mx-auto mb-5 h-10 w-10 text-[#A39585]" />

                <h2 className="font-serif text-xl sm:text-2xl">
                  No Orders Yet
                </h2>

                <p className="mt-3 text-sm text-[#737373]">
                  Your orders will appear here once you make a purchase.
                </p>

              </div>

            ) : (

              orders.map((order) => (

                <div
                  key={order.id}
                  className="overflow-hidden rounded-xl border border-[#E7E2D9] bg-white shadow-sm"
                >

                  {/* Order Header */}

                  <div className="border-b border-[#E7E2D9] p-4 sm:p-6">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="min-w-0">

                        <p className="mb-2 text-[10px] tracking-[0.2em] text-[#A39585]">
                          ORDER NUMBER
                        </p>

                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 shrink-0 text-[#A39585]" />

                          <p className="break-all text-xs sm:text-sm font-medium">
                            {order.id}
                          </p>
                        </div>

                      </div>


                      <span
                        className={`w-fit rounded-full border px-3 py-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-wider ${getStatusStyle(order.status)}`}
                      >
                        {order.status}
                      </span>

                    </div>

                  </div>


                  {/* Order Information */}

                  <div className="grid grid-cols-2 gap-5 border-b border-[#E7E2D9] p-4 sm:grid-cols-3 sm:p-6">

                    <div>

                      <div className="mb-2 flex items-center gap-2 text-[#A39585]">
                        <CalendarDays size={15} />
                        <span className="text-[10px] tracking-wider uppercase">
                          Order Date
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-medium">
                        {new Date(order.created_at).toLocaleDateString("en-GB")}
                      </p>

                    </div>


                    <div>

                      <div className="mb-2 flex items-center gap-2 text-[#A39585]">
                        <UserRound size={15} />
                        <span className="text-[10px] tracking-wider uppercase">
                          Customer
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-medium break-words">
                        {order.full_name}
                      </p>

                    </div>


                    <div className="col-span-2 sm:col-span-1">

                      <div className="mb-2 flex items-center gap-2 text-[#A39585]">
                        <ShoppingBag size={15} />
                        <span className="text-[10px] tracking-wider uppercase">
                          Total Amount
                        </span>
                      </div>

                      <p className="text-sm sm:text-base font-semibold">
                        {order.total} EGP
                      </p>

                    </div>

                  </div>


                  {/* Order Items */}

                  <div className="p-4 sm:p-6">

                    <div className="mb-5 flex items-center gap-2">

                      <Package size={17} className="text-[#A39585]" />

                      <h3 className="text-xs font-medium tracking-[0.15em] uppercase">
                        Order Items
                      </h3>

                    </div>


                    <div className="space-y-5">

                      {(order.order_items || []).map((item) => (

                        <div
                          key={item.id}
                          className="flex items-center gap-3 sm:gap-5"
                        >

                          <img
                            src={item.product_variants?.products?.image_url}
                            alt={item.product_variants?.products?.name}
                            className="h-20 w-16 shrink-0 rounded-md bg-[#F7F5F0] object-cover sm:h-24 sm:w-20"
                          />


                          <div className="min-w-0 flex-1">

                            <p className="text-xs sm:text-sm font-medium leading-5">
                              {item.product_variants?.products?.name}
                            </p>

                            <p className="mt-2 text-[11px] sm:text-xs text-[#737373]">
                              Size: {item.product_variants?.sizes?.name || "N/A"}
                            </p>

                            <p className="mt-1 text-[11px] sm:text-xs text-[#737373]">
                              Quantity: {item.quantity}
                            </p>

                          </div>


                          <p className="shrink-0 text-xs sm:text-sm font-medium">
                            {item.price * item.quantity} EGP
                          </p>

                        </div>

                      ))}

                    </div>

                  </div>


                  {/* Cancel Button */}

                  {order.status === "pending" && (

                    <div className="border-t border-[#E7E2D9] bg-[#FAF9F6] px-4 py-4 sm:px-6">

                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="flex w-full items-center justify-center gap-2 border border-red-200 px-5 py-3 text-xs font-medium tracking-wider text-red-700 transition hover:bg-red-700 hover:text-white sm:w-fit"
                      >
                        <XCircle size={15} />
                        CANCEL ORDER
                      </button>

                    </div>

                  )}

                </div>

              ))

            )}

          </div>


        ) : (


          /* Guest Tracking */

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5 lg:gap-8">


            {/* Tracking Form */}

            <div className="rounded-xl border border-[#E7E2D9] bg-white p-5 sm:p-7 lg:col-span-2">

              <div className="mb-7">

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#F7F5F0]">
                  <Package size={20} className="text-[#A39585]" />
                </div>

                <h2 className="font-serif text-2xl">
                  Track Your Order
                </h2>

                <p className="mt-2 text-xs leading-5 text-[#737373]">
                  Enter your order number and phone number used during checkout.
                </p>

              </div>


              <form onSubmit={trackOrder} className="space-y-5">

                <div>

                  <label className="mb-2 flex items-center gap-2 text-xs font-medium">
                    <Hash size={14} className="text-[#A39585]" />
                    Order ID
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                    className="w-full rounded-md border border-[#E7E2D9] bg-[#FAF9F6] px-4 py-3.5 text-sm outline-none transition focus:border-[#A39585]"
                  />

                </div>


                <div>

                  <label className="mb-2 flex items-center gap-2 text-xs font-medium">
                    <Phone size={14} className="text-[#A39585]" />
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full rounded-md border border-[#E7E2D9] bg-[#FAF9F6] px-4 py-3.5 text-sm outline-none transition focus:border-[#A39585]"
                  />

                </div>


                {error && (
                  <p className="rounded-md bg-red-50 p-3 text-xs text-red-600">
                    {error}
                  </p>
                )}


                <button
                  type="submit"
                  disabled={ordersLoading}
                  className="flex w-full items-center justify-center gap-2 bg-[#292722] py-4 text-xs font-medium tracking-[0.15em] text-white transition hover:bg-[#44413A] disabled:opacity-50"
                >

                  {ordersLoading ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Search size={16} />
                  )}

                  {ordersLoading ? "TRACKING..." : "TRACK ORDER"}

                </button>

              </form>


              <button
                type="button"
                onClick={clearTracking}
                className="mt-5 text-xs text-[#737373] underline underline-offset-4 transition hover:text-[#292722]"
              >
                Clear details
              </button>

            </div>


            {/* Guest Order Result */}

            {guestOrder ? (

              <div className="overflow-hidden rounded-xl border border-[#E7E2D9] bg-white lg:col-span-3">

                {/* Result Header */}

                <div className="border-b border-[#E7E2D9] p-5 sm:p-7">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="min-w-0">

                      <p className="mb-2 text-[10px] tracking-[0.2em] text-[#A39585]">
                        ORDER NUMBER
                      </p>

                      <p className="break-all text-xs sm:text-sm font-medium">
                        {guestOrder.id}
                      </p>

                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase ${getStatusStyle(guestOrder.status)}`}
                    >
                      {guestOrder.status}
                    </span>

                  </div>

                </div>


                {/* Customer Details */}

                <div className="grid grid-cols-2 gap-5 border-b border-[#E7E2D9] p-5 sm:p-7">

                  <div>

                    <p className="mb-2 text-[10px] tracking-wider text-[#A39585]">
                      CUSTOMER
                    </p>

                    <p className="text-xs sm:text-sm font-medium break-words">
                      {guestOrder.full_name}
                    </p>

                  </div>


                  <div>

                    <p className="mb-2 text-[10px] tracking-wider text-[#A39585]">
                      TOTAL AMOUNT
                    </p>

                    <p className="text-sm font-semibold">
                      {guestOrder.total} EGP
                    </p>

                  </div>

                </div>


                {/* Guest Items */}

                <div className="p-5 sm:p-7">

                  <div className="mb-5 flex items-center gap-2">

                    <Package size={17} className="text-[#A39585]" />

                    <h3 className="text-xs font-medium tracking-[0.15em] uppercase">
                      Order Items
                    </h3>

                  </div>


                  <div className="divide-y divide-[#E7E2D9]">

                    {(guestOrder.items || []).map((item, index) => (

                      <div
                        key={index}
                        className="flex items-center justify-between gap-3 py-4 text-sm"
                      >

                        <div className="min-w-0">

                          <p className="text-xs sm:text-sm font-medium">
                            {item.product_name}
                          </p>

                          <p className="mt-2 text-[11px] text-[#737373]">
                            Size: {item.size} · Qty: {item.quantity}
                          </p>

                        </div>

                        <p className="shrink-0 text-xs sm:text-sm font-medium">
                          {item.price} EGP
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            ) : (

              <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-[#D9D1C6] bg-white/50 p-6 text-center lg:col-span-3">

                <div>

                  <Package className="mx-auto mb-4 h-9 w-9 text-[#C4B8A8]" />

                  <h3 className="font-serif text-xl">
                    Your Order Details
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#737373]">
                    Your order information will appear here after tracking.
                  </p>

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </main>
  );
}
