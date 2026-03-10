import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import CartPage from "./pages/CartPage";
import MyProfile from "./pages/MyProfile";
import MyOrders from "./pages/myOrders";

// Vendor / Admin Pages
import Inventory from "./AdminDashboard/Inventory";
import AdminSignup from "./AdminDashboard/AdminSignup";
import EditProducts from "./AdminDashboard/EditProducts";
import VendorDashboard from "./AdminDashboard/Dashboard";
import VendorOrderTracker from "./AdminDashboard/VendorOrderTracker";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn ? children : <Navigate to="/login" />;
};

// Vendor Route
const VendorRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user?.role?.toLowerCase() === "vendor"
    ? children
    : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden flex flex-col">
        <Navbar />

        <main className="grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/signup" element={<AdminSignup />} />

            {/* Protected User Routes */}
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <ProductDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-success"
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/myOrders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />

            {/* Vendor Routes */}
            <Route
              path="/inventory"
              element={
                <VendorRoute>
                  <Inventory />
                </VendorRoute>
              }
            />

            <Route
              path="/vendor/dashboard"
              element={
                <VendorRoute>
                  <VendorDashboard />
                </VendorRoute>
              }
            />

            <Route
              path="/admin/edit-products"
              element={
                <VendorRoute>
                  <EditProducts />
                </VendorRoute>
              }
            />

            <Route
              path="/vendor/orderTracker"
              element={
                <VendorRoute>
                  <VendorOrderTracker vendorId={1} />
                </VendorRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;