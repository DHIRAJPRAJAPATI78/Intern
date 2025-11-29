import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  updateUserProfile,
  clearUserError,
  clearUserMessage,
} from "../../features/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, profile, loading, error, message } = useSelector(
    (state) => state.user
  );

  const userId = user?._id; 

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    email: "",
    gender: "",
    dob: "",
    birthTime: "",
    birthPlace: "",
  });

  // Fetch user profile on mount
  useEffect(() => {
    if (userId) {
      dispatch(getUserProfile(userId));
    }
  }, [userId]);

  // Update local form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phoneNo: profile.phoneNo || "",
        email: profile.email || "",
        gender: profile.gender || "",
        dob: profile.dob || "",
        birthTime: profile.birthTime || "",
        birthPlace: profile.birthPlace || "",
      });
    }
  }, [profile]);

  // Clear messages
  useEffect(() => {
    if (message) {
      setTimeout(() => dispatch(clearUserMessage()), 2500);
    }
    if (error) {
      setTimeout(() => dispatch(clearUserError()), 2500);
    }
  }, [message, error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ id: userId, data: formData }));
  };

//   if (!userId) {
//     return <p className="text-center mt-10">Please login to view profile.</p>;
//   }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      {loading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="border p-2 rounded"
          value={formData.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="border p-2 rounded"
          value={formData.lastName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phoneNo"
          placeholder="Phone Number"
          className="border p-2 rounded"
          value={formData.phoneNo}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={formData.email}
          onChange={handleChange}
        />

        <select
          name="gender"
          className="border p-2 rounded"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label className="text-sm font-medium">Date of Birth</label>
        <input
          type="date"
          name="dob"
          className="border p-2 rounded"
          value={formData.dob}
          onChange={handleChange}
        />

        <label className="text-sm font-medium">Birth Time</label>
        <input
          type="time"
          name="birthTime"
          className="border p-2 rounded"
          value={formData.birthTime}
          onChange={handleChange}
        />

        <input
          type="text"
          name="birthPlace"
          placeholder="Birth Place"
          className="border p-2 rounded"
          value={formData.birthPlace}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded mt-2 disabled:bg-blue-300"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
