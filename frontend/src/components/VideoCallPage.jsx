import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5001");

const VideoCallPage = () => {
  const { id: targetUserId } = useParams();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef(null);
  const [callStarted, setCallStarted] = useState(false);

  useEffect(() => {
    const initCall = async () => {
      setCallStarted(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = stream;

      const peer = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }, // Free Google STUN server
        ],
      });

      peerRef.current = peer;

      // Add all tracks to the connection
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      // Show remote stream
      peer.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      // ICE candidate handling
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            target: targetUserId,
            candidate: event.candidate,
          });
        }
      };

      // Create and send offer
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit("offer", { to: targetUserId, offer });
    };

    initCall();

    // When receiving an offer (in case you're the callee)
    socket.on("offer", async ({ from, offer }) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = stream;

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerRef.current = peer;

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      peer.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", { to: from, answer });
    });

    socket.on("answer", async ({ answer }) => {
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.disconnect();
    };
  }, [targetUserId]);

  const endCall = () => {
    peerRef.current?.close();
    socket.disconnect();
    window.close(); // or navigate back
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-2xl font-semibold mb-4">
        {callStarted ? "Video Call in Progress" : "Calling..."}
      </h1>
      <div className="relative w-full max-w-5xl flex flex-col md:flex-row gap-4 items-center justify-center">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="rounded-lg shadow-xl bg-black w-full md:w-2/3 h-64 md:h-[450px] object-cover"
        />
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="rounded-lg shadow-xl bg-black w-40 h-40 md:w-1/3 md:h-[200px] object-cover border-4 border-white absolute bottom-4 right-4 md:static"
        />
      </div>

      <button
        onClick={endCall}
        className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition duration-200"
      >
        End Call
      </button>
    </div>
  );
};

export default VideoCallPage;
