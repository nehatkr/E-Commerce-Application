import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, increaseQty, decreaseQty } from "../redux/cartSlice";
import { User } from "lucide-react";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const PRODUCT_URL =
    import.meta.env.VITE_PRODUCT_URL || "http://localhost:8080";

  const makeFullUrl = (url) => {
    if (!url) return "/placeholder.png";

    const clean = String(url).trim();
    if (!clean) return "/placeholder.png";
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }

    const base = PRODUCT_URL.replace(/\/$/, "");
    const path = clean.startsWith("/") ? clean : `/${clean}`;
    return `${base}${path}`;
  };

  const getCartImage = (item) => {
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

  const totalAmount = items.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-26">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <User size={20} />
          <h2 className="text-lg font-semibold">
            Hello, {user?.firstName || "User"}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white p-4 rounded shadow"
              >
                <img
                  src={getCartImage(item)}
                  className="w-24 h-24 object-cover rounded border"
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.description || ""}
                  </p>
                  <p className="font-bold mt-2">₹{item.price}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => dispatch(decreaseQty(item.id))}
                      className="border px-2"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => dispatch(increaseQty(item.id))}
                      className="border px-2"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-600 font-semibold"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-6 rounded shadow h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          <div className="flex justify-between mb-2">
            <span>Total Items</span>
            <span>{items.length}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            className="mt-4 w-full bg-black text-white py-2 rounded"
            onClick={() => {
              if (items.length === 0) {
                alert("Your cart is empty");
                return;
              }
              navigate("/checkout");
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;