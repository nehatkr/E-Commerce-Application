import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const role = user?.role;

  const handleShopNow = () => {
    if (isLoggedIn) {
      navigate("/products");
    }
  };

  /* ================= SMALL CARD AUTO SLIDER ================= */
  const products = [
    {
      name: "White T-shirt",
      price: "1499",
      img: "https://hips.hearstapps.com/hmg-prod/images/mhl-052224-hanes-1264-socialindex-6661f22b2f322.jpg?crop=0.412xw:0.824xh;0.301xw,0&resize=1120:*",
    },
    {
      name: "Dress",
      price: "4,999",
      img: "https://i.etsystatic.com/26357678/r/il/b809ef/6986025556/il_fullxfull.6986025556_eyg3.jpg",
    },
    {
      name: "Kurti",
      price: "999",
      img: "https://www.vasangini.com/wp-content/uploads/2022/10/Lucknowi-Chikankari-Ombre-Kurti-Womens-Kurta-Opal-M-24.webp",
    },
    {
      name: "Autumn Hoodie",
      price: "2,450",
      img: "https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg",
    },
    {
      name: "Winter Jacket",
      price: "1,500",
      img: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
    },
    {
      name: "Casual Knitwear",
      price: "899",
      img: "https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg",
    },
    {
      name: "Black T-shirt",
      price: "799",
      img: "https://thalasiknitfab.com/cdn/shop/files/WhatsApp_Image_2024-08-25_at_1.03.06_PM_3_490x.progressive.jpg?v=1724572530",
    },
  ];

  /* ================= TEXT ANIMATION VARIANTS ================= */
  const textContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  const textItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div
        className="relative min-h-[95vh] bg-cover bg-center flex items-center overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg)",
        }}
      >
        <div className="absolute inset-0 bg-[#f5f2ed]/80 backdrop-blur-[1px]" />

        <div className="relative max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ================= HERO TEXT ================= */}
          <motion.div
            variants={textContainer}
            initial="hidden"
            animate="show"
            className="max-w-xl"
          >
            <motion.p
              initial={{ opacity: 0, y: -10, letterSpacing: "0.3em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.15em" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="uppercase tracking-widest text-sm text-gray-700 mb-6"
            >
              Move Comfortably • Live Freely • Feel Confident
            </motion.p>

            {/* Heading */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                className="text-[64px] md:text-[96px] font-black leading-[0.95] text-black"
              >
                PURE
              </motion.h1>
            </div>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                className="text-[64px] md:text-[96px] font-black leading-[0.95] text-black mb-6"
              >
                COMFORT
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="text-gray-700 text-lg pb-5"
            >
              Designed for everyday movement. Soft fabrics, relaxed fits, and
              effortless comfort.
            </motion.p>

            <motion.div variants={textItem} className="flex gap-4 flex-wrap">
              {!isLoggedIn && (
                <>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-8 py-4 rounded-full font-semibold text-sm tracking-wide
                    bg-black text-white hover:bg-gray-900 transition active:scale-95"
                  >
                    User Signup
                  </button>

                  <button
                    onClick={() => navigate("/admin/signup")}
                    className="px-8 py-4 rounded-full font-semibold text-sm tracking-wide
                    border border-black text-black hover:bg-black hover:text-white transition active:scale-95"
                  >
                    Vendor Signup
                  </button>
                </>
              )}

              {isLoggedIn && role === "user" && (
                <button
                  onClick={handleShopNow}
                  className="px-10 py-4 rounded-full font-semibold text-sm tracking-wide
                  bg-black text-white hover:bg-gray-900 transition flex items-center gap-2 active:scale-95"
                >
                  Shop Now <ArrowRight size={18} />
                </button>
              )}

              {isLoggedIn && role === "vendor" && (
                <button
                  onClick={() => navigate("/inventory")}
                  className="px-10 py-4 rounded-full font-semibold text-sm tracking-wide
                  bg-black text-white hover:bg-gray-900 transition active:scale-95"
                >
                  Inventory Management
                </button>
              )}
            </motion.div>
          </motion.div>

          {/* ================= BIG SLIDING PRODUCT CARD ================= */}
          <div className="relative hidden lg:block pt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 80, rotate: 8 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  rotate: 4,
                  y: [0, -12, 0], // floating effect
                }}
                exit={{ opacity: 0, x: -80 }}
                transition={{
                  duration: 0.8,
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="bg-white rounded-[40px] shadow-2xl p-6 w-[360px]"
              >
                <img
                  src={products[index].img}
                  alt={products[index].name}
                  className="rounded-[30px] h-[460px] w-full object-cover mb-6"
                />

                <div className="flex justify-between items-center px-2">
                  <span className="text-lg font-semibold">
                    {products[index].name}
                  </span>
                  <span className="text-gray-500 text-lg">
                    {products[index].price}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ================= CATEGORY SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
              className="relative h-60 rounded-3xl overflow-hidden cursor-pointer group"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold tracking-wide">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= GET IN TOUCH ================= */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#f7f7f7] rounded-3xl overflow-hidden shadow-sm">
            {/* Form */}
            <div className="p-10 md:p-14">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-10">
                Have questions about our collections? Our team is here to help
                you find the perfect fit.
              </p>

              <form className="space-y-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200
                  focus:ring-2 focus:ring-black outline-none transition"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200
                  focus:ring-2 focus:ring-black outline-none transition"
                />
                <textarea
                  rows="4"
                  placeholder="Your Message"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200
                  focus:ring-2 focus:ring-black outline-none transition"
                />

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-xl font-semibold
                  hover:bg-gray-900 transition flex items-center justify-center gap-2"
                >
                  Send Message <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* Image */}
            <div className="hidden md:block">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
                alt="Contact"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
