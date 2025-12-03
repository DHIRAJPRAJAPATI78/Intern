import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SimplePeer from "simple-peer";
import EventEmitter from "events";
import { socket } from "../lib/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

window.EventEmitter = EventEmitter;

const ICE = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const Video = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState("");

  const { startListening, stopListening, isListening } = useSpeechRecognition(
    (text) => {
      setTranscript(text);
    }
  );

  // remoteId = expert MongoDB _id
  const { remoteId, role, callId } = location.state || {}; // role: "caller" on user side
  const { user } = useSelector((state) => state.user); // adjust to your store

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);
  const isInitializedRef = useRef(false);

  const [mic,setMic] = useState(true);

  const [status, setStatus] = useState("connecting…");
  const [videoEnabled, setVideoEnabled] = useState(true);


  // const [transcript, setTranscript] = useState("");
  // const [chunks, setChunks] = useState([]); // { text, speaker, createdAt }

  //  Debug video element state
  const debugVideoElement = () => {
    const video = remoteVideoRef.current;
    if (!video) {
      console.log(" remoteVideoRef is null");
      return;
    }

    console.log(" Video Element Debug:");
    console.log("- Video element exists:", !!video);
    console.log("- srcObject:", video.srcObject);
    console.log("- Video width:", video.videoWidth);
    console.log("- Video height:", video.videoHeight);
    console.log("- Ready state:", video.readyState);
    console.log("- Paused:", video.paused);
    console.log("- Muted:", video.muted);
    console.log("- Volume:", video.volume);
    console.log("- Current time:", video.currentTime);

    if (video.srcObject) {
      const stream = video.srcObject;
      console.log("- Stream active:", stream.active);
      console.log("first");
      console.log(stream.getVideoTracks());
      console.log(stream.getAudioTracks());
      console.log(
        "- Video tracks:",
        stream.getVideoTracks().map((t) => ({
          enabled: t.enabled,
          muted: t.muted,
          readyState: t.readyState,
        }))
      );
    }
  };

  const startLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // setTimeout(debugVideoElement, 1000);
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    return stream;
  };

  // otherId here is ALWAYS a MongoDB id (remote user's id)
  const createPeer = (otherId, initiator) => {
    console.log("🔧 Creating peer:", { otherId, initiator });

    const p = new SimplePeer({
      initiator,
      trickle: true,
      stream: localStreamRef.current,
      config: ICE,
    });

    // send WebRTC signaling data to backend
    p.on("signal", (data) => {
      console.log("📤 User sending signal:", data.type);
      console.log("📤 Signal data:", data);
      console.log("📤 Sending to otherId:", otherId);
      socket.emit("signal", {
        to: otherId, // MONGO ID (expertId or userId)
        from: user?._id, // send our Mongo userId (not socket.id)
        payload: data,
      });
    });

    // when remote stream comes in
    p.on("stream", (remoteStream) => {
      console.log("📹 User received remote stream!", remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        console.log("✅ Set remote video srcObject");
        setTimeout(debugVideoElement, 1000);
      } else {
        console.error("❌ remoteVideoRef.current is null!");
      }
    });

    p.on("connect", () => {
      console.log("✅ Peer connected!");
      setStatus("connected");
      startListening(); // 🎤 START SPEECH RECOGNITION
    });

    p.on("error", (err) => {
      console.error("❌ Peer error:", err);
      setStatus("error");
    });

    p.on("close", () => {
      console.log("🔌 Peer closed");
      setStatus("ended");
    });

    peerRef.current = p;
  };
  console.log("remote video", remoteVideoRef?.current?.srcObject);

  useEffect(() => {
    if (!remoteId || !role || !user?._id) {
      navigate(-1);
      return;
    }

    // 1) Initialize stream and peer only once
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;

      startLocalStream().then(() => {
        if (role === "caller") {
          setStatus("calling…");

          // 2) Ask backend to call expert using expert's MongoDB id
          socket.emit("call-user", {
            to: remoteId, // expertId (Mongo)
            from: user?._id, // userId (Mongo)
            callerName: user.name || "Caller",
          });
        }
      });
    }

    // When expert accepts the call
    const onCallAccepted = ({ from }) => {
      // `from` is expertId (MongoDB _id) as per your backend design
      if (role === "caller") {
        console.log("call accepted from expert:", from);
        createPeer(from, true); // we are initiator
      }
    };

    // When we receive WebRTC signaling data from expert
    const onSignal = ({ from, payload }) => {
      console.log("📥 USER RECEIVED SIGNAL:", payload.type, "from:", from);
      // `from` = expertId (Mongo) or userId depending on backend
      if (!peerRef.current) {
        // caller side: we already created peer on "call-accepted"
        // so usually this branch won't run for caller
        console.log("Creating peer in onSignal");
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
  }, [remoteId, role, user?._id, navigate]);

  const endCall = async () => {
    try {
      stopListening(); // 🎤 STOP SPEECH RECOGNITION
      if (peerRef.current) peerRef.current.destroy();
      socket.emit("end-call", { to: remoteId });

      // if you passed callId in location.state
      if (callId) {
        await axios.put(
          "http://localhost:3000/call/end",
          {
            callId,
            endReason: role === "caller" ? "user-ended" : "expert-ended",
          },
          { withCredentials: true }
        );
      }

      navigate(-1);
    } catch (err) {
      console.error("Failed to end call session:", err);
      navigate(-1);
    }
  };

  // const toggleMic = () => {
  //   const audioTrack = localStreamRef.current?.getAudioTracks()[0];
  //   if (!audioTrack) return;

  //   audioTrack.enabled = !audioTrack.enabled;

  //   if (audioTrack.enabled) {
  //     startListening(); // Mic ON → Start STT
  //   } else {
  //     stopListening(); // Mic OFF → Stop STT
  //   }
  // };

  // const toggleMic = () => {
  //   if (!localStreamRef.current) return;
  
  //   const audioTracks = localStreamRef.current.getAudioTracks();
  //   if (!audioTracks.length) return;
  
  //   const currentEnabled = audioTracks[0].enabled;
  //   const nextEnabled = !currentEnabled;
  
  //   audioTracks.forEach((t) => (t.enabled = nextEnabled));
  
  //   // if you still want React state, store "is mic ON?"
  //   setMic(nextEnabled);
  
  //   console.log("Mic is now", nextEnabled ? "ON" : "OFF", audioTracks[0]);
  // };


  const toggleMic = () => {
    const stream = localStreamRef.current;
    if (!stream) {
      console.warn("No local stream available");
      return;
    }
  
    const [audioTrack] = stream.getAudioTracks();
    if (!audioTrack) {
      console.warn("No audio track found in local stream");
      return;
    }
  
    // If the track is ended, we can't toggle it
    if (audioTrack.readyState === "ended") {
      console.warn("Audio track has ended; cannot toggle mic. You may need to recreate the stream.");
      return;
    }
  
    // Toggle track enabled
    const nextEnabled = !audioTrack.enabled;    //enabled false on mic off
    audioTrack.enabled = nextEnabled;
  
    // Sync React state with actual track state
    setMic(nextEnabled);    // mic === true → Mic is ON, audioTrack.enabled === true
  
    // Control STT
    if (nextEnabled) {
      startListening();   // Mic ON → Start recognition
    } else {
      stopListening();    // Mic OFF → Stop recognition
    }
  
    console.log("Mic is now", nextEnabled ? "ON" : "OFF", audioTrack);
  };


const toggleVideo = () => {
  const stream = localStreamRef.current;
  if (!stream) {
    console.warn("No local stream available");
    return;
  }

  const [videoTrack] = stream.getVideoTracks();
  if (!videoTrack) {
    console.warn("No video track found in local stream");
    return;
  }

  if (videoTrack.readyState === "ended") {
    console.warn("Video track has ended; cannot toggle");
    return;
  }

  const nextState = !videoTrack.enabled;
  videoTrack.enabled = nextState;

  setVideoEnabled(nextState);

  console.log("📹 Video is now", nextState ? "ON" : "OFF");
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

          <button
            onClick={toggleMic}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-lg"
          >
            {mic
              ? "Mic ON"
              : "Mic OFF"}
          </button>
          <button
  onClick={toggleVideo}
  className="mt-4 px-4 py-2 bg-purple-600 rounded-lg"
>
  {videoEnabled ? "Video ON" : "Video OFF"}
</button>


          <div className="mt-4 bg-zinc-800 p-3 rounded-lg w-80 text-sm">
  <p className="text-zinc-400 mb-1">Live Transcription:</p>
  <p>{transcript}</p>
</div>

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
