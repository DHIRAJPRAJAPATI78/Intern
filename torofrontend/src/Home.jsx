import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-6 pt-17">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          🔮 Welcome to Mystic Tarot Reader
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed">
          Get accurate tarot readings, personalized predictions, and life guidance
          from experienced tarot experts. Book video sessions, check your horoscope,
          and get answers to love, career, and life questions.
        </p>
      </motion.div>

      {/* Tarot Card Image */}
      {/* <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        src="https://i.postimg.cc/VNcWPvHs/tarot-card.png"
        alt="Tarot"
        className="mt-10 w-48 h-72 object-cover rounded-xl shadow-[0_0_25px_rgba(255,0,150,0.4)]"
      /> */}

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl"
      >
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-purple-700/40 transition">
          <h2 className="text-xl font-bold mb-2">✨ Live Tarot Sessions</h2>
          <p className="text-gray-400">
            Book one-on-one video calls with professional tarot readers.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-purple-700/40 transition">
          <h2 className="text-xl font-bold mb-2">💜 Accurate Predictions</h2>
          <p className="text-gray-400">
            Get deep insights for love, career, finance, and life decisions.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-purple-700/40 transition">
          <h2 className="text-xl font-bold mb-2">📅 Book Slots Online</h2>
          <p className="text-gray-400">
            Schedule readings instantly with secure booking.
          </p>
        </div>
      </motion.div>

      {/* Button Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-10"
      >
        <a
          href="/login"
          className="px-8 py-3 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white text-lg shadow-lg hover:opacity-80 transition"
        >
          Get Your Reading
        </a>
      </motion.div>
    </div>
  );
}
