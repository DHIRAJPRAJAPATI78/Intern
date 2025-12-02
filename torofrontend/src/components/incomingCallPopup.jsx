// IncomingCallPopup.jsx
import React, { useEffect, useState } from "react";
import { socket } from "../lib/socket";   // your shared socket instance
import { useNavigate } from "react-router-dom";

export default function IncomingCallPopup() {
  const [incoming, setIncoming] = useState(null); // { from, callerName }
  const navigate = useNavigate();

//   socket.on("incoming-call", ({ from, callerName }) => {
//     console.log(from, callerName);
//   setIncoming({ from, callerName });
// });

//   useEffect(() => {
//     // when some user calls this expert
//     console.log("useeffect")
//     // socket.on("incoming-call", ({ from, callerName }) => {
//     //     console.log(from, callerName);
//     //   setIncoming({ from, callerName });
//     // });

//     return () => {
//       socket.off("incoming-call");
//     };
//   }, []);



//user mongo id
//expert socket id

  useEffect(() => {
    const handleIncoming = ({ from, callerName }) => {
        //from user mongo id
      console.log("incoming-call:", from, callerName);
      setIncoming({ from, callerName });
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
      from: socket.id,         // expert socket id            //expert socket id
    });

    // 🔹 go to Video page as EXPERT
    console.log("incoming from: ",incoming.from);
    navigate("/video", {
      state: {
        remoteId: incoming.from,
        role: "expert",
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
