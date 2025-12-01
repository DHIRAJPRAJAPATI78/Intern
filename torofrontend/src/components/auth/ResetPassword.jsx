import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeExpertPassword,
  clearExpertError,
  clearExpertMessage,
} from "../../features/authSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const { loading, expert, error, message } = useSelector(
    (state) => state.expert
  );

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!expert?._id) {
      alert("Login required");
      return;
    }

    dispatch(
      changeExpertPassword({
        expertId: expert._id,
        oldPassword,
        newPassword,
      })
    );
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(clearExpertMessage());
        setOldPassword("");
        setNewPassword("");
      }, 2000);
    }

    if (error) {
      setTimeout(() => dispatch(clearExpertError()), 2000);
    }
  }, [message, error]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow bg-white rounded">
      <h2 className="text-xl font-bold mb-3">Change Password</h2>

      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <form onSubmit={handleSubmit}>

        <input
          type="password"
          className="w-full border p-2 rounded mb-4"
          placeholder="Old password..."
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full border p-2 rounded mb-4"
          placeholder="New password..."
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-blue-300"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
