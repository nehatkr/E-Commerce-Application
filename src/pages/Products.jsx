import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../redux/productsSlice";
import ProductSkeleton from "./ProductSkeleton";
import axios from "axios";

const ITEMS_PER_PAGE = 8;

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { items: products = [], loading } = useSelector(
    (state) => state.products
  );

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter(
      (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [products, selectedCategory]);

  const paginatedProducts = filteredProducts.slice(0, page * ITEMS_PER_PAGE);

  const handleAddToCart = async (product) => {
    let vendorId =
      product.vendorId ||
      product.vendor_id ||
      product.vendor?.id ||
      null;

    if (!vendorId) {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/product/${product.id}`
        );

        const fullProduct = res.data;

        vendorId =
          fullProduct.vendorId ||
          fullProduct.vendor_id ||
          fullProduct.vendor?.id ||
          fullProduct.sellerId ||
          null;

        if (!vendorId) {
          alert("Vendor info missing");
          return;
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Error loading product details");
        return;
      }
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price:
        product.discountPrice ??
        product.discountedPrice ??
        product.price,
      description: product.description || "",
      quantity: 1,
      imageUrl: product.images?.[0]?.imageUrl || "",
      images: product.images || [],
      vendorId: vendorId,
    };

    try {
      await axios.post("http://localhost:8080/api/cart/add", {
        userId: user.id,
        productId: product.id,
        quantity: 1,
        price: cartItem.price,
      });

      dispatch(addToCart(cartItem));
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-16">
      {loading && (
        <p className="text-center text-gray-500">Loading products...</p>
      )}

      <div className="flex flex-wrap gap-4 mb-10">
        {["all", "men", "women", "kids", "accessories"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setPage(1);
            }}
            className={`px-5 py-2 rounded-full ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow hover:shadow-xl cursor-pointer overflow-hidden h-full flex flex-col"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.images?.[0]?.imageUrl || "/fallback.png"}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = "/fallback.png";
                    }}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold capitalize min-h-[28px]">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 min-h-[40px] line-clamp-2">
                    {product.shortDescription || product.description || ""}
                  </p>

                  <div className="mt-3 min-h-[48px]">
                    <p className="text-sm font-medium mb-1">Sizes available:</p>
                    <div className="flex gap-2 flex-wrap">
                      {(product.sizes || []).map((size, index) => (
                        <span
                          key={index}
                          className="border px-2 py-1 text-xs rounded"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2 items-center min-h-[32px]">
                    <span className="text-xl font-bold">
                      ₹{product.discountedPrice ?? product.discountPrice}
                    </span>
                    <span className="line-through text-gray-400">
                      ₹{product.price}
                    </span>
                  </div>

                  <div className="mt-auto pt-4">
                    {isLoggedIn && (
                      <button
                        disabled={product.quantity === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (product.quantity === 0) return;
                          handleAddToCart(product);
                        }}
                        className={`w-full py-2 rounded ${
                          product.quantity > 0
                            ? "bg-blue-900 text-white hover:bg-blue-800"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
      </div>

      {paginatedProducts.length < filteredProducts.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-3 bg-blue-900 text-white rounded hover:bg-blue-800"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;