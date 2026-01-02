import React from "react";
import { useParams } from "react-router-dom";
import productsData from "../data/products.json";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const products = Array.isArray(productsData?.products)
    ? productsData.products
    : [];

  const product = products.find((p) => p.id === id);

  if (!product) {
    return <p className="mt-24 text-center">Product not found</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
    <div className="mt-24 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
      {/* IMAGE */}
      <img
        src={product.images.thumbnail}
        alt={product.name}
        className="w-full rounded-lg"
      />

      {/* DETAILS */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600 mt-2">
          {product.fullDescription}
        </p>

        <div className="mt-4">
          <span className="text-2xl font-bold">
            ${product.discountedPrice}
          </span>
          <span className="line-through text-gray-400 ml-2">
            ${product.price}
          </span>
        </div>

        {/* SIZES */}
        {Array.isArray(product.sizes) && (
          <div className="mt-4">
            <p className="font-semibold">Sizes</p>
            <div className="flex gap-2 mt-2">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="border px-3 py-1 rounded"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => dispatch(addToCart(product))}
          className="mt-6 bg-black text-white px-6 py-3 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
    </div>
  );
};

export default ProductDetails;
