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

  /* ---------------- FETCH VENDOR DELIVERIES ---------------- */
  const fetchVendorDeliveries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/delivery/vendor/${vendorId}`
      );
      console.log("Delivery response", res)
      setDeliveries(res.data);
    //   console.log(res);
    } catch (err) {
      console.error("Failed to fetch deliveries", err);
    } finally {
      setLoading(false);
    }
  };



  /* ---------------- UPDATE DELIVERY STATUS ---------------- */
  const updateStatus = async (deliveryId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/delivery/status`, {
        deliveryId,
        status: newStatus,
      });

      // Update UI immediately
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === deliveryId ? { ...d, status: newStatus } : d
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  useEffect(() => {
    fetchVendorDeliveries();
  }, []);

  if (loading) return <p>Loading deliveries...</p>;

  return (
    <div className="p-6 pt-30">
      <h2 className="text-2xl font-semibold mb-4">
        Vendor Delivery Tracker
      </h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Product</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Updated At</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.id} className="text-center">
              <td className="border p-2">
                {delivery.product?.name}
              </td>

              <td className="border p-2">
                {delivery.deliveredQuantity}
              </td>

              <td className="border p-2 font-semibold">
                {delivery.status}
              </td>

              <td className="border p-2">
                {new Date(delivery.updatedAt).toLocaleString()}
              </td>

              <td className="border p-2">
                <select
                  value={delivery.status}
                  onChange={(e) =>
                    updateStatus(delivery.id, e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorDeliveryTracker;