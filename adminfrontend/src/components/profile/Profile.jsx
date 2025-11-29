import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminProfile,
  updateAdminProfile,
  clearAdminError,
  clearAdminMessage,
} from "../../features/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { admin, profile, loading, error, message } = useSelector(
    (state) => state.admin
  );

  const adminId = admin?._id;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    email: "",
    gender: "",
  });

  // Fetch admin profile on mount
  useEffect(() => {
    if (adminId) {
      dispatch(getAdminProfile());
    }
  }, [adminId]);

  // Update local form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phoneNo: profile.phoneNo || "",
        email: profile.email || "",
        gender: profile.gender || "",
      });
    }
  }, [profile]);

  // Clear messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => dispatch(clearAdminMessage()), 2500);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => dispatch(clearAdminError()), 2500);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateAdminProfile(formData));
  };

  // if (!adminId) {
  //   return <p className="text-center mt-10">Please login as admin to view profile.</p>;
  // }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-800 shadow-lg rounded-xl text-white">
      <h2 className="text-2xl font-semibold mb-4">Admin Profile</h2>

      {loading && <p className="text-blue-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {message && <p className="text-green-400">{message}</p>}

      <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="border p-2 rounded bg-gray-700 text-white"
          value={formData.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="border p-2 rounded bg-gray-700 text-white"
          value={formData.lastName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phoneNo"
          placeholder="Phone Number"
          className="border p-2 rounded bg-gray-700 text-white"
          value={formData.phoneNo}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 rounded bg-gray-700 text-white"
          value={formData.email}
          onChange={handleChange}
        />

        <select
          name="gender"
          className="border p-2 rounded bg-gray-700 text-white"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white py-2 rounded mt-2 disabled:bg-purple-400"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
