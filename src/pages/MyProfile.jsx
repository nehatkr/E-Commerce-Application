import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Camera, Plus, Trash2 } from "lucide-react";

const MyProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role?.toLowerCase();

  const [profileImage, setProfileImage] = useState(null);

  const [addresses, setAddresses] = useState([
    { address1: "", address2: "", address3: "", pincode: "", phone: "" },
  ]);

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  /* ---------------- ADDRESS HANDLERS ---------------- */
  const addAddress = () => {
    setAddresses([
      ...addresses,
      { address1: "", address2: "", address3: "", pincode: "", phone: "" },
    ]);
  };

  const removeAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const updateAddress = (index, field, value) => {
    const updated = [...addresses];
    updated[index][field] = value;
    setAddresses(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 mt-16">
      <h1 className="text-3xl font-bold mb-10">My Profile</h1>

      <div className="bg-white rounded-2xl shadow p-8 space-y-10">

        {/* ================= PROFILE IMAGE ================= */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={profileImage || "/avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border"
            />
            <label className="absolute bottom-0 right-0 bg-black p-2 rounded-full cursor-pointer">
              <Camera size={16} className="text-white" />
              <input type="file" hidden onChange={handleImageUpload} />
            </label>
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-500 capitalize">{role}</p>
          </div>
        </div>

        {/* ================= PERSONAL DETAILS ================= */}
        <Section title="Personal Details">
          <ReadOnly label="First Name" value={user?.firstName} />
          <ReadOnly label="Middle Name" value={user?.middleName || "-"} />
          <ReadOnly label="Last Name" value={user?.lastName} />
          <ReadOnly label="Gender" value={user?.gender} />
          <ReadOnly label="Email" value={user?.email} />
        </Section>

        {/* ================= VENDOR FIELDS ================= */}
        {role === "vendor" && (
          <Section title="Business Details">
            <ReadOnly label="Shop Name" value={user?.shopName || "-"} />
            <ReadOnly label="Website URL" value={user?.website || "-"} />
            <ReadOnly label="GST Number" value={user?.gstNumber || "-"} />
          </Section>
        )}

        {/* ================= ADDRESS ================= */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Addresses</h3>
            <button
              onClick={addAddress}
              className="flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded"
            >
              <Plus size={16} /> Add Address
            </button>
          </div>

          <div className="space-y-6">
            {addresses.map((addr, index) => (
              <div
                key={index}
                className="border rounded-xl p-6 relative bg-gray-50"
              >
                {addresses.length > 1 && (
                  <button
                    onClick={() => removeAddress(index)}
                    className="absolute top-4 right-4 text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Address Line 1"
                    value={addr.address1}
                    onChange={(e) =>
                      updateAddress(index, "address1", e.target.value)
                    }
                  />
                  <Input
                    label="Address Line 2"
                    value={addr.address2}
                    onChange={(e) =>
                      updateAddress(index, "address2", e.target.value)
                    }
                  />
                  <Input
                    label="Address Line 3"
                    value={addr.address3}
                    onChange={(e) =>
                      updateAddress(index, "address3", e.target.value)
                    }
                  />
                  <Input
                    label="Pin Code"
                    value={addr.pincode}
                    onChange={(e) =>
                      updateAddress(index, "pincode", e.target.value)
                    }
                  />
                  <Input
                    label="Phone Number"
                    value={addr.phone}
                    onChange={(e) =>
                      updateAddress(index, "phone", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SAVE ================= */}
        <button className="w-full md:w-60 bg-black text-white py-3 rounded-xl">
          Save Changes
        </button>
      </div>
    </div>
  );
};

/* ---------------- SMALL COMPONENTS ---------------- */

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

const ReadOnly = ({ label, value }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input
      disabled
      value={value}
      className="w-full mt-1 px-4 py-2 border rounded bg-gray-100"
    />
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input
      value={value}
      onChange={onChange}
      className="w-full mt-1 px-4 py-2 border rounded"
    />
  </div>
);

export default MyProfile;
