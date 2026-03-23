import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const STATUSES = [
  "PLACED",
  "PACKED",
  "PICKED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const VendorOrderTracker = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  const vendor = useSelector((state) => state.auth.user);
  const vendorId = vendor?.id;

  const fetchVendorDeliveries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/delivery/vendor/${vendorId}`);
      setDeliveries(res.data || []);
    } catch (err) {
      console.error("Failed to fetch deliveries", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (deliveryId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/delivery/status`, {
        deliveryId,
        status: newStatus,
      });

      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === deliveryId
            ? { ...d, status: newStatus, updatedAt: new Date().toISOString() }
            : d
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  useEffect(() => {
    if (vendorId) fetchVendorDeliveries();
  }, [vendorId]);

  if (loading) {
    return <p className="pt-28 ml-56">Loading deliveries...</p>;
  }

  return (
    <div className="pt-28 ml-65 mr-6 pb-8">
      <h2 className="text-2xl font-semibold mb-4">Delivery Tracker</h2>

      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full border border-collapse bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 whitespace-nowrap">Order ID</th>
              <th className="border p-2 whitespace-nowrap">Product</th>
              <th className="border p-2 whitespace-nowrap">Quantity</th>
              <th className="border p-2 whitespace-nowrap">Unit Price</th>
              <th className="border p-2 whitespace-nowrap">Total Price</th>
              <th className="border p-2 whitespace-nowrap">Status</th>
              <th className="border p-2 whitespace-nowrap">Updated At</th>
              <th className="border p-2 whitespace-nowrap">Action</th>
            </tr>
          </thead>

          <tbody>
            {deliveries.length > 0 ? (
              deliveries.map((delivery) => (
                <tr key={delivery.id} className="text-center">
                  <td className="border p-2 whitespace-nowrap">
                    {delivery.orderId ?? "-"}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    {delivery.productName || "-"}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    {delivery.deliveredQuantity ?? 0}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    ₹{Number(delivery.unitPrice ?? 0).toLocaleString()}
                  </td>
                  <td className="border p-2 whitespace-nowrap font-semibold">
                    ₹{Number(delivery.totalPrice ?? 0).toLocaleString()}
                  </td>
                  <td className="border p-2 whitespace-nowrap font-semibold">
                    {delivery.status}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    {delivery.updatedAt
                      ? new Date(delivery.updatedAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    <select
                      value={delivery.status}
                      onChange={(e) => updateStatus(delivery.id, e.target.value)}
                      className="border px-2 py-1 rounded bg-white"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="border p-4 text-center text-gray-500">
                  No deliveries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorOrderTracker;