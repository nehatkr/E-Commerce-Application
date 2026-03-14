import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { BASE_URL } from "../utils/constants";

const VendorDashboard = () => {
  const vendor = useSelector((state) => state.auth.user);
  const vendorId = vendor?.id;

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/delivery/vendor/${vendorId}`);
        setDeliveries(res.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchDashboardData();
    }
  }, [vendorId]);

  const revenueStats = useMemo(() => {
    let daily = 0;
    let monthly = 0;
    let total = 0;

    const now = new Date();

    deliveries.forEach((item) => {
      const amount = Number(item.totalPrice ?? 0);
      const itemDate = new Date(item.updatedAt || item.createdAt);

      total += amount;

      if (itemDate.toDateString() === now.toDateString()) {
        daily += amount;
      }

      if (
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear()
      ) {
        monthly += amount;
      }
    });

    return { daily, monthly, total };
  }, [deliveries]);

  const chartData = [
    { name: "Today", revenue: revenueStats.daily },
    { name: "This Month", revenue: revenueStats.monthly },
    { name: "Total", revenue: revenueStats.total },
  ];

  const statusCounts = useMemo(() => {
    const counts = {
      PLACED: 0,
      PACKED: 0,
      PICKED: 0,
      IN_TRANSIT: 0,
      OUT_FOR_DELIVERY: 0,
      DELIVERED: 0,
    };

    deliveries.forEach((item) => {
      if (counts[item.status] !== undefined) {
        counts[item.status] += 1;
      }
    });

    return counts;
  }, [deliveries]);

  if (loading) {
    return (
      <div className="w-full max-w-full mt-16 md:ml-60 px-4 md:px-6 lg:px-8 pt-6 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Vendor Dashboard</h1>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full mt-16 md:ml-60 px-4 md:px-6 lg:px-8 pt-6 pb-8 space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold">Vendor Dashboard</h1>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-black text-white p-5 md:p-6 rounded-xl shadow-md min-w-0">
          <p className="text-sm uppercase tracking-wide text-gray-300">
            Daily Revenue
          </p>
          <p className="text-2xl md:text-3xl font-bold mt-2 break-words">
            ₹{revenueStats.daily.toLocaleString()}
          </p>
        </div>

        <div className="bg-black text-white p-5 md:p-6 rounded-xl shadow-md min-w-0">
          <p className="text-sm uppercase tracking-wide text-gray-300">
            Monthly Revenue
          </p>
          <p className="text-2xl md:text-3xl font-bold mt-2 break-words">
            ₹{revenueStats.monthly.toLocaleString()}
          </p>
        </div>

        <div className="bg-black text-white p-5 md:p-6 rounded-xl shadow-md min-w-0">
          <p className="text-sm uppercase tracking-wide text-gray-300">
            Total Revenue
          </p>
          <p className="text-2xl md:text-3xl font-bold mt-2 break-words">
            ₹{revenueStats.total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 md:p-6 w-full min-w-0">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Revenue Overview</h2>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[700px] w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                <Bar
                  dataKey="revenue"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                  barSize={70}
                >
                  <LabelList
                    dataKey="revenue"
                    position="top"
                    formatter={(value) => `₹${value}`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-gray-100 p-5 rounded-xl shadow-sm min-w-0">
          <p className="text-sm text-gray-600">Placed</p>
          <p className="text-2xl font-bold mt-1">{statusCounts.PLACED}</p>
        </div>

        <div className="bg-gray-100 p-5 rounded-xl shadow-sm min-w-0">
          <p className="text-sm text-gray-600">Packed</p>
          <p className="text-2xl font-bold mt-1">{statusCounts.PACKED}</p>
        </div>

        <div className="bg-gray-100 p-5 rounded-xl shadow-sm min-w-0">
          <p className="text-sm text-gray-600">Picked</p>
          <p className="text-2xl font-bold mt-1">{statusCounts.PICKED}</p>
        </div>

        <div className="bg-gray-100 p-5 rounded-xl shadow-sm min-w-0">
          <p className="text-sm text-gray-600">Delivered</p>
          <p className="text-2xl font-bold mt-1">{statusCounts.DELIVERED}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 md:p-6 w-full min-w-0">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Orders</h2>

        {deliveries.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full border border-collapse text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 md:p-3">Product</th>
                  <th className="border p-2 md:p-3">Qty</th>
                  <th className="border p-2 md:p-3">Unit Price</th>
                  <th className="border p-2 md:p-3">Total</th>
                  <th className="border p-2 md:p-3">Status</th>
                  <th className="border p-2 md:p-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.slice(0, 5).map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="border p-2 md:p-3">
                      {item.productName || "-"}
                    </td>
                    <td className="border p-2 md:p-3">
                      {item.deliveredQuantity ?? 0}
                    </td>
                    <td className="border p-2 md:p-3">
                      ₹{Number(item.unitPrice ?? 0).toLocaleString()}
                    </td>
                    <td className="border p-2 md:p-3 font-semibold">
                      ₹{Number(item.totalPrice ?? 0).toLocaleString()}
                    </td>
                    <td className="border p-2 md:p-3">{item.status}</td>
                    <td className="border p-2 md:p-3 whitespace-nowrap">
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;