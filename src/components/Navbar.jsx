import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Package } from "lucide-react";
import { logout } from "../redux/authSlice";
import CartModal from "../pages/CartModal";

const Navbar = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  const role = user?.role;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMenuOpen(false);
  };

  const openMenu = () => {
    setIsCartOpen(false);
    setIsMenuOpen(true);
  };

  const openCart = () => {
    setIsMenuOpen(false);
    setIsCartOpen(true);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white shadow-md fixed top-0 w-full z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <button onClick={openMenu}>
                <Menu size={24} />
              </button>

              <Link to="/" className="text-2xl font-bold">
                StyleHub
              </Link>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-6">
              {isLoggedIn ? (
                <>
                  {role === "vendor" && (
                    <Link to="/inventory">
                      <Package size={24} />
                    </Link>
                  )}

                  {/* CART ICON */}
                  <button
                    onClick={openCart}
                    className="relative"
                    aria-label="Open Cart"
                  >
                    <ShoppingCart size={24} />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {cartItems.length}
                      </span>
                    )}
                  </button>

                  {/* USER */}
                  <div className="flex items-center gap-2">
                    <User size={22} />
                    <span className="hidden md:block">{user?.firstName}</span>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative z-50 bg-white w-64 h-full p-4 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)}>
                <X />
              </button>
            </div>

            <ul className="space-y-6 font-bold">
              <li>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
              </li>

              {isLoggedIn ? (
                <>
                  {/* USER MENU */}
                  {user?.role === "user" && (
                    <>
                      <li>
                        <Link
                          to="/products"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Shop
                        </Link>
                      </li>
                    </>
                  )}
                  {/* VENDOR MENU */}
                  {user?.role === "vendor" && (
                    <>
                      <li>
                        <Link
                          to="/inventory"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Inventory Management
                        </Link>
                      </li>

                      <li className="text-gray-800 hover:text-gray-600 font-bold flex items-center gap-2" >
                        <Link
                          to="/admin/edit-products"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Edit Products
                        </Link>
                      </li>
                    </>
                  )}

                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-400"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Vendor Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* CART MODAL */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
