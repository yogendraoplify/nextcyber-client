"use client";
import { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { joinWebinar } from "@/services/mentorApi";
import { useParams } from "next/navigation";

// const webinarServiceId = "c3a045aa-713f-4bf6-8cd4-c83516375348";

export default function WebinarViewer() {
  const params = useParams();
  const webinarServiceId = params.id;
  const [status, setStatus] = useState("idle"); // idle | joining | live | ended | error
  const [error, setError] = useState(null);
  const [audioBlocked, setAudioBlocked] = useState(false); // ✅ track browser audio block

  const clientRef = useRef(null);
  const hostVidRef = useRef(null);

  const join = async () => {
    setStatus("joining");
    try {
      const res = await joinWebinar(webinarServiceId);
      const { appId, channelName, token, uid } = res.data;

      const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
      clientRef.current = client;

      await client.setClientRole("audience");

      // ✅ Key fix — handle autoplay block
      client.on("autoplay-fallback", () => {
        setAudioBlocked(true);
      });

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
          // Small delay to ensure the div is rendered
          setTimeout(() => {
            if (hostVidRef.current) {
              user.videoTrack.play(hostVidRef.current);
            }
          }, 100);
          setStatus("live");
        }

        if (mediaType === "audio") {
          // ✅ Try to play audio — browser may block it
          try {
            user.audioTrack.play();
          } catch (e) {
            setAudioBlocked(true);
          }
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "video") setStatus("joining");
      });

      client.on("user-left", () => setStatus("ended"));

      await client.join(appId, channelName, token, uid);
    } catch (e) {
      setError(e.response?.data?.message ?? e.message);
      setStatus("error");
    }
  };

  // ✅ User clicks "Unmute" banner → resumes audio context
  const handleUnblockAudio = async () => {
    try {
      await AgoraRTC.resumeAudioContext(); // ✅ this is the key call
      setAudioBlocked(false);
    } catch (e) {
      console.error("Failed to resume audio:", e);
    }
  };

  useEffect(() => {
    join();
    return () => {
      clientRef.current?.leave();
    };
  }, []);

  // ── Render states ─────────────────────────────────────
  if (status === "error")
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <p className="text-red-400 text-lg font-medium mb-3">{error}</p>
          <button
            onClick={join}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );

  if (status === "ended")
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 bg-gray-950 text-white">
        <h2 className="text-2xl font-bold">Webinar has ended</h2>
        <p className="text-sm text-gray-400">Thank you for attending!</p>
      </div>
    );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Host video */}
      <div ref={hostVidRef} className="w-full h-full" />

      {/* Waiting overlay */}
      {(status === "idle" || status === "joining") && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white gap-3">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-300">
            {status === "idle"
              ? "Connecting..."
              : "Waiting for host to start..."}
          </p>
        </div>
      )}

      {/* Live indicator */}
      {status === "live" && (
        <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          LIVE
        </div>
      )}

      {/* ✅ Audio blocked banner — user must tap to enable */}
      {audioBlocked && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleUnblockAudio}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-full shadow-xl transition-colors animate-bounce"
          >
            🔇 Tap to enable audio
          </button>
        </div>
      )}
    </div>
  );
}
