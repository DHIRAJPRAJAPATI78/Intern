import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginAdmin,
  verifyAdminOtp,
  resendAdminOtp,
} from "../../features/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.admin);

  const [step, setStep] = useState("login"); // login | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpRefs = useRef([]);

  // ---------------- LOGIN ----------------
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginAdmin({ email, password })).then((res) => {
      if (res.payload?.step === "verify-otp") setStep("otp");
    });
  };

  // ---------------- OTP ----------------
  const handleOtpChange = (e, idx) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return; // only allow digits 0-9

    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);

    // move focus only if current box is filled and previous boxes are filled
    if (
      val &&
      idx < otp.length - 1 &&
      otp.slice(0, idx).every((v) => v !== "")
    ) {
      otpRefs.current[idx + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[idx] = "";
      setOtp(newOtp);
      if (idx > 0) otpRefs.current[idx - 1].focus();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      otpRefs.current[idx - 1].focus();
    } else if (e.key === "ArrowRight" && idx < otp.length - 1) {
      otpRefs.current[idx + 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").trim().slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return; // only allow digits
    const newOtp = pasteData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    newOtp.forEach((_, idx) => otpRefs.current[idx]?.focus());
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) {
      alert("Please fill all OTP fields");
      return;
    }
    const otpCode = otp.join("");
    dispatch(verifyAdminOtp({ email, otp: otpCode }));
  };

  const handleResend = () => {
    dispatch(resendAdminOtp({ email }));
    setOtp(Array(6).fill(""));
    otpRefs.current[0].focus();
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-black px-4'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-md bg-gray-900 rounded-3xl shadow-xl p-8 text-white'
      >
        <AnimatePresence>
          {step === "login" && (
            <motion.div
              key='login'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className='text-3xl font-bold mb-6 text-center'>
                Admin Login
              </h2>

              {loading && <p className='text-blue-400'>Sending OTP...</p>}
              {error && <p className='text-red-500'>{error}</p>}
              {message && <p className='text-green-400'>{message}</p>}

              <form onSubmit={handleLogin} className='flex flex-col gap-4'>
                <input
                  type='email'
                  placeholder='Email'
                  className='p-4 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type='password'
                  placeholder='Password'
                  className='p-4 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type='submit'
                  disabled={loading}
                  className='bg-purple-600 p-4 rounded-lg font-semibold hover:bg-purple-700 transition'
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </motion.button>
                <Link
                  to='/admin/forgot-password'
                  className='text-sm text-blue-400 mt-2 underline hover:text-blue-500'
                >
                  Forgot Password
                </Link>
              </form>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key='otp'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className='text-3xl font-bold mb-4 text-center'>Enter OTP</h2>
              <p className='text-center mb-6 text-gray-400'>
                OTP sent to <span className='font-medium'>{email}</span>
              </p>

              {loading && <p className='text-blue-400 mb-2'>Verifying...</p>}
              {error && <p className='text-red-500 mb-2'>{error}</p>}
              {message && <p className='text-green-400 mb-2'>{message}</p>}

              <form
                onSubmit={handleVerify}
                className='flex flex-col items-center gap-6'
              >
                <div className='flex gap-3 justify-center'>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type='text'
                      maxLength='1'
                      className='w-14 h-14 text-center text-2xl font-mono rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500'
                      value={digit}
                      onChange={(e) => handleOtpChange(e, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      onPaste={handleOtpPaste}
                      ref={(el) => (otpRefs.current[idx] = el)}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type='submit'
                  disabled={loading}
                  className='bg-purple-600 p-4 rounded-lg font-semibold hover:bg-purple-700 transition w-full'
                >
                  Verify OTP
                </motion.button>
              </form>

              <button
                onClick={handleResend}
                className='mt-4 text-sm text-blue-400 underline hover:text-blue-500'
              >
                Resend OTP
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
