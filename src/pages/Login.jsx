import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await axios.post(
      "https://intern-app-ecommerce.onrender.com/api/auth/login",
      { email, password, role }
    );

    const user = response.data;
    console.log("Respo: ", response.data)

    const normalizedUser = {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      role: user?.role?.toLowerCase(),
    };

    dispatch(login(normalizedUser));

    if (normalizedUser.role === "vendor") {
      navigate("/inventory");
    } else {
      navigate("/");
    }

  } catch (err) {
  console.error(err);

  if (err.response) {
    setError(err.response?.data?.message || "Invalid credentials");
  } else if (err.request) {
    setError("Server not reachable. Please try again later.");
  } else {
    setError("Something went wrong.");
  }
}
};


  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center mt-10">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Login As
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="user">User</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md text-white bg-blue-900 hover:bg-blue-800"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">
            New User?{" "}
            <Link to="/signup" className="text-blue-600 font-medium">
              User Sign Up
            </Link>
          </p>

          <p className="text-sm text-gray-600">
            Want to sell?{" "}
            <Link to="/admin/signup" className="text-blue-600 font-medium">
              Vendor Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
