import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../redux/cartSlice";
import { User } from "lucide-react";

const CartPage = () => {
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // ✅ TOTAL AMOUNT
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ TOTAL ITEMS (FIXED)
  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-20">
      {/* USER HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <User size={20} />
        <h2 className="text-lg font-semibold">
          Hello, {user?.firstName || "User"}
        </h2>
      </div>

      {/* CART CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CART ITEMS */}
        <div className="md:col-span-2 space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            items.map((item) => {
              // ✅ IMAGE FIX (VERY IMPORTANT)
              const imageUrl =
                item.images && item.images.length > 0
                  ? item.images[0].imageUrl
                  : "https://via.placeholder.com/100";

              return (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white p-4 rounded-xl shadow"
                >
                  {/* IMAGE */}
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/100";
                    }}
                  />

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.description}
                    </p>

                    <p className="font-bold mt-2">₹{item.price}</p>

                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => dispatch(decreaseQty(item.id))}
                        className="border px-3 py-1 rounded"
                      >
                        −
                      </button>

                      <span className="font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => dispatch(increaseQty(item.id))}
                        className="border px-3 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-600 font-bold text-xl"
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h3 className="text-lg font-semibold mb-4">
            Order Summary
          </h3>

          <div className="flex justify-between mb-2">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          <button className="mt-6 w-full bg-black text-white py-2 rounded-lg">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
