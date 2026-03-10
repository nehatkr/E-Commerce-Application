import { useEffect, useState } from "react";
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

const VendorDeliveryTracker = ({ vendorId }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

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

  if (loading) return <p className="pt-30 pl-40">Loading deliveries...</p>;

  return (
    <div className="pt-30 pl-63 pr-6 pb-8">
      <h2 className="text-2xl font-semibold mb-4">Vendor Delivery Tracker</h2>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[1200px] w-full border border-collapse bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Unit Price</th>
              <th className="border p-2">Total Price</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Updated At</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {deliveries.length > 0 ? (
              deliveries.map((delivery) => (
                <tr key={delivery.id} className="text-center">
                  <td className="border p-2">
                    {delivery.productName || delivery.product?.name || "-"}
                  </td>

                  <td className="border p-2">
                    {delivery.deliveredQuantity ?? "-"}
                  </td>

                  <td className="border p-2">
                    ₹{delivery.unitPrice ?? 0}
                  </td>

                  <td className="border p-2 font-semibold">
                    ₹{delivery.totalPrice ?? 0}
                  </td>

                  <td className="border p-2 font-semibold">
                    {delivery.status}
                  </td>

                  <td className="border p-2">
                    {delivery.updatedAt
                      ? new Date(delivery.updatedAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="border p-2">
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
                <td colSpan="7" className="border p-4 text-center text-gray-500">
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

export default VendorDeliveryTracker;