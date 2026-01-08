import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Inventory from "./AdminDashboard/Inventory";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

// Admin Pages
import AdminSignup from "./AdminDashboard/AdminSignup";
import EditProducts from "./AdminDashboard/EditProducts"; // Admin edit page

// 🔐 Protected Route (User login check)
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn ? children : <Navigate to="/login" />;
};

/*
 🔮 FUTURE ADMIN ROLE CHECK (backend ready)
 
 const AdminRoute = ({ children }) => {
   const { user } = useSelector((state) => state.auth);
   return user?.role === "admin"
     ? children
     : <Navigate to="/" />;
 };
*/

const VendorRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user?.role === "vendor" ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden flex flex-col">
        <Navbar />

        {/* MAIN CONTENT */}
        <main className="grow">
          <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ADMIN / VENDOR SIGNUP (PUBLIC) */}
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route
              path="/inventory"
              element={
                <VendorRoute>
                  <Inventory />
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

            {/* ================= PROTECTED USER ROUTES ================= */}
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />

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

            {/* ================= ADMIN ROUTES ================= */}
            <Route
              path="/admin/edit-products"
              element={
                <ProtectedRoute>
                  <EditProducts />
                </ProtectedRoute>
              }
            />

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
