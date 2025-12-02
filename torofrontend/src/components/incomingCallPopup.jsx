// IncomingCallPopup.jsx
import React, { useEffect, useState } from "react";
import { socket } from "../lib/socket";   // your shared socket instance
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function IncomingCallPopup() {
  const [incoming, setIncoming] = useState(null); // { from, callerName, callId }
  const navigate = useNavigate();
  const { expert } = useSelector((state) => state.expert); 

  useEffect(() => {
    const handleIncoming = ({ from, callerName , callId }) => {
        //from user mongo id
      console.log("incoming-call:", from, callerName, callId);
      setIncoming({ from, callerName, callId });
    };

    socket.on("incoming-call", handleIncoming);

    return () => {
      socket.off("incoming-call", handleIncoming);
    };
  }, []);





  const handleAccept = () => {
    if (!incoming) return;

    // 🔹 tell backend: I accepted the call
    socket.emit("accept-call", {
      to: incoming.from,       // caller socket id            //user mongo id
      from:expert?.expertId,          // expert socket id            //expert socket id   //this line is changed
      callId:incoming.callId
    });

    // 🔹 go to Video page as EXPERT
    console.log("incoming from: ",incoming.from);
    navigate("/video", {
      state: {
        remoteId: incoming.from,
        role: "expert",
        callId: incoming.callId
      },
    });

    setIncoming(null);
  };
  console.log("incoming compo")


    const handleDecline = () => {
    setIncoming(null);
    // optionally emit "call-declined"
  };

  if (!incoming) return null;
  console.log("first")

  return (
    <div className="fixed inset-0 bg-black/60 text-white text-7xl flex items-center justify-center z-50 pt-25">
      <div className="bg-zinc-900 text-white rounded-xl p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-2">Incoming call</h2>
        <p className="text-sm text-zinc-300">
          {incoming.callerName || "Someone"} is calling you…
</p>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-sm"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
