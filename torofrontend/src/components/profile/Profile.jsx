import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateExpertProfile,
  clearExpertError,
  clearExpertMessage,
} from "../../features/authSlice";

const ExpertProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, message } = useSelector(
    (state) => state.expert
  );

  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    email: "",
    bio: "",
    skills: "",
    experience: "",
    language: "",
    gender: "",
    expertise: "",
    preferredCardType: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [certificates, setCertificates] = useState([]);


  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phoneNo: profile.phoneNo || "",
        email: profile.email || "",
        bio: profile.bio || "",
        skills: (profile.skills || []).join(", "),
        experience: profile.experience || "",
        language: profile.language || "",
        gender: profile.gender || "",
        expertise: (profile.expertise || []).join(", "),
        preferredCardType: profile.preferredCardType || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (message) setTimeout(() => dispatch(clearExpertMessage()), 2000);
    if (error) setTimeout(() => dispatch(clearExpertError()), 2000);
  }, [message, error]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(formData).forEach((key) => fd.append(key, formData[key]));

    if (profilePic) fd.append("profilePic", profilePic);
    if (certificates.length > 0)
      for (let file of certificates) fd.append("certificates", file);

    dispatch(updateExpertProfile(fd));
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-2xl mx-auto backdrop-blur-lg bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10">

        <h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Expert Profile
        </h2>

        {loading && <p className="text-blue-400 text-center">Loading...</p>}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {message && <p className="text-green-400 text-center">{message}</p>}

        <form onSubmit={handleUpdate} className="space-y-5">

          {/* INPUT COMPONENT */}
          {[
            { name: "name", placeholder: "Full Name" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "phoneNo", placeholder: "Phone Number" },
            { name: "skills", placeholder: "Skills (comma separated)" },
            { name: "experience", type: "number", placeholder: "Experience (years)" },
            { name: "language", placeholder: "Language" },
            { name: "expertise", placeholder: "Expertise (comma separated)" },
            { name: "preferredCardType", placeholder: "Preferred Card Type" },
          ].map((input) => (
            <input
              key={input.name}
              type={input.type || "text"}
              name={input.name}
              placeholder={input.placeholder}
              value={formData[input.name]}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}

          {/* BIO */}
          <textarea
            name="bio"
            value={formData.bio}
            placeholder="Write your bio..."
            rows={3}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* GENDER */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Gender</option>
            <option className="bg-black" value="male">Male</option>
            <option className="bg-black" value="female">Female</option>
            <option className="bg-black" value="other">Other</option>
          </select>

          {/* PROFILE PICTURE */}
          <label className="text-gray-300 font-medium">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="block w-full text-gray-300"
          />

          {profile?.profilePic && (
            <img
              src={profile.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full border border-white/20 object-cover mt-2"
            />
          )}

          {/* CERTIFICATES */}
          <label className="text-gray-300 font-medium">Certificates (Images / PDF)</label>
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={(e) => setCertificates(e.target.files)}
            className="block w-full text-gray-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-purple-600 to-blue-600 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ExpertProfile;
