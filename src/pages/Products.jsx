import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../redux/productsSlice";
import ProductSkeleton from "./ProductSkeleton";

const ITEMS_PER_PAGE = 8;

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { items: products = [], loading } = useSelector(
    (state) => state.products
  );

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);

  // const getProductImageUrl = (productId) => {
  //   return `https://intern-app-ecommerce-production.up.railway.app/api/product/image/${productId}?index=0`;
  // };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const paginatedProducts = filteredProducts.slice(0, page * ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-16">
      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">Loading products...</p>
      )}

      {/* CATEGORY FILTER */}
      <div className="flex flex-wrap gap-4 mb-10">
        {["all", "men", "women", "kids", "accessories"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setPage(1);
            }}
            className={`px-5 py-2 rounded-full ${
              selectedCategory === cat ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow hover:shadow-xl cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <img
                  src={product.images?.[0]?.imageUrl}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = "/fallback.png";
                  }}
                  loading="lazy"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {product.shortDescription}
                  </p>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    Sizes available:
                    <span className="border px-2 py-1 text-xs rounded">
                      {product.sizes.join(" ,")}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <span className="text-xl font-bold">
                      ₹{product.discountedPrice}
                    </span>
                    <span className="line-through text-gray-400">
                      ₹{product.price}
                    </span>
                  </div>

                  {isLoggedIn && (
                    <button
                      disabled={product.quantity === 0}
                      onClick={(e) => {
                        e.stopPropagation();

                        if (product.quantity === 0) return;

                        dispatch(
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.discountPrice,
                            image: product.images?.[0]?.imageUrl,
                            description: product.description,
                          })
                        );
                      }}
                      className={`mt-4 w-full py-2 rounded ${
                        product.quantity > 0
                          ? "bg-black text-white"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  )}
                </div>
              </div>
            ))}
      </div>

      {/* LOAD MORE */}
      {paginatedProducts.length < filteredProducts.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-3 bg-black text-white rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
