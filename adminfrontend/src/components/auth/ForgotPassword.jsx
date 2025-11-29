import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotAdminPassword,
  resetAdminPasswordFromLink,
} from "../../features/authSlice";
import { useParams } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.admin);
  const { token } = useParams(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isReset = !!token; 

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotAdminPassword({ email }));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    dispatch(resetAdminPasswordFromLink({ token, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-gray-900 p-8 rounded-3xl shadow-2xl text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isReset ? "Reset Admin Password" : "Forgot Admin Password"}
        </h2>

        {loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-400 mb-2 text-center"
          >
            Processing...
          </motion.p>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-2 text-center"
          >
            {error}
          </motion.p>
        )}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 mb-2 text-center"
          >
            {message}
          </motion.p>
        )}

        {!isReset && (
          <motion.form
            onSubmit={handleForgotPassword}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Enter your admin email"
              className="p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-purple-700 p-4 rounded-xl font-semibold hover:bg-purple-800 transition shadow-md"
            >
              Send Reset Link
            </motion.button>
          </motion.form>
        )}

        {isReset && (
          <motion.form
            onSubmit={handleResetPassword}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-4"
          >
            <input
              type="password"
              placeholder="New Password"
              className="p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-purple-700 p-4 rounded-xl font-semibold hover:bg-purple-800 transition shadow-md"
            >
              Reset Password
            </motion.button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
