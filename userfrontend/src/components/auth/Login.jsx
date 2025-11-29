import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API = "http://localhost:5000/api/v1/user";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNo: "",
    gender: "",
    dob: "",
    birthTime: "",
    birthPlace: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login`, {
        email: formData.email,
        password: formData.password,
      });

      alert("Login successful");
      console.log(res.data);
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/register`, formData);
      alert("Registration successful");
      console.log(res.data);
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-black px-4 pt-17'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-3xl bg-[#0c0c0c]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.6)]'
      >
        {/* Heading */}
        <motion.h1
          key={isLogin ? "login-title" : "register-title"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-3xl font-bold text-center text-white mb-10'
        >
          {isLogin ? "Welcome Back " : "Create an Account "}
        </motion.h1>

        {/* Animated Form Switching */}
        <AnimatePresence mode='wait'>
          {isLogin ? (
   // login form
            <motion.form
              key='login-form'
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleLogin}
            >
              <Input
                name='email'
                placeholder='Email'
                type='email'
                onChange={handleChange}
              />

              <Input
                name='password'
                placeholder='Password'
                type='password'
                onChange={handleChange}
              />

              <SubmitButton label='Login' color='blue' />

              <div className='text-center mt-4 mb-3'>
                <a
                  href='/forgot-password'
                  className='text-blue-400 hover:underline'
                >
                  Forgot password?
                </a>
              </div>
            </motion.form>
          ) : (
       // register form
            <motion.form
              key='register-form'
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleRegister}
            >
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  name='firstName'
                  placeholder='First Name'
                  onChange={handleChange}
                />
                <Input
                  name='lastName'
                  placeholder='Last Name'
                  onChange={handleChange}
                />

                <Input
                  name='email'
                  placeholder='Email'
                  type='email'
                  onChange={handleChange}
                />

                <Input
                  name='phoneNo'
                  placeholder='Phone Number'
                  onChange={handleChange}
                />

                <Input
                  name='password'
                  placeholder='Password'
                  type='password'
                  onChange={handleChange}
                />

                <select
                  name='gender'
                  className='p-3 bg-black border border-gray-700 rounded-lg mt-4 text-gray-400 focus:border-green-500 outline-none'
                  onChange={handleChange}
                >
                  <option value=''>Gender</option>
                  <option className='text-white'>Male</option>
                  <option className='text-white'>Female</option>
                  <option className='text-white'>Other</option>
                </select>

                <Input name='dob' type='date' onChange={handleChange} />
                <Input name='birthTime' type='time' onChange={handleChange} />
                <Input
                  name='birthPlace'
                  placeholder='Birth Place'
                  onChange={handleChange}
                />
              </div>

              <SubmitButton label='Register' color='green' />
            </motion.form>
          )}
        </AnimatePresence>

        {/* Already Registered / Login */}
        <div className='text-center mt-8'>
          {isLogin ? (
            <p className='text-gray-400 text-sm'>
              New to Tarot Reader?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className='text-blue-400 hover:underline'
              >
                Create an account
              </button>
            </p>
          ) : (
            <p className='text-gray-400 text-sm'>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className='text-green-400 hover:underline'
              >
                Login here
              </button>
            </p>
          )}
        </div>
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
      className='w-full p-3 mt-4 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none'
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
