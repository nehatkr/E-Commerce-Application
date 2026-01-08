import React, { useEffect, useState } from "react";
import productsData from "../data/products.json";

const EditProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  // Load products from JSON
  useEffect(() => {
    setProducts(productsData.products || []);
  }, []);

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      category: product.category,
      price: product.price,
      discountPercentage: product.discountPercentage,
      discountedPrice: product.discountedPrice,
      stock: product.stock,
      sizes: product.sizes?.join(", ") || "",
      colors: product.colors?.join(", ") || "",
      addToCartEnabled: product.addToCartEnabled,
    });
  };

  const saveEdit = (id) => {
    const updated = products.map((p) =>
      p.id === id
        ? {
            ...p,
            category: form.category,
            price: Number(form.price),
            discountPercentage: Number(form.discountPercentage),
            discountedPrice: Number(form.discountedPrice),
            stock: Number(form.stock),
            sizes: form.sizes.split(",").map((s) => s.trim()),
            colors: form.colors.split(",").map((c) => c.trim()),
            addToCartEnabled: form.addToCartEnabled,
          }
        : p
    );

    setProducts(updated);
    setEditingId(null);

    // 🔮 FUTURE BACKEND PLACE
    // api.updateProduct(id, updatedProduct)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-16">
      <h1 className="text-3xl font-bold mb-8">Admin · Edit Products</h1>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">ID</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Discount %</th>
              <th className="p-4">Final Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Sizes</th>
              <th className="p-4">Colors</th>
              <th className="p-4">Cart</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                {/* IMAGE */}
                <td className="p-4">
                  <img
                    src={product.images.thumbnail}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>

                {/* ID */}
                <td className="p-4 font-mono">{product.id}</td>

                {/* CATEGORY */}
                <td className="p-4">
                  {editingId === product.id ? (
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="border px-2 py-1"
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="kids">Kids</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  ) : (
                    product.category
                  )}
                </td>

                {/* PRICE */}
                <td className="p-4">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className="border px-2 py-1 w-24"
                    />
                  ) : (
                    `$${product.price}`
                  )}
                </td>

                {/* DISCOUNT % */}
                <td className="p-4">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={form.discountPercentage}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          discountPercentage: e.target.value,
                        })
                      }
                      className="border px-2 py-1 w-20"
                    />
                  ) : (
                    `${product.discountPercentage}%`
                  )}
                </td>

                {/* FINAL PRICE */}
                <td className="p-4 font-semibold">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={form.discountedPrice}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          discountedPrice: e.target.value,
                        })
                      }
                      className="border px-2 py-1 w-24"
                    />
                  ) : (
                    `$${product.discountedPrice}`
                  )}
                </td>

                {/* STOCK */}
                <td className="p-4">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: e.target.value })
                      }
                      className="border px-2 py-1 w-20"
                    />
                  ) : (
                    product.stock
                  )}
                </td>

                {/* SIZES */}
                <td className="p-4">
                  {editingId === product.id ? (
                    <input
                      value={form.sizes}
                      onChange={(e) =>
                        setForm({ ...form, sizes: e.target.value })
                      }
                      className="border px-2 py-1 w-40"
                    />
                  ) : (
                    product.sizes?.join(", ")
                  )}
                </td>

                {/* CART ENABLE */}
                <td className="p-4 text-center">
                  {editingId === product.id ? (
                    <input
                      type="checkbox"
                      checked={form.addToCartEnabled}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          addToCartEnabled: e.target.checked,
                        })
                      }
                    />
                  ) : product.addToCartEnabled ? (
                    "✅"
                  ) : (
                    "❌"
                  )}
                </td>

                {/* ACTION */}
                <td className="p-4">
                  {editingId === product.id ? (
                    <button
                      onClick={() => saveEdit(product.id)}
                      className="bg-green-600 text-white px-4 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(product)}
                      className="bg-black text-white px-4 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-gray-500 text-sm mt-4">
        ⚠️ Currently using local JSON data. Backend API can be plugged in later.
      </p>
    </div>
  );
};

export default EditProducts;
