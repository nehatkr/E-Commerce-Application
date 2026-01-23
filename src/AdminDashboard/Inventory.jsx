import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/productsSlice";

const Inventory = () => {
  const [images, setImages] = useState([]);
const [previews, setPreviews] = useState([]);

  const dispatch = useDispatch();
  //   const { user } = useSelector((state) => state.auth);

  // // 🔐 Vendor-only access
  // if (user?.role !== "vendor") {
  //   return <Navigate to="/" />;
  // }

  const [form, setForm] = useState({
    name: "",
    category: "men",
    sizes: [],
    quantity: "",
    originalPrice: "",
    discount: "",
    discountedPrice: "",
    description: "",
    image: null,
  });


  // ✅ auto calculate discounted price (same logic)
  useEffect(() => {
    if (form.originalPrice && form.discount) {
      const price = Number(form.originalPrice);
      const discount = Number(form.discount);
      const final = price - (price * discount) / 100;

      setForm((prev) => ({
        ...prev,
        discountedPrice: final.toFixed(2),
      }));
    }
  }, [form.originalPrice, form.discount]);

const handleFileChange = (e) => {
  const files = Array.from(e.target.files);

  setImages(files);

  const previewUrls = files.map((file) =>
    URL.createObjectURL(file)
  );

  setPreviews(previewUrls);
};


  const handleSizeChange = (e) => {
    const values = [...e.target.selectedOptions].map((option) => option.value);
    setForm({ ...form, sizes: values });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.originalPrice) {
      alert("Fill required fields");
      return;
    }

    // ✅ ONLY REDUX ADDITION
    dispatch(
      addProduct({
        id: Date.now().toString(),
        name: form.name,
        category: form.category,
        price: Number(form.originalPrice),
        discountPercentage: Number(form.discount),
        discountedPrice: Number(form.discountedPrice),
        stock: Number(form.quantity),
        sizes: form.sizes,
        shortDescription: form.description,
        images: {
          thumbnail:
            form.image || "https://via.placeholder.com/300x400?text=Product",
        },
        addToCartEnabled: true,
      })
    );

    alert("Product Added Successfully");

    // reset form
    setForm({
      name: "",
      category: "men",
      sizes: [],
      quantity: "",
      originalPrice: "",
      discount: "",
      discountedPrice: "",
      description: "",
      image: null,
    });
    setPreviews(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 mt-16">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Inventory Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-lg rounded-lg space-y-6 border-gray-900"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            className="input-field"
            placeholder="Product ID"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            required
          />
          <input
            className="input-field"
            placeholder="Product Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select
            className="input-field"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
            <option value="accessories">Accessories</option>
          </select>

          <input
            type="number"
            className="input-field"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sizes (Hold Ctrl to select multiple)
          </label>
          <select
            multiple
            className="input-field h-24"
            onChange={handleSizeChange}
          >
            {["S", "M", "L", "XL", "XXL"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            className="input-field"
            placeholder="Price ($)"
            value={form.originalPrice}
            onChange={(e) =>
              setForm({ ...form, originalPrice: e.target.value })
            }
            required
          />
          <input
            type="number"
            className="input-field"
            placeholder="Discount %"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
          />
          <input
            className="input-field bg-gray-100"
            placeholder="Final Price"
            value={form.discountedPrice}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500"
          />

          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index}`}
                  className="h-32 w-32 object-cover rounded-md border"
                />
              ))}
            </div>
          )}
        </div>

        <textarea
          className="input-field"
          rows="3"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 font-bold"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Inventory;
