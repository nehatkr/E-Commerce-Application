import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorProducts } from "../redux/vendorProductsSlice";
import { removeProduct } from "../redux/vendorProductsSlice";
import { BASE_URL } from "../utils/constants";



const EditProducts = () => {
  const dispatch = useDispatch();

  const { items: products, loading } = useSelector(
    (state) => state.vendorProducts,
  );

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const { user } = useSelector((state) => state.auth);
  const vendorId = user?.id;

  // ✅ FETCH PRODUCTS (VERY IMPORTANT)
  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendorProducts(vendorId));
    }
  }, [dispatch, vendorId]);

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      category: product.category || "Men",
      price: product.price ?? 0,
      discountPercentage: product.discountPercentage ?? 0,
      discountedPrice: product.discountedPrice ?? 0,
      quantity: product.quantity ?? 0,
      sizes: product.sizes?.join(", ") || "",
      description: product.description || "",
      addToCartEnabled: product.quantity > 0,
    });
  };

  useEffect(() => {
    if (form.price && form.discountPercentage) {
      const discounted =
        form.price - (form.price * form.discountPercentage) / 100;

      setForm((prev) => ({
        ...prev,
        discountedPrice: Math.round(discounted),
      }));
    }
  }, [form.price, form.discountPercentage]);

  const saveEdit = async (id) => {
    try {
      if (
        form.name === undefined ||
        form.price === undefined ||
        form.discountPercentage === undefined ||
        form.quantity === undefined
      ) {
        alert("Some required fields are missing");
        return;
      }

      const formData = new FormData();

      // ✅ MUST MATCH BACKEND
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("quantity", Number(form.quantity));
      formData.append("discount", Number(form.discountPercentage));
      formData.append("originalPrice", Number(form.price));
      formData.append("discountPrice", Number(form.discountedPrice));
      formData.append("description", form.description || "");
      formData.append(
        "addToCartEnabled",
        form.addToCartEnabled ? "true" : "false",
      );

      // sizes → backend accepts comma separated OR repeated key
      form.sizes
        .split(",")
        .map((s) => s.trim())
        .forEach((size) => {
          formData.append("sizes", size);
        });

      // 🔍 DEBUG (KEEP THIS)
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await fetch(`${BASE_URL}/api/product/${id}`, {
        method: "PUT",
        body: formData, // multipart/form-data
      });

      if (!res.ok) throw new Error("Update failed");

      dispatch(fetchVendorProducts(vendorId));

      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BASE_URL}/api/product/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      dispatch(removeProduct(id));

      // ✅ Refresh product list after delete
      dispatch(fetchVendorProducts(vendorId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return <p className="text-center mt-20 text-lg">Loading Products...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-16">
      <h1 className="text-3xl font-bold mb-8">Vendor · Inventory Editor</h1>

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
              <th className="p-4">Sizes</th>
              <th className="p-4">Cart</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const imageUrl =
                product.images && product.images.length > 0
                  ? product.images[0].imageUrl
                  : "https://via.placeholder.com/80";

              return (
                <tr key={product.id} className="border-t text-center">
                  {/* IMAGE */}
                  <td className="p-4">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="w-14 h-14 object-cover rounded border mx-auto"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/80";
                      }}
                    />
                  </td>

                  {/* ID */}
                  <td className="p-4 font-mono text-xs">{product.id}</td>

                  {/* CATEGORY */}
                  <td className="p-4 text-center">
                    {editingId === product.id ? (
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                        className="border px-2 py-1"
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    ) : (
                      product.category
                    )}
                  </td>

                  {/* PRICE */}
                  <td className="p-4 text-center">
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
                      `₹${product.price}`
                    )}
                  </td>

                  {/* DISCOUNT */}
                  <td className="p-4 text-center">
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
                  <td className="p-4 font-semibold text-center">
                    ₹{product.discountedPrice}
                  </td>

                  {/* SIZES */}
                  <td className="p-4 text-center">
                    {product.sizes?.join(", ")}
                  </td>

                  {/* CART */}
                  <td className="p-4">
                    {product.quantity > 0 ? "✅ Available" : "❌ Out of Stock"}
                  </td>
                 <td className="p-4 text-center">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={form.quantity}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            quantity: e.target.value,
                          })
                        }
                        className="border px-2 py-1 w-20"
                      />
                    ) : (
                      `${product.quantity}`
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="p-4 text-center">
                    {editingId === product.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(product.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(product)}
                          className="bg-black text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {Array.isArray(products) && products.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No products available.
        </p>
      )}
    </div>
  );
};

export default EditProducts;
