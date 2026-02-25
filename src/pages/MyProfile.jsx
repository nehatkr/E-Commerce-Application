import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Camera, Plus, Trash2 } from "lucide-react";
import { BASE_URL } from "../utils/constants";

const MyProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role?.toLowerCase();

  /* ================= STATE ================= */

  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [profile, setProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    email: "",
    shopName: "",
    website: "",
    gstNumber: "",
  });

  const [addresses, setAddresses] = useState([]);

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    if (!user?.id) return;

    const url =
      role === "vendor"
        ? `${BASE_URL}/api/vendors/${user.id}`
        : `${BASE_URL}/api/users/${user.id}`;

    axios
      .get(url)
      .then((res) => {
        const data = res.data;

        setProfile({
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          gender: data.gender || "",
          email: data.email || "",
          shopName: data.shopName || "",
          website: data.website || "",
          gstNumber: data.gstNumber || "",
        });

        setAddresses([
          {
            address1: data.permanentAddress || "",
            address2: data.shopAddress || "",
            address3: "",
            pincode: data.pinCode || "",
            phone: data.phoneNo || "",
          },
        ]);

        if (data.profileImage) setProfileImage(data.profileImage);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user, role]);


  /* ================= ADDRESS ================= */

const addAddress = () => {
  setAddresses([
    ...addresses, // keep existing cards
    {
      address1: "",
      address2: "",
      address3: "",
      pincode: "",
      phone: "",
    },
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

  /* ================= SAVE ================= */

 const handleSave = async () => {
  const addr = addresses[0] || {};
   const formData = new FormData();

  const payload = {
    ...profile,
    permanentAddress: addr.address1,
    shopAddress: addr.address2,
    pinCode: addr.pincode,
    phoneNo: addr.phone,
  };

    // image
  if (selectedFile) {
    formData.append("profileImage", selectedFile);
  }

  const url =
    role === "vendor"
      ? `${BASE_URL}/api/vendors/update/${user.id}`
      : `${BASE_URL}/api/users/update/${user.id}`;

  try {
    await axios.put(url, payload);
    alert("Profile updated successfully ✅");
  } catch (err) {
    console.error(err);
    alert("Failed to update profile ❌");
  }
};


console.log("Selected file:", selectedFile);
  if (loading) return <p className="text-center mt-20">Loading profile...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 mt-16">
      <h1 className="text-3xl font-bold mb-10">My Profile</h1>

      <div className="bg-white rounded-2xl shadow p-8 space-y-10"> 

        {/* ================= PERSONAL DETAILS ================= */}
        <Section title="Personal Details">
          <Input
            label="First Name"
            value={profile.firstName}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
          <Input
            label="Middle Name"
            value={profile.middleName}
            onChange={(e) =>
              setProfile({ ...profile, middleName: e.target.value })
            }
          />
          <Input
            label="Last Name"
            value={profile.lastName}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
          <Input
            label="Gender"
            value={profile.gender}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
          />
          <ReadOnly label="Email" value={profile.email} />
        </Section>

        {/* ================= VENDOR ================= */}
        {role === "vendor" && (
          <Section title="Business Details">
            <Input
              label="Shop Name"
              value={profile.shopName}
              onChange={(e) =>
                setProfile({ ...profile, shopName: e.target.value })
              }
            />
            <Input
              label="Website URL"
              value={profile.website}
              onChange={(e) =>
                setProfile({ ...profile, website: e.target.value })
              }
            />
            <ReadOnly label="GST Number" value={profile.gstNumber} />
          </Section>
        )}

        {/* ================= ADDRESSES ================= */}
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
        <button
          onClick={handleSave}
          className="w-full md:w-60 bg-black text-white py-3 rounded-xl"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

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
