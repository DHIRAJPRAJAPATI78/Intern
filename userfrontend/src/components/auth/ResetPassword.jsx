
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearUserError, clearUserMessage } from "../../features/authSlice";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { id, token } = useParams();
  const navigate = useNavigate();

  const { loading, error, message } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ id, token, password }));
  };

  // After success redirect to login
  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(clearUserMessage());
        navigate("/login");
      }, 2000);
    }

    if (error) {
      setTimeout(() => dispatch(clearUserError()), 2000);
    }
  }, [message, error]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow bg-white rounded">
      <h2 className="text-xl font-bold mb-3">Reset Password</h2>

      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="w-full border p-2 rounded mb-4"
          placeholder="New password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded disabled:bg-green-300"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
