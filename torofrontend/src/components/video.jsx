import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SimplePeer from "simple-peer";
import EventEmitter from "events";
import { socket } from "../lib/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import useSpeechRecognition from "../../src/hooks/useSpeechRecognition";

window.EventEmitter = EventEmitter;

const ICE = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const Video = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // remoteId = expert MongoDB _id
  const { remoteId, role, callId } = location.state || {}; // role: "caller" on user side
  const { expert } = useSelector((state) => state.expert); // adjust to your store

  console.log(callId);    //undefined

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);
  const isInitializedRef = useRef(false);
  const queuedSignalsRef = useRef([]);

  const [status, setStatus] = useState("connecting…");
  const [mic, setMic] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const [transcript, setTranscript] = useState("");

  // const { startListening, stopListening, isListening } = useSpeechRecognition(
  //   (text) => {
  //     setTranscript(text);
  //   }
  // );

  const { startListening, stopListening, isListening } = useSpeechRecognition(

    
    async (finalText) => {
      setTranscript(finalText); // show live

    console.log("calliD IN USESPEECH HOOK",callId);
   

    try {
      await axios.post("http://localhost:3000/call/transcript/add-chunk", {
        callId,
        speaker: role,   // "caller" or "expert"
        text: finalText,
        language: "en-US",
        startedAt: new Date(),
        endedAt: new Date(),
      });
    } catch (err) {
      console.error("Failed to save transcript:", err);
    }
  }
);



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
      initiator,
      trickle: true,
      stream: localStreamRef.current,
      config: ICE,
    });

    // send WebRTC signaling data to backend
    p.on("signal", (data) => {
      socket.emit("signal", {
        to: otherId, // MONGO ID (expertId or userId)
        from: expert?.expertId, // send our Mongo userId (not socket.id)
        payload: data,
      });
    });

    // when remote stream comes in
    p.on("stream", (remoteStream) => {
      console.log("📹 Expert received remote stream!", remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        console.log("✅ Expert set remote video srcObject");
      } else {
        console.error("❌ Expert remoteVideoRef.current is null!");
      }
    });

    p.on("connect", () => {
      console.log("✅ Expert peer connected!");
      setStatus("connected");

      startListening(); // 🎤 START SPEECH RECOGNITION
    });

    p.on("error", (err) => {
      console.error("❌ Expert peer error:", err);
      setStatus("error");
    });

    p.on("close", () => {
      console.log("🔌 Expert peer closed");
      setStatus("ended");
    });

    peerRef.current = p;
  };

  // console.log(remoteId, role, expert?.expertId);

  useEffect(() => {
    if (!remoteId || !role || !expert?.expertId) {
      navigate(-1);
      return;
    }

    if (!isInitializedRef.current) {
      isInitializedRef.current = true;

      startLocalStream().then(() => {
        if (role === "expert" && !peerRef.current) {
          setStatus("connecting to caller…");
          console.log("🔧 Expert creating peer for user:", remoteId);
          createPeer(remoteId, false); // Expert is non-initiator

          // Replay any queued signals that arrived before peer was ready
          console.log(
            "📦 Replaying",
            queuedSignalsRef.current.length,
            "queued signals"
          );
          queuedSignalsRef.current.forEach(({ from, payload }) => {
            console.log("🔄 Replaying signal:", payload.type);
            peerRef.current.signal(payload);
          });
          queuedSignalsRef.current = [];
        }

        // Caller emits call-user
        if (role === "caller") {
          setStatus("calling…");

          socket.emit("call-user", {
            to: remoteId,
            from: expert?.expertId,
            callerName: expert.name || "Caller",
          });
        }
      });
    }

    // When expert accepts the call
    const onCallAccepted = ({ from }) => {
      // `from` is expertId (MongoDB _id) as per your backend design
      if (role === "caller" && !peerRef.current) {
        console.log("call accepted from expert:", from);
        //from   expert MongoDB id
        createPeer(from, true); // we are initiator
      }
    };

    // When we receive WebRTC signaling data from expert
    const onSignal = ({ from, payload }) => {
      console.log("📥 EXPERT RECEIVED SIGNAL:", payload.type, "from:", from);
      // `from` = expertId (Mongo) or userId depending on backend
      // If peer not ready yet, queue the signal for replay later
      if (!peerRef.current) {
        console.log("📦 Queueing signal until peer is ready:", payload.type);
        queuedSignalsRef.current.push({ from, payload });
        return;
      }

      // Peer is ready, signal immediately
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
  }, [remoteId, role, expert?.expertId, navigate]);

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
      console.warn(
        "Audio track has ended; cannot toggle mic. You may need to recreate the stream."
      );
      return;
    }

    // Toggle track enabled
    const nextEnabled = !audioTrack.enabled; //enabled false on mic off
    audioTrack.enabled = nextEnabled;

    // Sync React state with actual track state
    setMic(nextEnabled); // mic === true → Mic is ON, audioTrack.enabled === true

    // Control STT
    if (nextEnabled) {
      startListening(); // Mic ON → Start recognition
    } else {
      stopListening(); // Mic OFF → Stop recognition
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
        console.log("Call ended");
      }

      navigate(-1);
    } catch (err) {
      console.error("Failed to end call session:", err);
      navigate(-1);
    }
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
            {mic ? "Mic ON" : "Mic OFF"}
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
