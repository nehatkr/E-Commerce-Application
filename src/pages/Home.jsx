import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const role = user?.role;

  const categories = [
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
  ];

  const slides = [
    "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
    "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
    "https://images.pexels.com/photos/3965548/pexels-photo-3965548.jpeg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* 🔥 ENHANCED HERO SECTION */}
      <section className="relative h-150 flex items-center overflow-hidden">
        {/* Slide Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide]})` }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-black bg-opacity-40" />

        {/* Floating Decorative Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[15%] text-white/20 hidden md:block"
        >
          <Sparkles size={120} />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-6 text-white w-full">
          {/* Animated Text Reveal */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              Shop Fast. <span className="text-gray-300">Shop Nova.</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-100"
          >
            Explore our curated collection of premium fashion for everyone
          </motion.p>

          {/* Button Group with Staggered Slide */}
          <div className="flex gap-4 flex-wrap">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                {/* Your existing logic for buttons remains here */}
                {!isLoggedIn ? (
                  <button
                    onClick={() =>
                      navigate(i === 1 ? "/signup" : "/admin/signup")
                    }
                    className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all active:scale-90 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  >
                    {i === 1 ? "User Signup" : "Vendor Signup"}
                  </button>
                ) : (
                  i === 1 && (
                    <button
                      onClick={() => navigate("/products")}
                      className="bg-white text-black px-8 py-4 rounded-lg font-semibold flex items-center gap-2"
                    >
                      Shop Now <ArrowRight />
                    </button>
                  )
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📦 ANIMATED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-8"
        >
          Shop by Category
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative h-48 rounded-xl overflow-hidden cursor-pointer group shadow-lg"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">{cat.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    {/* 📞 GET IN TOUCH SECTION */}
<section className="bg-[#f3f6e6] mt-12 overflow-hidden font-sans">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch">
    
    {/* FORM SIDE */}
    <div className="w-full md:w-1/2 p-10 lg:p-20 flex flex-col justify-center">
      
      {/* HEADING */}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
        Get in Touch
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-600 mb-10 text-base leading-relaxed">
        Have a question or need assistance? Reach out—we're here to help
        you find the perfect accessory!
      </p>

      {/* FORM */}
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        
        {/* NAME */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-800">
              First Name *
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 outline-none focus:border-black"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-800">
              Last Name *
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 outline-none focus:border-black"
              required
            />
          </div>
        </div>

        {/* EMAIL + PHONE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-800">
              Email *
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 outline-none focus:border-black"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-800">
              Phone
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 outline-none focus:border-black"
            />
          </div>
        </div>

        {/* MESSAGE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-800">
            Message *
          </label>
          <textarea
            rows="3"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 outline-none focus:border-black resize-none"
            required
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md font-semibold text-base hover:bg-gray-900 transition"
        >
          Submit
        </button>
      </form>
    </div>

    {/* IMAGE SIDE */}
    <div className="w-full md:w-1/2 min-h-[500px]">
      <img
        src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"
        alt="Handbag Accessory"
        className="w-full h-full object-cover"
      />
    </div>

  </div>
</section>

    </div>
  );
};

export default Home;
