import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Package } from "lucide-react";
import { logout } from "../redux/authSlice";
import { FiHome, FiEdit, FiLogOut, FiGrid, FiBox, FiShoppingCart } from "react-icons/fi";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  const role = user?.role?.toLowerCase();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/") {
      setIsMenuOpen(false); // Home → closed
      setIsManualOpen(false);
    } else {
      setIsMenuOpen(true); // Other pages → open
      setIsManualOpen(false); // 👈 key fix
    }
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white shadow-md fixed top-0 w-full z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* LEFT */}
            <div className="flex items-center gap-4">
              {isLoggedIn && location.pathname !== "/" && (
                <button
                  onClick={() => {
                    setIsMenuOpen(true);
                    setIsManualOpen(true);
                  }}
                >
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
                  {role === "user" && (
                    <div className="relative">
                      <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 hover:bg-gray-200 px-3 py-1.5 rounded-full transition"
                      >
                        <User size={20} />
                        <span className="text-sm font-medium">
                          {user?.firstName}
                        </span>
                      </button>

                      {isProfileOpen && (
                        <div className="absolute left-0 mt-3 w-52 bg-black rounded-xl shadow-xl border border-white overflow-hidden animate-fade-in">
                          {/* Header */}
                          <div className="px-4 py-3 bg-gray-150 flex items-center gap-2">
                            <User size={18} className="text-white" />
                            <p className="text-sm font-semibold text-white">
                              {user?.firstName}
                            </p>
                          </div>

                          <div className="border-t">
                            <Link
                              to="/myOrders"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gray-900 transition"
                            >
                              🛒 My Orders
                            </Link>

                            <Link
                              to="/profile"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gray-900 transition"
                            >
                              👤 My Profile
                            </Link>
                            <button
                              onClick={() => {
                                dispatch(logout());
                                setIsProfileOpen(false);
                                navigate("/login");
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-gray-800 transition"
                            >
                              🚪 Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* vendor */}
                  {role === "vendor" && (
                    <div className="relative">
                      <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 hover:bg-gray-200 px-3 py-1.5 rounded-full transition"
                      >
                        <User size={20} />
                        <span className="text-sm font-medium">
                          {user?.firstName}
                        </span>
                      </button>

                      {isProfileOpen && (
                        <div className="absolute left-0 mt-3 w-52 bg-black rounded-xl shadow-xl border border-white overflow-hidden animate-fade-in">
                          {/* Header */}
                          <div className="px-4 py-3 bg-gray-150 flex items-center gap-2">
                            <User size={18} className="text-white" />
                            <p className="text-sm font-semibold text-white">
                              {user?.firstName}
                            </p>
                          </div>

                          <div className="border-t">
                            <Link
                              to="/profile"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gray-900 transition"
                            >
                              👤 My Profile
                            </Link>
                            <button
                              onClick={() => {
                                dispatch(logout());
                                setIsProfileOpen(false);
                                navigate("/login");
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-gray-800 transition"
                            >
                              🚪 Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                !isLoginPage && (
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-black text-white rounded"
                  >
                    Sign In
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      {/* SIDEBAR */}
      {isMenuOpen &&
        location.pathname !== "/" &&
        location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        location.pathname !== "/admin/signup" && (
          <aside className="fixed left-0 top-16 w-60 min-h-screen bg-white shadow-sm z-20">
            <div className="p-6 space-y-6 font-medium">
              <ul className="space-y-10 font-bold ">
                <li className="hover:text-gray-500 ">
                  <Link to="/">
                    <span className="flex items-center gap-2 ">
                      <FiEdit className="text-xl" />
                      Home
                    </span>
                  </Link>
                </li>
                <li className="hover:text-gray-500 ">
                  <Link
                    to="/myOrders">
                      <span className="flex items-center gap-2 ">
                      <FiShoppingCart className="text-xl" />
                      My Orders
                    </span>
                  </Link>
                </li>

                {role === "vendor" && (
                  <>
                    <li className="hover:text-gray-500">
                      <Link to="/vendor/dashboard">
                        {" "}
                        <span className="flex items-center gap-2">
                          <FiGrid className="text-xl" />
                          Dashboard
                        </span>
                      </Link>
                    </li>
                    <li className="hover:text-gray-500">
                      <Link to="/inventory">
                        <span className="flex items-center gap-2">
                          <FiBox size={26} className="text-xl" />
                          Inventory Management
                        </span>
                      </Link>
                    </li>
                    <li className="hover:text-gray-500">
                      <Link to="/admin/edit-products">
                        <span className="flex items-center gap-2">
                          <FiEdit className="text-xl" />
                          Edit Products
                        </span>
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-400"
                  >
                    <span className="flex items-center gap-2">
                      <FiLogOut size={25} />
                      Logout
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </aside>
        )}
    </>
  );
};

export default Navbar;
