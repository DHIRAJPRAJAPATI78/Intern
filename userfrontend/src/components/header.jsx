import { useEffect, useState, useRef } from "react";
import { Menu, X, Bell, Moon } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⭐ Tarot Reader Navigation Links
  const navLinks = [
    { name: "About Tarot", href: "/about" },
    { name: "Book Reading", href: "/book" },
    { name: "Tarot Cards", href: "/cards" },
    { name: "Horoscope", href: "/horoscope" },
    { name: "Contact", href: "/contact" },

  { name: "My Profile", href: "/profile", type: "mobile" },
  { name: "My Bookings", href: "/my-bookings", type: "mobile" },
  { name: "Settings", href: "/settings", type: "mobile" },
  { name: "Logout", href: "/logout", type: "mobile" },
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
          {navLinks.map(
            (link) =>
              link.type !== "mobile" && (
                <Link
                  key={link.name}
                  to={link.href}
                  className="hover:text-white transition duration-200"
                >
                  {link.name}
                </Link>
              )
          )}
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          {user && (
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
                        Submissions
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
                        Settings
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-red-400">
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {!user && (
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

          {!user && (
            <Link
              to="/login"
              className="px-6 py-3 bg-purple-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-800/30"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
