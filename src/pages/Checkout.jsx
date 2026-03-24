import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const PRODUCT_URL = "http://localhost:8080";
  const PAYMENT_URL = "http://localhost:8081";
  const RAZORPAY_KEY = "rzp_test_RtVxX2GgS4LcYd";

  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items || []);
  const user = useSelector((state) => state.auth.user);

  console.log("Checkout items FULL:", JSON.stringify(items, null, 2));

  const makeFullUrl = (url) => {
    if (!url) return "/placeholder.png";
    const clean = String(url).trim();
    if (!clean) return "/placeholder.png";
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }
    return `${PRODUCT_URL}${clean.startsWith("/") ? clean : `/${clean}`}`;
  };

  const getImage = (item) => {
    const raw =
      item.imageUrl ||
      item.images?.[0]?.imageUrl ||
      item.images?.[0]?.url ||
      (typeof item.images?.[0] === "string" ? item.images[0] : "") ||
      item.image?.[0]?.imageUrl ||
      item.image?.[0]?.url ||
      (typeof item.image?.[0] === "string" ? item.image[0] : "") ||
      item.image_url ||
      item.image ||
      item.thumbnail ||
      item.img ||
      "";

    return makeFullUrl(raw);
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

  const getProductId = (item) =>
    item?.productId ??
    item?.id ??
    item?.product?.id ??
    null;

  const getVendorId = (item) =>
    item?.vendorId ??
    item?.vendor_id ??
    item?.vendor?.id ??
    item?.product?.vendorId ??
    item?.product?.vendor_id ??
    item?.product?.vendor?.id ??
    null;

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressTab, setAddressTab] = useState("SAVED");
  const [savingAddress, setSavingAddress] = useState(false);

  const [newAddress, setNewAddress] = useState({
    type: "HOME",
    line1: "",
    line2: "",
    line3: "",
    pinCode: "",
    city: "",
    state: "",
    phoneNumber: "",
  });

  const buildOrderPayload = () => {
    const orderItems = items.map((item) => {
      const qty = getQty(item);
      const unitPrice = getPrice(item);

      return {
        productId: getProductId(item),
        vendorId: getVendorId(item),
        quantity: qty,
        unitPrice: unitPrice,
        totalPrice: unitPrice * qty,
      };
    });

    return {
      userId: user?.id ?? null,
      name: form.fullName,
      email: form.email,
      amount: computedTotal,
      items: orderItems,
    };
  };

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

  const fetchSavedAddresses = async () => {
    if (!user?.id) {
      alert("Please login first");
      return;
    }

    try {
      setLoadingAddresses(true);
      const res = await fetch(`${PRODUCT_URL}/api/address/user/${user.id}`);
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        alert(t || "Failed to load addresses");
        return;
      }

      const data = await res.json();
      setSavedAddresses(Array.isArray(data) ? data : []);
      setAddressTab("SAVED");
      setShowAddressModal(true);
    } catch (err) {
      console.error(err);
      alert("Could not load saved addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const applyAddress = (addr) => {
    const fullAddress = [addr.line1, addr.line2, addr.line3]
      .filter(Boolean)
      .join(", ");

    setForm((prev) => ({
      ...prev,
      address: fullAddress,
      pincode: addr.pinCode ? String(addr.pinCode) : "",
      city: addr.city || "",
      state: addr.state || "",
      phone: addr.phoneNumber || "",
    }));

    setErrors((prev) => ({
      ...prev,
      address: "",
      pincode: "",
      city: "",
      state: "",
      phone: "",
    }));

    setShowAddressModal(false);
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const resetNewAddress = () => {
    setNewAddress({
      type: "HOME",
      line1: "",
      line2: "",
      line3: "",
      pinCode: "",
      city: "",
      state: "",
      phoneNumber: "",
    });
  };

  const saveNewAddress = async () => {
    if (!user?.id) {
      alert("Please login first");
      return;
    }

    if (!newAddress.line1.trim()) return alert("Line 1 is required");
    if (!newAddress.city.trim()) return alert("City is required");
    if (!newAddress.state.trim()) return alert("State is required");
    if (!/^\d{6}$/.test(String(newAddress.pinCode).trim())) {
      return alert("Enter valid 6 digit pincode");
    }
    if (!/^\d{10}$/.test(String(newAddress.phoneNumber).trim())) {
      return alert("Enter valid 10 digit phone number");
    }

    try {
      setSavingAddress(true);

      const res = await fetch(`${PRODUCT_URL}/api/address/user/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newAddress.type,
          line1: newAddress.line1,
          line2: newAddress.line2,
          line3: newAddress.line3,
          pinCode: Number(newAddress.pinCode),
          city: newAddress.city,
          state: newAddress.state,
          phoneNumber: newAddress.phoneNumber,
        }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        alert(t || "Failed to save address");
        return;
      }

      await fetchSavedAddresses();
      setAddressTab("SAVED");
      resetNewAddress();
    } catch (e) {
      console.error(e);
      alert("Error saving address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleProceedToPay = () => {
    if (!items.length) {
      alert("Your cart is empty.");
      return;
    }

    if (!validate()) return;

    const payload = buildOrderPayload();
    console.log("Pre-check payload:", payload);

    if (!payload.items || payload.items.length === 0) {
      alert("Cart is empty");
      return;
    }

    const invalidItem = payload.items.find(
      (item) => !item.productId || !item.vendorId
    );

    if (invalidItem) {
      alert("Product ID or Vendor ID missing in one of the cart items");
      return;
    }

    setSelectedMethod("");
    setShowPaymentModal(true);
  };

  const confirmCOD = async () => {
    try {
      setShowPaymentModal(false);

      const payload = buildOrderPayload();
      console.log("COD payload:", payload);

      const res = await fetch(`${PAYMENT_URL}/createCodOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        alert(t || "COD order creation failed ❌");
        return;
      }

      const order = await res.json();
      console.log("COD order response:", order);

      sessionStorage.setItem("lastOrderTotal", computedTotal);

      window.location.href = `/order-success?orderId=${order.orderId}`;
    } catch (e) {
      console.error(e);
      alert("COD order failed ❌");
    }
  };

  const proceedOnlinePayment = async () => {
    try {
      setShowPaymentModal(false);

      const ok = await loadRazorpay();
      if (!ok) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const payload = buildOrderPayload();
      console.log("ONLINE payload:", payload);

      const res = await fetch(`${PAYMENT_URL}/createOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        alert(t || "createOrder failed ❌");
        return;
      }

      const order = await res.json();
      console.log("ONLINE order response:", order);

      const options = {
        key: RAZORPAY_KEY,
        amount: computedTotal * 100,
        currency: "INR",
        name: "NovaShop",
        description: "Order Payment",
        order_id: order.razorpayOrderId,
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        handler: async function (response) {
          try {
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
              const t = await cbRes.text().catch(() => "");
              alert(t || "paymentCallback failed ❌");
              return;
            }

            const cbData = await cbRes.json();
            console.log("Payment callback response:", cbData);

            sessionStorage.setItem("lastOrderTotal", computedTotal);

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
      console.error("Online payment error:", e);
      alert(e?.message || "Online payment failed ❌ (check console)");
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
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Customer Information</h2>

              <button
                type="button"
                onClick={fetchSavedAddresses}
                className="text-sm px-3 py-2 border rounded-md hover:bg-gray-50"
              >
                Use Saved Address
              </button>
            </div>

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
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.png";
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

      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5 max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Delivery Address</h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-600 hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setAddressTab("SAVED")}
                  className={`px-3 py-2 rounded-md text-sm border ${
                    addressTab === "SAVED" ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  Saved
                </button>
                <button
                  type="button"
                  onClick={() => setAddressTab("ADD")}
                  className={`px-3 py-2 rounded-md text-sm border ${
                    addressTab === "ADD" ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  + Add New
                </button>
              </div>

              {addressTab === "ADD" ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Address Type</label>
                    <select
                      name="type"
                      value={newAddress.type}
                      onChange={handleNewAddressChange}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="HOME">Home</option>
                      <option value="OFFICE">Office</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <input
                    name="line1"
                    value={newAddress.line1}
                    onChange={handleNewAddressChange}
                    placeholder="Line 1 (House no, Street)"
                    className="w-full border rounded-md px-3 py-2"
                  />

                  <input
                    name="line2"
                    value={newAddress.line2}
                    onChange={handleNewAddressChange}
                    placeholder="Line 2 (Area, Landmark)"
                    className="w-full border rounded-md px-3 py-2"
                  />

                  <input
                    name="line3"
                    value={newAddress.line3}
                    onChange={handleNewAddressChange}
                    placeholder="Line 3 (Optional)"
                    className="w-full border rounded-md px-3 py-2"
                  />

                  <input
                    name="phoneNumber"
                    value={newAddress.phoneNumber}
                    onChange={handleNewAddressChange}
                    placeholder="Phone Number"
                    className="w-full border rounded-md px-3 py-2"
                  />

                  <input
                    name="pinCode"
                    value={newAddress.pinCode}
                    onChange={handleNewAddressChange}
                    placeholder="6 digit Pincode"
                    className="w-full border rounded-md px-3 py-2"
                  />

                  <input
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    placeholder="City"
                    className="w-full border rounded-md px-3 py-2"
                  />

                  <input
                    name="state"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    placeholder="State"
                    className="w-full border rounded-md px-3 py-2"
                  />

                  <button
                    type="button"
                    disabled={savingAddress}
                    onClick={saveNewAddress}
                    className="w-full py-2 rounded-md text-white bg-black disabled:opacity-60"
                  >
                    {savingAddress ? "Saving..." : "Save Address"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAddressTab("SAVED");
                      resetNewAddress();
                    }}
                    className="w-full py-2 rounded-md border"
                  >
                    Cancel
                  </button>
                </div>
              ) : loadingAddresses ? (
                <p className="text-sm text-gray-500">Loading addresses...</p>
              ) : savedAddresses.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No saved addresses. Click <b>Add New</b> to add one.
                </p>
              ) : (
                <div className="space-y-3">
                  {savedAddresses.map((addr) => {
                    const fullAddress = [addr.line1, addr.line2, addr.line3]
                      .filter(Boolean)
                      .join(", ");

                    return (
                      <div
                        key={addr.id}
                        className="border rounded-md p-3 hover:bg-gray-50"
                      >
                        <p className="font-medium">{addr.type || "HOME"}</p>

                        <p className="text-sm text-gray-600 mt-1">
                          {fullAddress}
                        </p>

                        {(addr.city || addr.state) && (
                          <p className="text-sm text-gray-600">
                            {[addr.city, addr.state].filter(Boolean).join(", ")}
                          </p>
                        )}

                        {addr.phoneNumber && (
                          <p className="text-sm text-gray-600">
                            {addr.phoneNumber}
                          </p>
                        )}

                        <p className="text-sm text-gray-500">
                          PIN: {addr.pinCode}
                        </p>

                        <button
                          onClick={() => applyAddress(addr)}
                          className="mt-2 px-3 py-1 bg-black text-white rounded text-sm"
                        >
                          Deliver Here
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5 max-h-[80vh] overflow-auto">
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
                  className={`w-1/2 py-2 rounded-md text-white ${
                    selectedMethod
                      ? "bg-black"
                      : "bg-gray-400 cursor-not-allowed"
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
        </div>
      )}
    </div>
  );
};

export default Checkout;