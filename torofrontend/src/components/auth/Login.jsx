import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { loginExpert, registerExpert } from "../../features/authSlice.js";

export default function ExpertAuth() {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.expert);

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
    gender: "",
    language: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginExpert({ email: formData.email, password: formData.password }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerExpert(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 pt-17">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-[#0c0c0c]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
      >
        <motion.h1
          key={isLogin ? "login-title" : "register-title"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-white mb-10"
        >
          {isLogin ? "Expert Login" : "Expert Registration"}
        </motion.h1>

        <AnimatePresence mode="wait">
          {isLogin ? (
            /************ LOGIN FORM ************/
            <motion.form
              key="login-form"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleLogin}
            >
              <Input name="email" placeholder="Email" type="email" onChange={handleChange} />
              <Input name="password" placeholder="Password" type="password" onChange={handleChange} />

              <SubmitButton label={loading ? "Loading..." : "Login"} color="blue" />
            </motion.form>
          ) : (
            /************ REGISTER FORM ************/
            <motion.form
              key="register-form"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleRegister}
            >
              <div className="grid grid-cols-2 gap-4">
                <Input name="name" placeholder="Full Name" onChange={handleChange} />
                <Input name="email" type="email" placeholder="Email" onChange={handleChange} />

                <Input name="phoneNo" placeholder="Phone Number" onChange={handleChange} />
                <Input name="password" type="password" placeholder="Password" onChange={handleChange} />

                {/* Gender */}
                <select
                  name="gender"
                  className="p-3 bg-black border border-gray-700 rounded-lg mt-4 text-gray-400 focus:border-green-500 outline-none"
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option className="text-white">Male</option>
                  <option className="text-white">Female</option>
                  <option className="text-white">Other</option>
                </select>

                {/* Language */}
                <select
                  name="language"
                  className="p-3 bg-black border border-gray-700 rounded-lg mt-4 text-gray-400 focus:border-green-500 outline-none"
                  onChange={handleChange}
                >
                  <option value="">Select Language</option>
                  <option className="text-white">English</option>
                  <option className="text-white">Hindi</option>
                  <option className="text-white">Gujarati</option>
                  <option className="text-white">Marathi</option>
                </select>
              </div>

              <SubmitButton label={loading ? "Loading..." : "Register"} color="green" />
            </motion.form>
          )}
        </AnimatePresence>

        {/* Toggle */}
        <div className="text-center mt-8">
          {isLogin ? (
            <p className="text-gray-400 text-sm">
              New Expert?{" "}
              <button onClick={() => setIsLogin(false)} className="text-blue-400 hover:underline">
                Register here
              </button>
            </p>
          ) : (
            <p className="text-gray-400 text-sm">
              Already registered?{" "}
              <button onClick={() => setIsLogin(true)} className="text-green-400 hover:underline">
                Login here
              </button>
            </p>
          )}
        </div>

        {/* Error & Message */}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mt-4 text-center">{message}</p>}
      </motion.div>
    </div>
  );
}

function Input({ name, type = "text", placeholder, onChange }) {
  return (
    <motion.input
      whileFocus={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full p-3 mt-4 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none"
    />
  );
}

function SubmitButton({ label, color }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className={`w-full bg-${color}-600 py-3 rounded-lg text-white font-semibold mt-6 hover:bg-${color}-700 transition-all`}
    >
      {label}
    </motion.button>
  );
}
