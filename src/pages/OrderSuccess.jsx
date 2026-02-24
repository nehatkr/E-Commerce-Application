import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PAYMENT_URL = "http://localhost:8081";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          setError("OrderId missing in URL.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${PAYMENT_URL}/api/orders/${orderId}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch order");
        }

        const data = await res.json();
        console.log("ORDER DATA:", data); // ✅ check in console
        setOrder(data);
      } catch (e) {
        setError(e.message || "Unable to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="mt-2">{error}</p>
        <button className="mt-4 px-4 py-2 border rounded" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  return (
  <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
    <div className="w-full max-w-2xl bg-white border rounded-xl shadow-md p-8">
      <h1 className="text-2xl font-bold text-center">
        ✅ Order Placed Successfully
      </h1>

      <p className="text-gray-600 text-center mt-2">
        Your order has been placed. We will deliver it soon.
      </p>

      <hr className="my-6" />

      <div className="space-y-3 text-sm">
        <p><b>Order ID:</b> {order.orderId}</p>
        <p><b>Name:</b> {order.name}</p>
        <p><b>Email:</b> {order.email}</p>
        <p><b>Amount:</b> ₹{order.amount}</p>
        <p><b>Payment Mode:</b> {order.paymentMode}</p>
        <p><b>Status:</b> {order.orderStatus}</p>
        <p>
          <b>Estimated Delivery Date:</b>{" "}
          <span className="px-2 py-1 bg-gray-100 rounded">
            {order.estimatedDeliveryDate}
          </span>
        </p>
      </div>
<div className="mt-8 flex justify-center">
  <button
    className="px-6 py-2 bg-black text-white rounded-md hover:opacity-90"
    onClick={() => navigate("/products")}
  >
    Continue Shopping
  </button>
</div>
    </div>
  </div>
);
};

export default OrderSuccess;