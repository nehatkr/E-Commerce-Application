import React, { useState } from "react";

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    shopName: "",
    website: "",
    permanentAddress: "",
    shopAddress: "",
    pinCode: "",
    gstNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // 🔮 Future backend integration
    console.log("Admin/Vendor Signup Data:", formData);

    /*
      fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
    */
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 mt-16">
      <h2 className="text-3xl font-bold mb-8 text-center">
         Vendor Signup
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 space-y-6"
      >
        {/* PERSONAL INFO */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* BUSINESS INFO */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Business Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="shopName"
              placeholder="Shop Name"
              value={formData.shopName}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              name="website"
              placeholder="Website (optional)"
              value={formData.website}
              onChange={handleChange}
              className="input"
            />
            <input
              name="gstNumber"
              placeholder="GST Number"
              value={formData.gstNumber}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Address</h3>
          <div className="grid grid-cols-1 gap-4">
            <textarea
              name="permanentAddress"
              placeholder="Permanent Address"
              value={formData.permanentAddress}
              onChange={handleChange}
              className="input"
              rows={2}
              required
            />
            <textarea
              name="shopAddress"
              placeholder="Shop Address"
              value={formData.shopAddress}
              onChange={handleChange}
              className="input"
              rows={2}
              required
            />
            <input
              name="pinCode"
              placeholder="Pin Code"
              value={formData.pinCode}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Register as Vendor
        </button>
      </form>
    </div>
  );
};

export default AdminSignup;
