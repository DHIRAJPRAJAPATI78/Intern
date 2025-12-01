// import { useEffect, useState, useRef } from "react";
// import { Menu, X, Bell, Moon } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { logoutUser } from "../features/authSlice";
// import { useDispatch, useSelector } from "react-redux";

// const Header = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { loading } = useSelector((state) => state.user); 
//   const user = true;

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = async () => {
//     if (loading) return; 

//     try {
//       await dispatch(logoutUser()).unwrap();
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }
//   };

//   //  Tarot Reader Navigation Links
//   const navLinks = [
//     { name: "About Tarot", href: "/about" },
//     { name: "Book Reading", href: "/book" },
//     { name: "Tarot Cards", href: "/cards" },
//     { name: "Horoscope", href: "/horoscope" },
//     { name: "Contact", href: "/contact" },

//     { name: "My Profile", href: "/profile", type: "mobile" },
//     { name: "My Bookings", href: "/my-bookings", type: "mobile" },
//     { name: "Settings", href: "/settings", type: "mobile" },

//     // Mobile Logout item
//     { name: "Logout", href: "", type: "mobile", logout: true },
//   ];

//   return (
//     <header className="fixed top-0 left-0 w-full h-16 bg-black/80 backdrop-blur-md border-b border-gray-800 z-50 shadow-md">
//       <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="text-2xl font-bold text-white tracking-wide hover:text-purple-400 transition-colors"
//         >
//           MysticTarot
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center space-x-6 text-gray-300">
//           {navLinks.map(
//             (link) =>
//               link.type !== "mobile" && (
//                 <Link
//                   key={link.name}
//                   to={link.href}
//                   className="hover:text-white transition duration-200"
//                 >
//                   {link.name}
//                 </Link>
//               )
//           )}
//         </nav>

//         {/* Right Section */}
//         <div className="hidden md:flex items-center space-x-4">
//           {user && (
//             <>
//               <button className="text-gray-300 hover:text-white transition">
//                 <Bell size={20} />
//               </button>

//               <button className="text-gray-300 hover:text-white transition">
//                 <Moon size={20} />
//               </button>

//               {/* User Dropdown */}
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => setDropdownOpen((prev) => !prev)}
//                   className="flex items-center focus:outline-none"
//                 >
//                   <div className="w-9 h-9 rounded-full bg-gray-700 border border-gray-600"></div>
//                 </button>

//                 {dropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
//                     <ul className="text-gray-300">
//                       <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
//                         <Link to="/profile">My Profile</Link>
//                       </li>
//                       <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
//                         Submissions
//                       </li>
//                       <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
//                         Settings
//                       </li>

//                       {/* Logout with loader */}
//                       <li
//                         className={`px-4 py-2 hover:bg-gray-800 cursor-pointer text-red-400 flex items-center gap-2
//                           ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//                         onClick={!loading ? handleLogout : undefined}
//                       >
//                         {loading ? (
//                           <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
//                         ) : (
//                           "Logout"
//                         )}
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}

//           {!user && (
//             <Link
//               to="/login"
//               className="px-4 py-2 bg-purple-600 rounded-md text-white hover:bg-purple-700 transition"
//             >
//               Login
//             </Link>
//           )}
//         </div>

//         {/* Mobile Menu Toggle */}
//         <button
//           onClick={() => setMenuOpen(!menuOpen)}
//           className="md:hidden text-gray-200"
//         >
//           {menuOpen ? <X size={26} /> : <Menu size={26} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden bg-black/95 border-t border-gray-800 px-5 py-4 flex flex-col space-y-4 text-gray-300">
//           {navLinks.map((link) =>
//             link.logout ? (
//               <button
//                 key={link.name}
//                 onClick={handleLogout}
//                 disabled={loading}
//                 className="text-left text-red-400"
//               >
//                 {loading ? (
//                   <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block"></span>
//                 ) : (
//                   "Logout"
//                 )}
//               </button>
//             ) : (
//               <Link
//                 key={link.name}
//                 to={link.href}
//                 className="hover:text-white transition duration-200"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 {link.name}
//               </Link>
//             )
//           )}
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;




import { useEffect, useState, useRef } from "react";
import { Menu, X, Bell, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get user & loading from Redux
  const { loading, user } = useSelector((state) => state.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (loading) return;

    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
      setDropdownOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Public navigation links (visible for everyone)
  const navLinks = [
    { name: "About Tarot", href: "/about" },
    { name: "Book Reading", href: "/book" }, // route itself will be protected
    { name: "Tarot Cards", href: "/cards" },
    { name: "Horoscope", href: "/horoscope" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-black/80 backdrop-blur-md border-b border-gray-800 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-white tracking-wide hover:text-purple-400 transition-colors"
        >
          MysticTarot
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-gray-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="hover:text-white transition duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Section (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <button className="text-gray-300 hover:text-white transition">
                <Bell size={20} />
              </button>

              <button className="text-gray-300 hover:text-white transition">
                <Moon size={20} />
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-700 border border-gray-600"></div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
                    <ul className="text-gray-300">
                      <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
                        <Link to="/profile">My Profile</Link>
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
                        <Link to="/my-bookings">My Bookings</Link>
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
                        <Link to="/settings">Settings</Link>
                      </li>

                      {/* Logout with loader */}
                      <li
                        className={`px-4 py-2 hover:bg-gray-800 cursor-pointer text-red-400 flex items-center gap-2
                          ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={!loading ? handleLogout : undefined}
                      >
                        {loading ? (
                          <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          "Logout"
                        )}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            // ✅ Show Login if NOT logged in
            <Link
              to="/login"
              className="px-4 py-2 bg-purple-600 rounded-md text-white hover:bg-purple-700 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-200"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-gray-800 px-5 py-4 flex flex-col space-y-4 text-gray-300">
          {/* Public links */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="hover:text-white transition duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to="/profile"
                className="hover:text-white transition duration-200"
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/my-bookings"
                className="hover:text-white transition duration-200"
                onClick={() => setMenuOpen(false)}
              >
                My Bookings
              </Link>
              <Link
                to="/settings"
                className="hover:text-white transition duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Settings
              </Link>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="text-left text-red-400"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block"></span>
                ) : (
                  "Logout"
                )}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-white transition duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-white transition duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

