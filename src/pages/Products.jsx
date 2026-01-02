import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, clearCart } from "../redux/cartSlice";

const Products = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.inventory);
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">All Products</h2>

        <button
          onClick={() => dispatch(clearCart())}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-60 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {product.description}
              </p>

              <div className="mt-2">
                <span className="text-lg font-bold">
                  ₹{product.discountedPrice}
                </span>
                {product.discount > 0 && (
                  <span className="line-through text-sm text-gray-400 ml-2">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="border text-xs px-2 py-1 rounded"
                  >
                    {size}
                  </span>
                ))}
              </div>

              <button
                onClick={() =>
                  dispatch(
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.discountedPrice,
                      image_url: product.image,
                      quantity: 1,
                    })
                  )
                }
                className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
