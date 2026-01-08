import React from "react";
import { useSelector } from "react-redux";
import { ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const role = user?.role;

  const handleShopNow = () => {
    if (isLoggedIn) {
      navigate("/products");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-150 bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg)",
        }}
      >
        <div className="absolute inset-0 bg-opacity-40" />

        <div className="relative max-w-7xl mx-auto px-6 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Discover Your Style
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Explore our curated collection of premium fashion for everyone
          </p>

          {/* <button
            onClick={handleShopNow}
            className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition inline-flex items-center gap-2"
          >
            Shop Now
            <ArrowRight />
          </button> */}

          <div className="flex gap-4 flex-wrap">
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transform transition-transform duration-75 active:scale-95"
                >
                  User Signup
                </button>

                <button
                  onClick={() => navigate("/admin/signup")}
                  className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transform transition-transform duration-75 active:scale-95"
                >
                  Vendor Signup
                </button>
              </>
            )}

            {isLoggedIn && role === "user" && (
              <button
                onClick={handleShopNow}
                className="bg-white text-black px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transform transition-transform duration-75 active:scale-95"
              >
                Shop Now <ArrowRight />
              </button>
            )}

            {isLoggedIn && role === "vendor" && (
              <button
                onClick={() => navigate("/inventory")}
                className="bg-white text-black px-8 py-4 rounded-lg font-semibold transform transition-transform duration-75 active:scale-95 hover:bg-gray-200"
              >
                Inventory Management
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Men",
              img: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
            },
            {
              name: "Women",
              img: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
            },
            {
              name: "Kids",
              img: "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg",
            },
            {
              name: "Accessories",
              img: "https://images.pexels.com/photos/19090/pexels-photo.jpg",
            },
          ].map((cat) => (
            <div
              key={cat.name}
              className="relative h-48 rounded-xl overflow-hidden cursor-pointer group"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
                <h3 className="text-gray-900 text-2xl font-bold">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Aman Sharma",
                text: "Amazing quality and fast delivery. Loved the collection!",
              },
              {
                name: "Neha Verma",
                text: "The designs are trendy and prices are reasonable.",
              },
              {
                name: "Rahul Singh",
                text: "Customer support was very helpful. Highly recommended!",
              },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500" />
                  ))}
                </div>

                <p className="text-gray-700 mb-4">“{review.text}”</p>

                <h4 className="font-bold text-gray-900">{review.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
