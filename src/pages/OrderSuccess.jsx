
import { Link, useParams ,useLocation } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function OrderSuccess() {
  const { orderId } = useParams();

  const { state } = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const getOrder = async () => {
    try {
      setLoading(true);
      setError("");
      setOrder(null);

      // نتأكد إن رقم الطلب هو آخر طلب محفوظ
      const savedOrderId = localStorage.getItem("guestOrderId");

      if (savedOrderId !== orderId) {
        throw new Error("Order information not found.");
      }

      // نقرأ الهاتف من التنقل، ولو مش موجود نقرأه من sessionStorage
      const phone =
        state?.phone || sessionStorage.getItem("guestOrderPhone");

      if (!phone) {
        throw new Error("Phone number not found. Please contact customer service.");
      }

      // نجيب تفاصيل الطلب الموجود من Supabase
      const { data, error } = await supabase.rpc("get_order", {
        p_order_id: orderId,
        p_phone: phone.trim(),
      });

      if (error) throw error;

      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  getOrder();
}, [orderId, state?.phone]);


  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#292722] mt-20">

      {/* Header */}
      <header className="border-b border-[#E7E2D9] px-6 py-5 text-center">
        <Link to="/" className="font-serif text-2xl tracking-[0.25em]">
          SAUDI
        </Link>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-14 md:py-20">

        {/* Success */}
        <div className="mb-14 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7E2D9]">
            <FaCheck className="text-lg text-[#827565]" />
          </div>

          <p className="mb-3 text-[10px] tracking-[0.3em] text-[#A39585]">
            ORDER CONFIRMED
          </p>

          <h1 className="font-serif text-4xl md:text-5xl">
            Thank You.
          </h1>

          <p className="mt-4 text-sm text-[#737373]">
            Your order has been placed successfully.
          </p>
        </div>

        {/* Order Content */}
        <div className="border border-[#E7E2D9] bg-[#FBFAF7]">
          <div className="flex flex-col gap-4 border-b border-[#E7E2D9] p-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-serif text-xl">Order Summary</h2>

            {order && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#A39585]">YOUR ORDER ID</p>
                  <p className="mt-2 break-all text-sm font-medium">
                    {order.id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(order.id);
                      alert("Order ID copied successfully");
                    } catch {
                      alert("Unable to copy Order ID. Please copy it manually.");
                    }
                  }}
                  className="border border-[#DCD5CA] px-4 py-2 text-xs tracking-wider transition hover:bg-[#E7E2D9]"
                >
                  COPY ORDER ID
                </button>

                <div className="border-t border-[#E7E2D9] pt-3">
                  <p className="text-xs font-medium text-[#827565]">
                    IMPORTANT — KEEP YOUR ORDER ID
                  </p>

                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#737373]">
                    Please save your Order ID. You will need it along with your
                    phone number to track your order later.
                  </p>

                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#737373]">
                    Lost your Order ID? Don't worry. Contact our customer
                    service team and provide your phone number to retrieve it.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">

            {loading ? (
              <p className="py-12 text-center text-sm text-stone-500">
                Loading your order...
              </p>
            ) : error ? (
              <p className="py-12 text-center text-sm text-red-600">
                {error}
              </p>
            ) : order ? (
              <div className="space-y-9">

                {/* Customer Details */}
                <div>
                  <h3 className="mb-5 text-xs tracking-[0.2em] text-[#A39585]">
                    CUSTOMER DETAILS
                  </h3>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs text-stone-500">Name</p>
                      <p className="text-sm">{order.full_name}</p>
                    </div>

                    <div>
                      <p className="mb-1 text-xs text-stone-500">Phone</p>
                      <p className="text-sm">{order.phone}</p>
                    </div>

                    <div>
                      <p className="mb-1 text-xs text-stone-500">City</p>
                      <p className="text-sm">{order.city}</p>
                    </div>

                    <div>
                      <p className="mb-1 text-xs text-stone-500">Payment</p>
                      <p className="text-sm">
                        {order.payment_method === "cod"
                          ? "Cash on Delivery"
                          : order.payment_method}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="mb-1 text-xs text-stone-500">Address</p>
                      <p className="text-sm">{order.address}</p>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="border-t border-[#E7E2D9] pt-7">
                  <h3 className="mb-5 text-xs tracking-[0.2em] text-[#A39585]">
                    YOUR ITEMS ({order.items.length})
                  </h3>

                  <div className="space-y-5">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 border-b border-[#E7E2D9] pb-5 last:border-0 last:pb-0"
                      >
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="h-28 w-24 bg-[#EAE5DC] object-cover"
                        />

                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                          <h4 className="font-serif text-base">
                            {item.product_name}
                          </h4>

                          <p className="mt-2 text-xs text-stone-500">
                            Size: {item.size}
                          </p>

                          <p className="mt-1 text-xs text-stone-500">
                            Qty: {item.quantity}
                          </p>

                          <p className="mt-2 text-xs">
                            {item.price} EGP / piece
                          </p>
                        </div>

                        <p className="self-center text-sm font-medium whitespace-nowrap">
                          {item.price * item.quantity} EGP
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-[#E7E2D9] pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-stone-500">
                      <span>Subtotal</span>
                      <span>{order.subtotal} EGP</span>
                    </div>

                    <div className="flex justify-between text-stone-500">
                      <span>Delivery</span>
                      <span>{order.shipping} EGP</span>
                    </div>

                    <div className="flex justify-between border-t border-[#E7E2D9] pt-5">
                      <span className="font-serif text-lg">Total</span>
                      <span className="text-lg font-medium">
                        {order.total} EGP
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ) : null}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/products"
            className="flex-1 bg-[#292722] px-8 py-4 text-center text-xs tracking-[0.15em] text-white transition hover:bg-[#A39585]"
          >
            CONTINUE SHOPPING
          </Link>

          <Link
            to="/"
            className="flex-1 border border-[#DCD5CA] px-8 py-4 text-center text-xs tracking-[0.15em] transition hover:bg-[#E7E2D9]"
          >
            BACK TO HOME
          </Link>
        </div>

      </section>

      <footer className="border-t border-[#E7E2D9] py-6 text-center">
        <p className="text-[10px] tracking-[0.2em] text-[#A39585]">
          SAUDI — ELEVATE YOUR STYLE
        </p>
      </footer>

    </main>
  );
}
