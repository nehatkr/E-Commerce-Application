import React from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { updateCartItem, removeFromCart } from "../redux/cartSlice";

const CartModal = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const total = useAppSelector((state) => state.cart.total);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
      <div className="bg-white w-full sm:w-96 h-full p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Cart</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            Your cart is empty 🛒
          </p>
        )}

        {/* Cart Items */}
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 border-b py-4">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-16 h-16 rounded object-cover"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">₹{item.price}</p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() =>
                    dispatch(updateCartItem({ id: item.id, quantity: item.quantity - 1 }))
                  }
                >
                  <Minus size={16} />
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    dispatch(updateCartItem({ id: item.id, quantity: item.quantity + 1 }))
                  }
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={() => dispatch(removeFromCart(item.id))}
              className="text-red-500"
            >
              <Trash2 />
            </button>
          </div>
        ))}

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button className="mt-4 w-full bg-black text-white py-2 rounded">
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
