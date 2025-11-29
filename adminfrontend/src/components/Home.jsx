import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 pt-20">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          🛡️ Welcome to Admin Panel
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed">
          Manage users, experts, and bookings efficiently. Track site activity,
          monitor analytics, and ensure smooth operations of the Mystic Tarot platform.
        </p>
      </motion.div>

      {/* Dashboard Metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
      >
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-purple-700/40 transition">
          <h2 className="text-xl font-bold mb-2">👥 Total Users</h2>
          <p className="text-gray-400">View and manage registered users.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-purple-700/40 transition">
          <h2 className="text-xl font-bold mb-2">🔮 Experts</h2>
          <p className="text-gray-400">Manage tarot experts and their schedules.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-purple-700/40 transition">
          <h2 className="text-xl font-bold mb-2">📅 Bookings</h2>
          <p className="text-gray-400">Track all user bookings and appointments.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-purple-700/40 transition">
          <h2 className="text-xl font-bold mb-2">📊 Analytics</h2>
          <p className="text-gray-400">Monitor traffic, readings, and user engagement.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-purple-700/40 transition">
          <h2 className="text-xl font-bold mb-2">💌 Messages</h2>
          <p className="text-gray-400">Review user feedback and support requests.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-purple-700/40 transition">
          <h2 className="text-xl font-bold mb-2">⚙️ Settings</h2>
          <p className="text-gray-400">Update site settings and admin preferences.</p>
        </div>
      </motion.div>

      {/* Quick Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-10 flex flex-wrap justify-center gap-4"
      >
        <a
          href="/admin/users"
          className="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition shadow-lg"
        >
          Manage Users
        </a>

        <a
          href="/admin/experts"
          className="px-6 py-3 rounded-full bg-pink-600 text-white font-semibold hover:bg-pink-700 transition shadow-lg"
        >
          Manage Experts
        </a>

        <a
          href="/admin/bookings"
          className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg"
        >
          View Bookings
        </a>
      </motion.div>
    </div>
  );
}
