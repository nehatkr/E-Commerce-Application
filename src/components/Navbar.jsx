import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Package } from "lucide-react";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  const role = user?.role?.toLowerCase();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white shadow-md fixed top-0 w-full z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">

            {/* LEFT */}
            <div className="flex items-center gap-4">
              {isLoggedIn && (
                <button onClick={() => setIsMenuOpen(true)}>
                  <Menu size={24} />
                </button>
              )}

              <Link to="/" className="h-20 w-50">
                <img src="/logo.png" alt="logo" />
              </Link>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-6">
              {isLoggedIn ? (
                <>
                  {/* VENDOR INVENTORY ICON */}
                  {role === "vendor" && (
                    <Link to="/inventory">
                      <Package size={24} />
                    </Link>
                  )}

                  {/* CART ICON → CART PAGE */}
                  <button
                    onClick={() => navigate("/cart")}
                    className="relative"
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
                    <span className="hidden md:block">
                      {user?.firstName}
                    </span>
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
                  {role === "user" && (
                    <li>
                      <Link
                        to="/products"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Shop
                      </Link>
                    </li>
                  )}

                  {/* VENDOR MENU */}
                  {role === "vendor" && (
                    <>
                      <li>
                        <Link
                          to="/vendor/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/inventory"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Inventory Management
                        </Link>
                      </li>

                      <li>
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
    </>
  );
};

export default Navbar;
