import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [qty, setQty] = useState(1);

  /* ⭐ mock ratings (can be replaced by backend later) */
  const rating = 4.3;
  const totalReviews = 128;

  const BASE_URL = "https://intern-app-ecommerce-production.up.railway.app";

  const getImageUrl = (url) => {
    if (!url) return "/placeholder.png";
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  /* 🚀 FETCH PRODUCT BY ID */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://intern-app-ecommerce-production.up.railway.app/api/product/${id}`
        );
        setProduct(res.data);
        setActiveImage(getImageUrl(res.data.images?.[0]?.imageUrl));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* 🦴 SKELETON LOADER */
  if (loading) {
    return (
      <div className="mt-24 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="bg-gray-200 h-[420px] rounded-lg" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-12 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <p className="mt-24 text-center">Product not found</p>;
  }

  return (
    <div className="mt-30 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10">
      {/* 🖼️ IMAGE + ZOOM */}
      <div>
        <div className="relative overflow-hidden rounded-lg group border">
          <img
              src={getImageUrl(activeImage)}
            alt={product.name}
            className="w-full h-105 object-cover transition-transform duration-300 group-hover:scale-125"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        </div>

        {/* IMAGE GALLERY */}
        <div className="flex gap-3 mt-4 pb-20 pt-6">
          {product.images?.map((img) => (
            <img
              key={img.id}
              src={getImageUrl(activeImage)}
              onClick={() => setActiveImage(img.imageUrl)}
              className={`h-20 w-20 object-cover rounded cursor-pointer border ${
                activeImage === img.imageUrl
                  ? "border-black"
                  : "border-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 📦 PRODUCT DETAILS */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="text-gray-600 mt-3">{product.description}</p>

        {/* ⭐ RATINGS */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex text-yellow-500">
            {"★".repeat(Math.floor(rating))}
            {"☆".repeat(5 - Math.floor(rating))}
          </div>
          <span className="text-sm text-gray-600">
            {rating} ({totalReviews} reviews)
          </span>
        </div>

        {/* 💰 PRICE */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-bold">₹{product.discountPrice}</span>
          <span className="line-through text-gray-400">
            ₹{product.originalPrice}
          </span>
          <span className="text-green-600 font-medium">
            {product.discount}% OFF
          </span>
        </div>

        {/* 📏 SIZES */}
        {product.sizes && (
          <div className="mt-6">
            <p className="font-semibold">Available Sizes</p>
            <div className="flex gap-2 mt-2">
              {product.sizes.split(",").map((size) => (
                <span key={size} className="border px-4 py-1 rounded">
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 🛒 QUANTITY */}
        <div className="mt-6">
          <p className="font-semibold mb-2">Quantity</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1 border rounded"
            >
              −
            </button>
            <span className="font-bold">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* 🛍️ ADD TO CART */}
        <button
          onClick={() =>
            dispatch(
              addToCart({
                id: product.id,
                name: product.name,
                price: product.discountPrice,
                image: product.images?.[0]?.imageUrl,
                quantity: qty,
              })
            )
          }
          className="mt-8 bg-black text-white px-8 py-3 rounded hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
