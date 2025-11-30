import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  clearUserError,
  clearUserMessage,
} from "../../features/authSlice";
import { toast } from "react-hot-toast";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { loading, user, error, message } = useSelector((state) => state.user);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Show Errors + Messages Through Toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearUserMessage());
    }
  }, [error, message]);

  // Submit Function
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.warning("All fields are required");
    }

    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    dispatch(
      changePassword({
        userId: user?.user?._id, // Adjust based on your login response
        oldPassword,
        newPassword,
      })
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old Password */}
          <div>
            <label className="block text-sm mb-1">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="Enter old password"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="Confirm new password"
            />
          </div>

          {/* Button */}
          <button
            disabled={loading}
            type="submit"
            className={`w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white font-semibold flex items-center justify-center gap-2 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
