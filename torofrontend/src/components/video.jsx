// // expertfrontend/src/components/Video.jsx (similar in userfrontend)
// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import SimplePeer from "simple-peer";
// import EventEmitter from "events";
// import { socket } from "../lib/socket";

// window.EventEmitter = EventEmitter;

// const ICE = {
//   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// };

// const Video = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { remoteId, role } = location.state || {}; // "caller" | "expert"

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const peerRef = useRef(null);

//   const [status, setStatus] = useState("connecting…");

//   const startLocalStream = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     localStreamRef.current = stream;
//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = stream;
//     }
//     return stream;
//   };

//   const createPeer = (otherId, initiator) => {
//     const p = new SimplePeer({
//       initiator,
//       trickle: true,
//       stream: localStreamRef.current,
//       config: ICE,
//     });

//     p.on("signal", (data) => {
//       socket.emit("signal", {
//         to: otherId,
//         from: socket.id,
//         payload: data,
//       });
//     });

//     p.on("stream", (remoteStream) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = remoteStream;
//       }
//     });

//     p.on("connect", () => setStatus("connected"));
//     p.on("close", () => setStatus("ended"));

//     peerRef.current = p;
//   };

//   useEffect(() => {
//     if (!remoteId || !role) {
//       navigate(-1);
//       return;
//     }

//     startLocalStream().then(() => {
//       if (role === "expert") {
//         setStatus("waiting for peer…");
//       } else if (role === "caller") {
//         setStatus("calling…");
//       }
//     });

//     const onCallAccepted = ({ from }) => {
//       if (role === "caller") {
//         createPeer(from, true); // initiator
//       }
//     };

//     const onSignal = ({ from, payload }) => {
//       if (!peerRef.current) {
//         createPeer(from, false); // non-initiator (expert)
//       }
//       peerRef.current.signal(payload);
//     };

//     const onCallEnded = () => {
//       setStatus("ended");
//       if (peerRef.current) peerRef.current.destroy();
//     };

//     socket.on("call-accepted", onCallAccepted);
//     socket.on("signal", onSignal);
//     socket.on("call-ended", onCallEnded);

//     return () => {
//       socket.off("call-accepted", onCallAccepted);
//       socket.off("signal", onSignal);
//       socket.off("call-ended", onCallEnded);

//       if (peerRef.current) peerRef.current.destroy();
//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach((t) => t.stop());
//       }
//     };
//   }, [remoteId, role, navigate]);

//   const endCall = () => {
//     if (peerRef.current) peerRef.current.destroy();
//     socket.emit("end-call", { to: remoteId });
//     navigate(-1);
//   };

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
//       <p className="mb-4 text-sm text-zinc-400">Status: {status}</p>

//       <div className="flex gap-4">
//         <div>
//           <p className="mb-1 text-xs text-zinc-400">You</p>
//           <video
//             ref={localVideoRef}
//             autoPlay
//             muted
//             playsInline
//             className="w-64 h-40 bg-zinc-900 rounded-xl"
//           />
//         </div>

//         <div>
//           <p className="mb-1 text-xs text-zinc-400">Remote</p>
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="w-64 h-40 bg-zinc-900 rounded-xl"
//           />
//         </div>
//       </div>

//       <button
//         onClick={endCall}
//         className="mt-6 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm"
//       >
//         End Call
//       </button>
//     </div>
//   );
// };

// export default Video;



import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SimplePeer from "simple-peer";
import EventEmitter from "events";
import { socket } from "../lib/socket";
import { useSelector } from "react-redux";

window.EventEmitter = EventEmitter;

const ICE = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const Video = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // remoteId = expert MongoDB _id
  const { remoteId, role } = location.state || {}; // role: "caller" on user side
  const { expert } = useSelector((state) => state.expert); // adjust to your store

//   Tino ok hai
//   console.log(remoteId);
//   console.log(role);
//   console.log(expert);
  

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);

  const [status, setStatus] = useState("connecting…");

  const startLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    return stream;
  };

  // otherId here is ALWAYS a MongoDB id (remote user's id)
  const createPeer = (otherId, initiator) => {
    const p = new SimplePeer({
      initiator:true,
      trickle: true,
      stream: localStreamRef.current,
      config: ICE,
    });

    // send WebRTC signaling data to backend
    p.on("signal", (data) => {
      socket.emit("signal", {
        to: otherId,        // MONGO ID (expertId or userId)
        from: expert?.expertId,    // send our Mongo userId (not socket.id)
        payload: data,
      });
    });

    // when remote stream comes in
    p.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    p.on("connect", () => setStatus("connected"));
    p.on("close", () => setStatus("ended"));

    peerRef.current = p;
  };

  console.log(remoteId , role , expert?.expertId);


  useEffect(() => {
    if (!remoteId || !role || !expert?.expertId) {
      navigate(-1);
      return;
    }

    // 1) Start camera/mic
    startLocalStream().then(() => {
      if (role === "caller") {
        setStatus("calling…");

        // 2) Ask backend to call expert using expert's MongoDB id
        socket.emit("call-user", {
          to: remoteId,          // expertId (Mongo)
          from: expert._id,        // userId (Mongo)
          callerName: expert.name || "Caller",
        });
      }
    });

    // When expert accepts the call
    const onCallAccepted = ({ from }) => {
      // `from` is expertId (MongoDB _id) as per your backend design
      if (role === "caller") {
        console.log("call accepted from expert:", from);
        //from   expert socket id
        createPeer(from, false); // we are initiator
      }
    };

    // When we receive WebRTC signaling data from expert
    const onSignal = ({ from, payload }) => {
        console.log("hello",from, payload)
      // `from` = expertId (Mongo) or userId depending on backend
      if (!peerRef.current) {
        // caller side: we already created peer on "call-accepted"
        // so usually this branch won't run for caller
        console.log("Expert: creating peer with user:", from);
        createPeer(from, false);
      }
      peerRef.current.signal(payload);
    };

    const onCallEnded = () => {
      setStatus("ended");
      if (peerRef.current) peerRef.current.destroy();
    };

    socket.on("call-accepted", onCallAccepted);
    socket.on("signal", onSignal);
    socket.on("call-ended", onCallEnded);

    return () => {
      socket.off("call-accepted", onCallAccepted);
      socket.off("signal", onSignal);
      socket.off("call-ended", onCallEnded);

      if (peerRef.current) peerRef.current.destroy();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [remoteId, role, expert?._id, navigate]);

  const endCall = () => {
    if (peerRef.current) peerRef.current.destroy();
    // tell backend to notify expert by expertId (Mongo)
    socket.emit("end-call", { to: remoteId });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <p className="mb-4 text-sm text-zinc-400">Status: {status}</p>

      <div className="flex gap-4">
        <div>
          <p className="mb-1 text-xs text-zinc-400">You</p>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-64 h-40 bg-zinc-900 rounded-xl"
          />
        </div>

        <div>
          <p className="mb-1 text-xs text-zinc-400">Remote</p>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-64 h-40 bg-zinc-900 rounded-xl"
          />
        </div>
      </div>

      <button
        onClick={endCall}
        className="mt-6 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm"
      >
        End Call
      </button>
    </div>
  );
};

export default Video;

