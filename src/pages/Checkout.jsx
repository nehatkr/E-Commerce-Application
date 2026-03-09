import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const PRODUCT_URL = "http://localhost:8080"; // product backend
  const PAYMENT_URL = "http://localhost:8081"; // payment gateway backend
  const RAZORPAY_KEY = "rzp_test_RtVxX2GgS4LcYd";

  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items || []);
  const user = useSelector((state) => state.auth.user);

  // ===== Helpers =====
  const makeFullUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${PRODUCT_URL}${url}`;
  };

  const getImage = (item) => {
    const raw =
      item.image?.[0]?.imageUrl ||
      item.image_url ||
      item.imageUrl ||
      item.image ||
      item.thumbnail ||
      item.img ||
      "";

    const full = makeFullUrl(raw);
    return full || "https://via.placeholder.com/60";
  };

  const getPrice = (item) => {
    const raw =
      item.price ??
      item.discountPrice ??
      item.discountedPrice ??
      item.productPrice ??
      item.sellingPrice ??
      item.unitPrice ??
      item.mrp ??
      item.amount ??
      item.cost ??
      item?.product?.price ??
      item?.product?.sellingPrice ??
      item?.product?.productPrice ??
      item?.product?.mrp ??
      0;

    return Number(String(raw).replace(/[^\d.]/g, "")) || 0;
  };

  const getQty = (item) => Number(item.quantity) || 1;

  const computedTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + getPrice(item) * getQty(item), 0);
  }, [items]);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // ===== Form =====
  const [form, setForm] = useState({
    fullName: user?.firstName
      ? `${user.firstName} ${user?.lastName || ""}`.trim()
      : "",
    email: user?.email || "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({});

  // ===== Payment modal state =====
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(""); // "ONLINE" | "COD"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";

    if (form.phone && !/^\d{10}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter 10 digit phone number";
    }
    if (form.pincode && !/^\d{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = "Enter 6 digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Step 1: Proceed to Pay button click -> validate first -> open modal
  const handleProceedToPay = () => {
    if (!items.length) {
      alert("Your cart is empty.");
      return;
    }
    if (!validate()) return;

    setSelectedMethod("");
    setShowPaymentModal(true);
  };

  // ✅ COD action -> call backend -> redirect to success page
  const confirmCOD = async () => {
    try {
      setShowPaymentModal(false);

      const res = await fetch(`${PAYMENT_URL}/createCodOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          name: form.fullName,
          email: form.email,
          amount: computedTotal,

          productId: items[0]?.id || items[0]?.product?.id,
          vendorId: items[0]?.product?.vendorId || items[0]?.vendorId,
          quantity: items[0]?.quantity || 1
        }),
      });

      if (!res.ok) {
        alert("COD order creation failed ❌");
        return;
      }

      const order = await res.json();



      // ✅ Redirect to success page
      window.location.href = `/order-success?orderId=${order.orderId}`;
    } catch (e) {
      console.error(e);

    }
  };

  // ✅ Online payment action -> create order -> open Razorpay -> callback -> redirect
  const proceedOnlinePayment = async () => {
    try {
      setShowPaymentModal(false);

      const ok = await loadRazorpay();
      if (!ok) {
        alert("Razorpay SDK failed to load");
        return;
      }

      // A) Create order from Spring Boot paymentgateway
      const res = await fetch(`${PAYMENT_URL}/createOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          name: form.fullName,
          email: form.email,
          amount: computedTotal,

          productId: items[0]?.id,
          vendorId: items[0]?.product?.vendorId || items[0]?.vendorId,
          quantity: items[0]?.quantity || 1
        }),
      });

      if (!res.ok) {
        alert("createOrder failed ❌");
        return;
      }

      const order = await res.json(); // has razorpayOrderId, orderId, amount, etc.

      // B) Open Razorpay popup
      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount * 100, // paise
        currency: "INR",
        name: "NovaShop",
        description: "Order Payment",
        order_id: order.razorpayOrderId, // field from backend

        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },

        handler: async function (response) {
          try {
            // C) Call paymentCallback after payment success
            const params = new URLSearchParams();
            params.append("razorpay_order_id", response.razorpay_order_id);
            params.append("razorpay_payment_id", response.razorpay_payment_id);
            params.append("razorpay_signature", response.razorpay_signature);

            const cbRes = await fetch(`${PAYMENT_URL}/paymentCallback`, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: params.toString(),
            });

            if (!cbRes.ok) {
              alert("paymentCallback failed ❌");
              return;
            }

            const cbData = await cbRes.json();
            console.log("Callback:", cbData);


            window.location.href = `/order-success?orderId=${cbData.orderId}`;
          } catch (err) {
            console.error(err);
            alert("Payment verification failed ❌");
          }
        },

        modal: {
          ondismiss: () => alert("Payment cancelled ❌"),
        },

        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error(e);
      alert("Online payment failed ❌");
    }
  };

  if (!items.length) {
    return (
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">
            Your cart is empty. Please add items first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Customer Information */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Customer Information
            </h2>
            <hr className="mb-5" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="10 digit number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="6 digit pincode"
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pincode}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                  rows={3}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <hr className="mb-5" />

            <div className="space-y-4">
              {items.map((item) => {
                const img = getImage(item);
                const price = getPrice(item);
                const qty = getQty(item);

                return (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={img}
                      alt={item.name}
                      className="w-14 h-14 rounded object-cover border"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/60";
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium leading-5">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ₹{price} × {qty}
                      </p>
                    </div>
                    <div className="font-semibold">₹{price * qty}</div>
                  </div>
                );
              })}

              <hr />

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{computedTotal}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-2">
                <span>Total</span>
                <span>₹{computedTotal}</span>
              </div>

              <button
                onClick={handleProceedToPay}
                className="w-full mt-2 bg-black text-white py-3 rounded-md hover:opacity-90"
              >
                Proceed to Pay
              </button>

              <p className="text-xs text-gray-500 mt-2">
                By placing your order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT METHOD MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Choose Payment Method</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-600 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 border rounded-md p-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="ONLINE"
                  checked={selectedMethod === "ONLINE"}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                />
                <div>
                  <p className="font-medium">Online Payment</p>
                  <p className="text-xs text-gray-500">
                    UPI / Card / Netbanking
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 border rounded-md p-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={selectedMethod === "COD"}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">
                    Pay when product is delivered
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-1/2 border py-2 rounded-md"
              >
                Cancel
              </button>

              <button
                disabled={!selectedMethod}
                onClick={() => {
                  if (selectedMethod === "COD") confirmCOD();
                  if (selectedMethod === "ONLINE") proceedOnlinePayment();
                }}
                className={`w-1/2 py-2 rounded-md text-white ${selectedMethod ? "bg-black" : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                Continue
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Total payable: <b>₹{computedTotal}</b>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;