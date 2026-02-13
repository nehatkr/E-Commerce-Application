import React from "react";
import { Package, Truck, CheckCircle } from "lucide-react";

const orders = [
  {
    id: "ORD123456",
    date: "12 Feb 2026",
    total: 2499,
    status: "Shipped",
    items: [
      {
        name: "Women Coat",
        image: "https://via.placeholder.com/80",
        qty: 1,
        price: 2499,
      },
    ],
  },
  {
    id: "ORD987654",
    date: "01 Feb 2026",
    total: 1299,
    status: "Delivered",
    items: [
      {
        name: "Men Hoodie",
        image: "https://via.placeholder.com/80",
        qty: 1,
        price: 1299,
      },
    ],
  },
];

const statusSteps = [
  "Placed",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const MyOrders = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-16">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-6"
            >
              {/* HEADER */}
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {order.date}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-lg font-bold">₹{order.total}</p>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="flex items-center justify-between mb-6">
                {statusSteps.map((step, index) => {
                  const isActive =
                    statusSteps.indexOf(order.status) >= index;

                  return (
                    <div key={step} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isActive
                              ? "bg-black text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {step === "Delivered" ? (
                            <CheckCircle size={16} />
                          ) : step === "Shipped" ||
                            step === "Out for Delivery" ? (
                            <Truck size={16} />
                          ) : (
                            <Package size={16} />
                          )}
                        </div>
                        <p className="text-xs mt-2 text-center">
                          {step}
                        </p>
                      </div>

                      {index !== statusSteps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 ${
                            isActive ? "bg-black" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ITEMS */}
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 border-t pt-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.qty}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="flex justify-end mt-6">
                <button className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition">
                  View Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
