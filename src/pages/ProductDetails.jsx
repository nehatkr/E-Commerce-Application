import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { BASE_URL } from "../utils/constants";
import {
  Truck,
  RefreshCw,
  ShieldCheck,
  Package,
  Star,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [qty, setQty] = useState(1);

  const rating = 4.3;
  const totalReviews = 128;


  const getImageUrl = (url) => {
    if (!url) return "/placeholder.png";
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/product/${id}`
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

  if (loading) {
    return (
      <div className="mt-24 max-w-6xl mx-auto px-4 animate-pulse">
        Loading...
      </div>
    );
  }

  if (!product) {
    return <p className="mt-24 text-center">Product not found</p>;
  }

  return (
    <motion.div
      className="mt-30 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 pt-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 🖼️ IMAGE SECTION */}
      <div>
        <motion.div
          key={activeImage}
          className="relative overflow-hidden rounded-lg border "
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-[450px] object-cover object-top transition-transform duration-300 group-hover:scale-105"
            onError={(e) => (e.target.src = "/placeholder.png")}
          />
        </motion.div>

        {/* GALLERY */}
        <div className="flex gap-3 mt-4 pb-15">
          {product.images?.map((img) => {
            const imgUrl = getImageUrl(img.imageUrl);
            return (
              <motion.img
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={img.id}
                src={imgUrl}
                onClick={() => setActiveImage(imgUrl)}
                className={`h-20 w-20 object-cover rounded cursor-pointer border ${
                  activeImage === imgUrl ? "border-black" : "border-gray-300"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 📦 PRODUCT DETAILS */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        <motion.h1
          className="text-3xl font-bold"
          variants={{ hidden: { y: 20 }, show: { y: 0 } }}
        >
          {product.name}
        </motion.h1>
        <motion.p
          className="text-gray-600 mt-3"
          variants={{ hidden: { y: 20 }, show: { y: 0 } }}
        >
          {product.description}
        </motion.p>
        {/* ⭐ RATINGS */}{" "}
        <div className="flex items-center gap-2 mt-4">
          {" "}
          <div className="flex text-yellow-500">
            {" "}
            {"★".repeat(Math.floor(rating))}{" "}
            {"☆".repeat(5 - Math.floor(rating))}{" "}
          </div>{" "}
          <span className="text-sm text-gray-600">
            {" "}
            {rating} ({totalReviews} reviews){" "}
          </span>{" "}
        </div>
        {/* PRICE */}
        <motion.div
          className="mt-4 flex items-center gap-3"
          variants={{ hidden: { y: 20 }, show: { y: 0 } }}
        >
          <span className="text-2xl font-bold">₹{product.discountPrice}</span>
          <span className="line-through text-gray-400">
            ₹{product.originalPrice}
          </span>
          <span className="text-green-600 font-medium">
            {product.discount}% OFF
          </span>
        </motion.div>
        {/* STOCK WARNING */}
        {product.quantity <= 2 && product.quantity > 0 && (
          <motion.p
            className="mt-2 text-red-600 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Only {product.quantity} left in stock!
          </motion.p>
        )}
        {/* 📏 SIZES */}{" "}
        {product.sizes && (
          <div className="mt-6">
            {" "}
            <p className="font-semibold">Available Sizes</p>{" "}
            <div className="flex gap-2 mt-2">
              {" "}
              {product.sizes.split(",").map((size) => (
                <span key={size} className="border px-4 py-1 rounded">
                  {" "}
                  {size}{" "}
                </span>
              ))}{" "}
            </div>{" "}
          </div>
        )}
        {/* QUANTITY */}
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
              onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>
        </div>
        {/* ACTION BUTTONS */}
        <div className="mt-6 flex gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={product.quantity === 0}
            onClick={() =>
              dispatch(
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.discountPrice,
                  image: product.images?.[0]?.imageUrl,
                  quantity: qty,
                  description: product.description,
                })
              )
            }
            className="flex-1 py-2 rounded bg-blue-900 text-white hover:bg-blue-800"
          >
            Add to Cart
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-2 rounded bg-blue-900 text-white hover:bg-blue-800"
          >
            Checkout
          </motion.button>
        </div>
        {/* 🚚 PRODUCT SERVICE INFO */}
        <div className="mt-8 pt-6 pb-5">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center text-sm text-gray-700">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl"><ShieldCheck size={24} /></span>
              <p className="font-medium">Pay on Delivery</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl"><RefreshCw size={24} /></span>
              <p className="font-medium">10 Days Returnable</p>
            </div>


            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl"><Truck size={24} /></span>
              <p className="font-medium">Free Delivery</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">
                <CreditCard size={24} />
              </span>
              <p className="font-medium">Secure Transaction</p>
            </div>
          </div>
        </div>
        {/* VENDOR */}
        {product.vendor && (
          <div className="pb-10">
          <motion.div
            className="mt-6 p-4 bg-gray-50 border rounded-lg"
            whileHover={{ y: -4 }}
          >
            <p className="font-semibold mb-2">Sold By</p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
                {product.vendor.firstName[0]}
              </div>
              <div>
                <p className="font-medium">{product.vendor.shopName}</p>
                <p className="text-sm text-gray-600">
                  {product.vendor.firstName} {product.vendor.lastName}
                </p>
              </div>
            </div>
          </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductDetails;
