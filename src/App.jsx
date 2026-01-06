import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import EditProducts from "./pages/EditProducts"; // ✅ NEW

// 🔐 Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn ? children : <Navigate to="/login" />;
};

/*
 🔮 FUTURE:
 You can later create:
 const AdminRoute = ({ children }) => {
   const { user } = useSelector(state => state.auth)
   return user?.role === "admin" ? children : <Navigate to="/" />
 }
*/

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden flex flex-col">
        <Navbar />

        <main className="grow">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* PROTECTED ROUTES */}
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

            {/* ✅ ADMIN / EDIT PRODUCTS */}
            <Route
              path="/admin/edit-products"
              element={
                <ProtectedRoute>
                  <EditProducts />
                </ProtectedRoute>
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
