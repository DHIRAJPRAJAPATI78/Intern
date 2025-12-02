// frontend/src/pages/Booking.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Video, Star, Clock, Globe2, User } from "lucide-react";
import { socket } from "../lib/socket";
import { useSelector } from "react-redux";

const Booking = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

const {user }= useSelector( (store) => store.user)
  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError("");

      // 🔁 Adjust URL according to your backend route
      const res = await axios.get("http://localhost:3000/expert/allexperts");
      setExperts(res.data?.experts || []);
    } catch (err) {
      console.error("Error fetching experts:", err);
      setError(
        err.response?.data?.message || "Failed to load experts. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);




   // 🔥 listen for online experts map from backend
  //  useEffect(() => {
  //   const handleOnlineExperts = (data) => {
  //     // data = { expertId: socketId, ... }
  //     setOnlineExperts(data);
  //   };

  //   socket.on("online-experts", handleOnlineExperts);

  //   return () => socket.off("online-experts", handleOnlineExperts);
  // }, []);

  // const handleVideoCall = (expertId) => {
  //   // convert DB _id -> socket.id
  //   const expertSocketId = onlineExperts[expertId];

  //   if (!expertSocketId) {
  //     alert("Expert is offline");
  //     return;
  //   }

  //   // optional: register user
  //   // socket.emit("register-user", user._id);

  //   // navigate to video page as CALLER
  //   navigate("/video", {
  //     state: {
  //       remoteId: expertSocketId,
  //       role: "caller",
  //     },
  //   });

  //   // notify expert via backend
  //   socket.emit("call-user", {
  //     to: expertSocketId,
  //     from: socket.id,
  //     callerName: user?.name || "User",
  //   });
  // };







  const handleVideoCall = (expertId) => {
    // 🔁 Navigate to your video call page/room
    // navigate(`/video-call/${expertId}`);
    // socket.emit("register-user", user._id );  // register current user
    console.log(expertId)

    if (!expertId) {
      alert("Expert is offline");
      return;
    }

  

    // go to video page as CALLER
    navigate("/video", {
      state: {
        remoteId: expertId,
        role: "caller",
      },
    });

    socket.emit("call-user", {
      to: expertId,
      from: user?._id,
      callerName: user?.name || "User",
    });

  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "online":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40";
      case "busy":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/40";
      default:
        return "bg-zinc-700/40 text-zinc-300 border border-zinc-600";
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 pb-10">
        {/* Page header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Book a Tarot Expert
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Choose from verified experts for a 1:1 video reading.
            </p>
          </div>
        </div>

        {/* Loading / Error states */}
        {loading && (
          <div className="flex justify-center py-10 text-zinc-400 text-sm">
            Loading experts…
          </div>
        )}

        {error && !loading && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Experts grid */}
        {!loading && experts.length === 0 && !error && (
          <div className="text-center text-zinc-400 text-sm py-10">
            No experts available right now.
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experts.map((expert) => (
            <div
              key={expert._id}
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 flex flex-col shadow-lg shadow-black/40"
            >
              {/* Top section: avatar + basic info */}
              <div className="flex gap-4">
                <div className="relative">
                  {expert.profilePic ? (
                    <img
                      src={expert.profilePic}
                      alt={expert.name}
                      className="w-16 h-16 rounded-full object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-800">
                      <User className="w-7 h-7 text-zinc-400" />
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-1 -right-1 px-2 py-0.5 text-[10px] rounded-full capitalize ${getStatusClasses(
                      expert.currentStatus
                    )}`}
                  >
                    {expert.currentStatus || "offline"}
                  </span>
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold text-base md:text-lg">
                    {expert.name}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                    {expert.bio || "No bio added yet."}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4" />
                      <span>
                        {expert.rating && expert.rating > 0
                          ? expert.rating.toFixed(1)
                          : "New"}
                      </span>
                      {expert.totalReviews > 0 && (
                        <span className="text-zinc-500">
                          ({expert.totalReviews})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-zinc-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {expert.experience || 0} yr
                        {expert.experience > 1 ? "s" : ""} exp.
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-zinc-400 capitalize">
                      <Globe2 className="w-4 h-4" />
                      <span>{expert.language || "english"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chips: skills & expertise */}
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                {expert.preferredCardType && (
                  <span className="px-2 py-0.5 rounded-full border border-indigo-500/60 bg-indigo-500/10 text-indigo-300 capitalize">
                    {expert.preferredCardType} cards
                  </span>
                )}

                {(expert.expertise || []).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full border border-zinc-600 bg-zinc-800/60 text-zinc-200 capitalize"
                  >
                    {tag}
                  </span>
                ))}

                {expert.skills?.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-300">
                    {expert.skills[0]}
                  </span>
                )}
              </div>

              {/* Bottom: rate + video button */}
              <div className="mt-4 flex items-end justify-between gap-3">
                <div className="text-sm">
                  <div className="text-zinc-400 text-xs">Video call rate</div>
                  <div className="font-semibold">
                    {expert.ratePerMinuteVideo
                      ? `₹${expert.ratePerMinuteVideo}/min`
                      : "Not set"}
                  </div>
                </div>

                <button
                  onClick={() => handleVideoCall(expert._id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs md:text-sm font-medium bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] transition disabled:opacity-60"
                  disabled={expert.currentStatus !== "online"}
                >
                  <Video className="w-4 h-4" />
                  {expert.currentStatus === "online"
                    ? "Start Video Call"
                    : "Notify when online"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Booking;
