import React, { useState, useMemo } from "react";
import productsData from "../data/products.json";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);


  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);

  // ✅ Category filtering (memoized)
 const filteredProducts = useMemo(() => {
  const allProducts = Array.isArray(productsData?.products)
    ? productsData.products
    : [];

  return selectedCategory === "all"
    ? allProducts
    : allProducts.filter(
        (product) => product.category === selectedCategory
      );
}, [productsData, selectedCategory]);


  // ✅ Pagination logic
  const paginatedProducts = filteredProducts.slice(
    0,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-16">
      {/* CATEGORY FILTER */}
      <div className="flex flex-wrap gap-4 mb-10">
        {["all", "men", "women", "kids", "accessories"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setPage(1); // reset pagination on category change
            }}
            className={`px-5 py-2 rounded-full font-medium transition ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            {/* IMAGE */}
            <img
              src={product.images.thumbnail}
              alt={product.name}
              className="h-64 w-full object-cover"
            />

            {/* CONTENT */}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>

              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {product.shortDescription}
              </p>

              {/* PRICE */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xl font-bold">
                  ${product.discountedPrice}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-sm line-through text-gray-400">
                    ${product.price}
                  </span>
                )}
              </div>

              {/* SIZES */}
              {Array.isArray(product.sizes) && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="border px-2 py-1 text-xs rounded"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}

              {/* ADD TO CART */}
              {isLoggedIn && product.addToCartEnabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 🚫 prevent navigation
                    dispatch(
                      addToCart({
                        id: product.id,
                        product_id: product.id,
                        name: product.name,
                        price: product.discountedPrice,
                        image_url: product.images.thumbnail,
                        quantity: 1,
                        size: product.sizes?.[0] || null,
                        color: product.colors?.[0] || null,
                      })
                    );
                  }}
                  className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* LOAD MORE BUTTON */}
      {paginatedProducts.length < filteredProducts.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
          >
            Load More
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-16">
          No products found for this category.
        </p>
      )}
    </div>
  );
};

export default Products;
