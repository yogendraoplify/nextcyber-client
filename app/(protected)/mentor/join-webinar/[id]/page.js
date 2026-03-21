"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { joinWebinar } from "@/services/mentorApi";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Volume2,
  VolumeX,
  Radio,
  Users,
  Wifi,
  WifiOff,
  RefreshCw,
  LogOut,
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// LIVE BADGE
// ─────────────────────────────────────────────────────────
const LiveBadge = () => (
  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/10">
    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
    LIVE
  </div>
);

// ─────────────────────────────────────────────────────────
// VIEWER COUNT BADGE
// ─────────────────────────────────────────────────────────
const ViewerBadge = ({ count }) => (
  <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white/70 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10">
    <Users size={12} />
    {count} watching
  </div>
);

// ─────────────────────────────────────────────────────────
// CONNECTION QUALITY INDICATOR
// ─────────────────────────────────────────────────────────
const ConnectionBadge = ({ quality }) => {
  const good = quality === "good";
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm
      ${
        good
          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
          : "bg-amber-500/20 border-amber-500/30 text-amber-400"
      }`}
    >
      {good ? <Wifi size={12} /> : <WifiOff size={12} />}
      {good ? "HD" : "Buffering"}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// WAITING SCREEN
// ─────────────────────────────────────────────────────────
const WaitingScreen = ({ message, sub }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 text-white gap-4 z-10">
    <div className="relative">
      <div className="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
        <Radio size={28} className="text-gray-500" />
      </div>
      <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
    </div>
    <div className="text-center">
      <p className="text-base font-semibold text-white">{message}</p>
      {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
    </div>
    <Loader2 size={18} className="animate-spin text-gray-600" />
  </div>
);

// ─────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────
export default function WebinarViewer() {
  const params = useParams();
  const router = useRouter();
  const webinarServiceId = params.id;

  const [status, setStatus] = useState("idle"); // idle|joining|live|ended|error
  const [error, setError] = useState(null);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [quality, setQuality] = useState("good");
  const [hostName, setHostName] = useState("Host");

  const clientRef = useRef(null);
  const hostVidRef = useRef(null);

  // ── Join logic ────────────────────────────────────────
  const join = useCallback(async () => {
    setStatus("joining");
    setError(null);

    try {
      const res = await joinWebinar(webinarServiceId);
      const { appId, channelName, token, uid } = res.data;

      const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
      clientRef.current = client;

      await client.setClientRole("audience");

      // ── Audio autoplay block ─────────────────────────
      client.on("autoplay-fallback", () => setAudioBlocked(true));

      // ── Host published video/audio ───────────────────
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
          setTimeout(() => {
            if (hostVidRef.current) {
              user.videoTrack.play(hostVidRef.current);
            }
          }, 100);
          setStatus("live");
        }

        if (mediaType === "audio") {
          try {
            user.audioTrack.play();
          } catch {
            setAudioBlocked(true);
          }
        }
      });

      // ── Host paused / stopped ────────────────────────
      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "video") setStatus("joining");
      });

      // ── Host left / ended ────────────────────────────
      client.on("user-left", () => setStatus("ended"));

      // ── Track viewer count via Agora presence ────────
      client.on("user-joined", () => setViewerCount((v) => v + 1));
      client.on("user-left", () => setViewerCount((v) => Math.max(0, v - 1)));

      // ── Network quality ──────────────────────────────
      client.on("network-quality", (stats) => {
        setQuality(stats.downlinkNetworkQuality <= 2 ? "good" : "poor");
      });

      await client.join(appId, channelName, token, uid);
    } catch (e) {
      setError(e.response?.data?.message ?? e.message);
      setStatus("error");
    }
  }, [webinarServiceId]);

  useEffect(() => {
    join();
    return () => {
      clientRef.current?.leave();
    };
  }, []);

  const handleUnblockAudio = useCallback(async () => {
    try {
      await AgoraRTC.resumeAudioContext();
      setAudioBlocked(false);
    } catch (e) {
      console.error("Failed to resume audio:", e);
    }
  }, []);

  // ─────────────────────────────────────────────────────
  // ERROR STATE
  // ─────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100.8px)] bg-gray-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <WifiOff size={24} className="text-red-400" />
          </div>
          <div>
            <p className="text-red-400 font-semibold">{error}</p>
            <p className="text-gray-600 text-sm mt-1">
              Unable to join the webinar
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={join}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              <RefreshCw size={15} />
              Try again
            </button>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-semibold transition-colors"
            >
              <LogOut size={15} />
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────
  // ENDED STATE
  // ─────────────────────────────────────────────────────
  if (status === "ended") {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100.8px)] bg-gray-950 text-white gap-5">
        <div className="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
          <Radio size={30} className="text-gray-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Webinar has ended</h2>
          <p className="text-sm text-gray-500 mt-1.5">
            Thank you for attending! 🎉
          </p>
        </div>
        <button
          onClick={() => router.push("/mentorship")}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-semibold transition-colors mt-2"
        >
          <LogOut size={15} />
          Back to Mentorship
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────
  // MAIN VIEW
  // ─────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-[calc(100vh-100.8px)] bg-black overflow-hidden">
      {/* ── Host video ──────────────────────────────── */}
      <div ref={hostVidRef} className="w-full h-full" />

      {/* ── Waiting overlay ─────────────────────────── */}
      {(status === "idle" || status === "joining") && (
        <WaitingScreen
          message={
            status === "idle" ? "Connecting..." : "Waiting for host to start..."
          }
          sub={
            status === "joining" ? "The webinar will begin shortly" : undefined
          }
        />
      )}

      {/* ── Top bar (shown when live) ────────────────── */}
      {status === "live" && (
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <LiveBadge />
            <ViewerBadge count={viewerCount} />
          </div>
          <ConnectionBadge quality={quality} />
        </div>
      )}

      {/* ── Audio blocked banner ─────────────────────── */}
      {audioBlocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <button
            onClick={handleUnblockAudio}
            className="flex flex-col items-center gap-3 px-8 py-6 bg-black/80 backdrop-blur-md border border-white/10 text-white rounded-2xl shadow-2xl transition-all hover:bg-black/90"
          >
            <div className="w-14 h-14 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
              <VolumeX size={24} className="text-yellow-400" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white text-sm">Audio is muted</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Click to enable sound
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full text-sm transition-colors">
              <Volume2 size={14} />
              Enable Audio
            </div>
          </button>
        </div>
      )}

      {/* ── Bottom info bar ──────────────────────────── */}
      {status === "live" && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      )}
    </div>
  );
}
