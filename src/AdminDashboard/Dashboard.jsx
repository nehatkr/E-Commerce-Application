import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const VendorDashboard = () => {
  const products = useSelector((state) => state.products.items);
  const orders = useSelector((state) => state.orders?.items || []); // future-ready
  const vendor = useSelector((state) => state.auth.user);

  // 📊 Revenue calculations (mock-friendly)
  const revenueStats = useMemo(() => {
    let daily = 0;
    let monthly = 0;
    let total = 0;

    orders.forEach((order) => {
      if (order.vendorId !== vendor?.id) return;

      const amount = order.total;
      total += amount;

      const orderDate = new Date(order.createdAt);
      const now = new Date();

      if (orderDate.toDateString() === now.toDateString()) daily += amount;
      if (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      ) monthly += amount;
    });

    return { daily, monthly, total };
  }, [orders, vendor]);

  const chartData = [
    { name: "Today", revenue: revenueStats.daily },
    { name: "This Month", revenue: revenueStats.monthly },
    { name: "Total", revenue: revenueStats.total },
  ];

  const buyers = orders
    .filter((o) => o.vendorId === vendor?.id)
    .map((o) => o.user)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white text-black px-6 py-10 mt-16">
      <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {["Daily", "Monthly", "Total"].map((label, i) => (
          <div key={label} className="bg-black text-white p-6 rounded-xl">
            <p className="text-sm uppercase tracking-wide">{label} Revenue</p>
            <p className="text-2xl font-bold mt-2">
              ₹{Object.values(revenueStats)[i].toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-black text-white p-6 rounded-xl mb-12">
        <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BUYERS LIST */}
      <div className="bg-white text-black p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Customers</h2>
        {buyers.length === 0 ? (
          <p className="text-gray-500">No customers yet</p>
        ) : (
          <ul className="divide-y">
            {buyers.map((user, index) => (
              <li key={index} className="py-3">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
