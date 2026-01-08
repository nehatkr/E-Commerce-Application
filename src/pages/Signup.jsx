import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    email: "",
    address1: "",
    address2: "",
    address3: "",
    pincode: "",
    phone: "",
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
    if (!phoneRegex.test(formData.phone))
      tempErrors.phone = "Invalid 10-digit Phone";
    if (!formData.password || formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 chars";
    if (passwordRegex.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Account Created Successfully! Please Login.");
      navigate("/login");
    }
  };

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
            name="address1"
            placeholder="Address Line 1"
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            name="address2"
            placeholder="Address Line 2"
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="address3"
            placeholder="Address Line 3"
            onChange={handleChange}
            className="input-field"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="pincode"
              placeholder="Pin Code"
              onChange={handleChange}
              className="input-field"
              required
            />
            <input
              name="phone"
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
            className="w-full py-3 bg-gray-900 text-white rounded hover:bg-gray-800 font-bold transform transition-transform duration-75 active:scale-95"
          >
            Sign Up
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
