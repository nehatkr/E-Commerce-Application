const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow p-4 animate-pulse">
      {/* Image */}
      <div className="h-64 w-full bg-gray-200 rounded-lg" />

      {/* Text */}
      <div className="mt-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />

        {/* Price */}
        <div className="h-5 bg-gray-200 rounded w-1/3 mt-4" />

        {/* Button */}
        <div className="h-10 bg-gray-300 rounded mt-4" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
