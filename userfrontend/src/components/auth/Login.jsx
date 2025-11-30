import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  clearUserError,
  clearUserMessage,
} from "../../features/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.user);

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
      await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap()

      navigate("/profile");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

 
  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserError());
    }

    if (message) {
      toast.success(message);
      dispatch(clearUserMessage());
    }
  }, [error, message, dispatch]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-black px-4 pt-17'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-3xl bg-[#0c0c0c]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.6)]'
      >
        <motion.h1
          key={isLogin ? "login-title" : "register-title"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-3xl font-bold text-center text-white mb-10'
        >
          {isLogin ? "Welcome Back" : "Create an Account"}
        </motion.h1>

        <AnimatePresence mode='wait'>
          {isLogin ? (
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

              <SubmitButton
                label={loading ? "Please wait..." : "Login"}
                color='blue'
              />

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

                {/* Gender */}
                <select
                  name='gender'
                  className='p-3 bg-[#111] border border-gray-700 rounded-lg mt-4 text-gray-300
                             focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none'
                  onChange={handleChange}
                >
                  <option value=''>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                {/* DOB */}
                <Input name='dob' type='date' onChange={handleChange} />

                {/* TIME */}
                <Input name='birthTime' type='time' onChange={handleChange} />

                {/* Birth Place */}
                <div className='col-span-2'>
                  <Input
                    name='birthPlace'
                    placeholder='Birth Place'
                    onChange={handleChange}
                  />
                </div>
              </div>

              <SubmitButton
                label={loading ? "Please wait..." : "Register"}
                color='green'
              />
            </motion.form>
          )}
        </AnimatePresence>

        {/* -------------------- SWITCH BUTTON -------------------- */}
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

/* -------------------- INPUT COMPONENT -------------------- */
function Input({ name, type = "text", placeholder, onChange }) {
  return (
    <motion.input
      whileFocus={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      className='w-full p-3 mt-4 bg-[#111] border border-gray-700 rounded-lg text-gray-200
                 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none'
    />
  );
}

/* -------------------- BUTTON COMPONENT -------------------- */
function SubmitButton({ label, color }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className={`w-full bg-${color}-600 py-3 rounded-lg text-white font-semibold mt-6 
                  hover:bg-${color}-700 transition-all`}
      type='submit'
    >
      {label}
    </motion.button>
  );
}
