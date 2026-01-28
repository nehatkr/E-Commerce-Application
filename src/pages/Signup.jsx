import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    email: "",
    addressL1: "",
    addressL2: "",
    addressL3: "",
    pinCode: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!formData.firstName) tempErrors.firstName = "First Name is required";
    if (!formData.lastName) tempErrors.lastName = "Last Name is required";
    if (!emailRegex.test(formData.email)) tempErrors.email = "Invalid Email";
    if (!phoneRegex.test(formData.phoneNumber))
      tempErrors.phoneNumber = "Invalid 10-digit Phone";
    if (!formData.password || formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 chars";
    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const payload = {
        firstName: formData.firstName,
        middleName: formData.middleName || "",
        lastName: formData.lastName,
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        addressL1: formData.addressL1,
        addressL2: formData.addressL2 || "",
        addressL3: formData.addressL3 || "",
        pinCode: formData.pinCode,
        phoneNumber: formData.phoneNumber,
        role: "user",
      };

      console.log("Signup Payload: ", payload);

      await axios.post(
        "https://intern-app-ecommerce-production.up.railway.app/api/users",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(
        login({
          firstName: payload.firstName,
          email: payload.email,
          role: "user",
        })
      );

      navigate("/");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Signup failed. Please check details.");
    }
  };

  {
    apiError && <p className="text-red-600 text-sm text-center">{apiError}</p>;
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create Account
        </h2>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First Name *"
              onChange={handleChange}
              className="input-field"
              required
            />
            <input
              name="middleName"
              placeholder="Middle Name"
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <input
            name="lastName"
            placeholder="Last Name *"
            onChange={handleChange}
            className="input-field"
          />
          <span className="text-red-500 text-xs">
            {errors.firstName || errors.lastName}
          </span>

          <select name="gender" onChange={handleChange} className="input-field">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Others</option>
          </select>

          <input
            name="email"
            placeholder="Email *"
            onChange={handleChange}
            className="input-field"
            required
          />
          <span className="text-red-500 text-xs">{errors.email}</span>

          <input
            name="addressL1"
            placeholder="Address Line 1"
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            name="addressL2"
            placeholder="Address Line 2"
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="addressL3"
            placeholder="Address Line 3"
            onChange={handleChange}
            className="input-field"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="pinCode"
              placeholder="Pin Code"
              onChange={handleChange}
              className="input-field"
              required
            />
            <input
              name="phoneNumber"
              placeholder="Phone Number *"
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <span className="text-red-500 text-xs">{errors.phone}</span>

          <input
            type="password"
            name="password"
            placeholder="Password *"
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password *"
            onChange={handleChange}
            className="input-field"
          />
          <span className="text-red-500 text-xs">
            {errors.password || errors.confirmPassword}
          </span>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded font-bold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="text-center mt-2">
            <Link to="/login" className="text-sm text-blue-600">
              Already have an account? Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
