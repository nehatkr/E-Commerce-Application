import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0f172a] to-[#020617] text-gray-300 pt-14 w-full relative z-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
           NovaShop
          </h2>
          <p className="text-sm leading-relaxed">
            Your destination for premium quality clothing and fashion.
          </p>

          <div className="flex gap-4 mt-5">
            <span className="p-2 bg-slate-800 rounded-full cursor-pointer hover:bg-slate-700">
              <FaFacebookF />
            </span>
            <span className="p-2 bg-slate-800 rounded-full cursor-pointer hover:bg-slate-700">
              <FaInstagram />
            </span>
            <span className="p-2 bg-slate-800 rounded-full cursor-pointer hover:bg-slate-700">
              <FaTwitter />
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Shop</li>
            <li className="hover:text-white cursor-pointer">Collections</li>
            <li className="hover:text-white cursor-pointer">New Arrivals</li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">Shipping Policy</li>
            <li className="hover:text-white cursor-pointer">
              Returns & Exchanges
            </li>
            <li className="hover:text-white cursor-pointer">FAQs</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Contact Info
          </h3>
          <ul className="space-y-3 text-sm">
            <li>📍 123 Fashion Street, NY 10001</li>
            <li>📞 +1 (555) 123-4567</li>
            <li>✉️ support@stylehub.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 mt-12 py-6 text-center text-sm text-gray-400">
        © 2025 StyleHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
