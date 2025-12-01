import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  // forgotPassword,
  // clearUserError,
  // clearUserMessage,
} from "../../features/authSlice";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  useEffect(() => {
    if (message) setTimeout(() => dispatch(clearUserMessage()), 2000);
    if (error) setTimeout(() => dispatch(clearUserError()), 2000);
  }, [message, error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-zinc-900/80 backdrop-blur-md border border-zinc-700"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-5">
          Forgot Password
        </h2>

        {/* Animated Messages */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 bg-red-500/10 border border-red-600/30 p-2 rounded-md mb-3 text-center"
          >
            {error}
          </motion.p>
        )}

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 bg-green-500/10 border border-green-600/30 p-2 rounded-md mb-3 text-center"
          >
            {message}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            className="w-full bg-black/40 border border-zinc-700 text-white placeholder-gray-400 p-3 rounded-lg focus:border-purple-500 outline-none transition"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition disabled:bg-purple-400"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
