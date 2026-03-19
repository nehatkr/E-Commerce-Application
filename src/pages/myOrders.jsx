import React, { useEffect } from "react";
import { Package, Truck, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const STATUS_STEPS = [
  "PLACED",
  "PACKED",
  "PICKED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const getStatusIcon = (status, isActive) => {
  if (status === "DELIVERED")
    return <CheckCircle size={16} />;
  if (
    status === "IN_TRANSIT" ||
    status === "OUT_FOR_DELIVERY"
  )
    return <Truck size={16} />;
  return <Package size={16} />;
};

const MyOrders = () => {
  const [orders, setOrders] = React.useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:8081/api/orders/user/${user.id}`)
      .then((res) => {
        console.log(res.data);   // check here
        setOrders(res.data);
      })
      .catch((err) => console.error(err));
  }, [user]);

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        You have no orders yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-16">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const currentIndex = STATUS_STEPS.indexOf(order.orderStatus);

          return (
            <div
              key={order.orderId}
              className="bg-white rounded-xl shadow-md p-6"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>
                  <p className="font-semibold">
                    #{order.orderId}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Status
                  </p>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black text-white">
                    {order.orderStatus.replaceAll("_", " ")}
                  </span>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="flex items-center mb-6">
                {STATUS_STEPS.map((step, index) => {
                  const isActive = index <= currentIndex;

                  return (
                    <div
                      key={step}
                      className="flex-1 flex items-center"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${isActive
                            ? "bg-black text-white"
                            : "bg-gray-300 text-gray-600"
                            }`}
                        >
                          {getStatusIcon(step, isActive)}
                        </div>
                        <p className="text-xs mt-2 text-center">
                          {step.replaceAll("_", " ")}
                        </p>
                      </div>

                      {index !==
                        STATUS_STEPS.length - 1 && (
                          <div
                            className={`flex-1 h-1 mx-2 ${index < currentIndex
                              ? "bg-black"
                              : "bg-gray-300"
                              }`}
                          />
                        )}
                    </div>
                  );
                })}
              </div>

              {/* PRODUCT */}
              <div className="flex items-center gap-4 border-t pt-4">
                {/* <img
                  src={
                    order.product?.images?.[0]
                      ?.imageUrl ||
                    "https://via.placeholder.com/80"
                  }
                  alt={order.product?.name}
                  className="w-20 h-20 object-cover rounded"
                /> */}

                <div className="flex-1">
                  <p className="font-semibold">
                    {order.product?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {order.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: ₹ {order.amount}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;