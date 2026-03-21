"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useParams, useRouter } from "next/navigation";
import { endSession, joinSession } from "@/services/mentorApi";
import { useSelector } from "react-redux";
import {
  Mic, MicOff, Video, VideoOff, MonitorUp, MonitorStop,
  PhoneOff, Volume2, VolumeX, Loader2, Users,
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// CONTROL BUTTON
// ─────────────────────────────────────────────────────────
const ControlBtn = ({ onClick, active = true, icon, inactiveIcon, label, variant = "default", disabled = false }) => {
  const Icon         = active ? icon : (inactiveIcon ?? icon);
  const base         = "flex flex-col items-center gap-1.5 group disabled:opacity-40 disabled:cursor-not-allowed";
  const circleBase   = "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-150 shadow-lg";

  const circleStyle =
    variant === "danger"   ? "bg-red-500 hover:bg-red-400 text-white" :
    variant === "active"   ? "bg-blue-500 hover:bg-blue-400 text-white" :
    active                 ? "bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm" :
                             "bg-red-500/90 hover:bg-red-500 text-white";

  return (
    <button onClick={onClick} disabled={disabled} className={base}>
      <div className={`${circleBase} ${circleStyle}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <span className="text-[10px] text-white/50 font-medium tracking-wide">{label}</span>
    </button>
  );
};

// ─────────────────────────────────────────────────────────
// VIDEO TILE  — renders a named video container
// ─────────────────────────────────────────────────────────
const VideoTile = ({ videoRef, label, muted = false, className = "", placeholder = false }) => (
  <div className={`relative bg-gray-900 rounded-2xl overflow-hidden ${className}`}>
    {/* video container */}
    <div ref={videoRef} className="w-full h-full" />

    {/* placeholder avatar when camera off */}
    {placeholder && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
          <Users size={28} className="text-gray-400" />
        </div>
      </div>
    )}

    {/* name label */}
    {label && (
      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-md text-[11px] text-white/80 font-medium">
        {label}
      </div>
    )}

    {/* muted indicator */}
    {muted && (
      <div className="absolute top-2 right-2 w-6 h-6 bg-red-500/90 rounded-full flex items-center justify-center">
        <MicOff size={12} className="text-white" />
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────
// WAITING OVERLAY
// ─────────────────────────────────────────────────────────
const WaitingOverlay = ({ message }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm text-white gap-3 z-10">
    <Loader2 size={28} className="animate-spin text-white/60" />
    <p className="text-sm text-gray-300">{message}</p>
  </div>
);

// ─────────────────────────────────────────────────────────
// MAIN VIDEO CALL COMPONENT
// ─────────────────────────────────────────────────────────
export default function VideoCall() {
  const params    = useParams();
  const router    = useRouter();
  const sessionId = params.id;
  const { user }  = useSelector((state) => state.auth);
  const isMentor  = user?.role === "MENTOR";

  // ── State ──────────────────────────────────────────────
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [joined,            setJoined]            = useState(false);
  const [connecting,        setConnecting]        = useState(true);
  const [error,             setError]             = useState(null);
  const [audioBlocked,      setAudioBlocked]      = useState(false);
  const [remoteJoined,      setRemoteJoined]      = useState(false);
  const [micOn,             setMicOn]             = useState(true);
  const [cameraOn,          setCameraOn]          = useState(true);
  const [screenShare,       setScreenShare]       = useState(false);
  const [remoteMicOn,       setRemoteMicOn]       = useState(true);
  const [displayName,       setDisplayName]       = useState("");

  // ── Refs ───────────────────────────────────────────────
  const clientRef      = useRef(null);
  const localVidRef    = useRef(null);   // my camera
  const remoteVidRef   = useRef(null);   // other person's camera / screen
  const pipVidRef      = useRef(null);   // PiP: when screen sharing, shows my camera here
  const micTrackRef    = useRef(null);
  const cameraTrackRef = useRef(null);
  const screenTrackRef = useRef(null);
  const remoteUserRef  = useRef(null);   // store remote user object

  // ── Fetch token ────────────────────────────────────────
  useEffect(() => {
    const connect = async () => {
      try {
        const res = await joinSession(sessionId);
        if (res.data.success) {
          setConnectionDetails(res.data);
          setDisplayName(res.data.displayName ?? "You");
        }
      } catch (e) {
        setError(e.response?.data?.message ?? "Failed to connect to session.");
        setConnecting(false);
      }
    };
    connect();
  }, [sessionId]);

  // ── Join Agora ─────────────────────────────────────────
  useEffect(() => {
    if (!connectionDetails) return;
    let cancelled = false;

    const join = async () => {
      try {
        const { appId, channelName, token, uid } = connectionDetails;

        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        client.on("autoplay-fallback", () => setAudioBlocked(true));

        // ── Remote user published ──────────────────────
        client.on("user-published", async (remoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);
          remoteUserRef.current = remoteUser;

          if (mediaType === "video") {
            setRemoteJoined(true);
            setTimeout(() => {
              if (remoteVidRef.current) {
                remoteUser.videoTrack.play(remoteVidRef.current);
              }
            }, 100);
          }

          if (mediaType === "audio") {
            try { remoteUser.audioTrack.play(); }
            catch { setAudioBlocked(true); }
          }
        });

        client.on("user-unpublished", (remoteUser, mediaType) => {
          if (mediaType === "video") setRemoteJoined(false);
          if (mediaType === "audio") setRemoteMicOn(false);
        });

        client.on("user-left", () => {
          setRemoteJoined(false);
          remoteUserRef.current = null;
        });

        await client.join(appId, channelName, token, uid);
        if (cancelled) { await client.leave(); return; }

        const [micTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        if (cancelled) { micTrack.close(); cameraTrack.close(); await client.leave(); return; }

        micTrackRef.current    = micTrack;
        cameraTrackRef.current = cameraTrack;

        await client.publish([micTrack, cameraTrack]);
        if (!cancelled) { setJoined(true); setConnecting(false); }

      } catch (e) {
        if (cancelled || e?.code === "OPERATION_ABORTED") return;
        setError(e.message);
        setConnecting(false);
      }
    };

    join();

    return () => {
      cancelled = true;
      micTrackRef.current?.close();
      cameraTrackRef.current?.close();
      clientRef.current?.leave();
    };
  }, [connectionDetails]);

  // ── Play local camera after DOM renders ───────────────
  useEffect(() => {
    if (joined && localVidRef.current && cameraTrackRef.current) {
      cameraTrackRef.current.play(localVidRef.current);
    }
  }, [joined]);

  // ── Re-play camera when cameraOn toggles back ─────────
  useEffect(() => {
    if (cameraOn && localVidRef.current && cameraTrackRef.current) {
      setTimeout(() => cameraTrackRef.current?.play(localVidRef.current), 50);
    }
  }, [cameraOn]);

  // ── Re-play screen share into PiP slot ────────────────
  useEffect(() => {
    if (screenShare && pipVidRef.current && cameraTrackRef.current) {
      setTimeout(() => cameraTrackRef.current?.play(pipVidRef.current), 50);
    }
  }, [screenShare]);

  // ─────────────────────────────────────────────────────
  // CONTROLS
  // ─────────────────────────────────────────────────────
  const toggleMic = useCallback(async () => {
    const track = micTrackRef.current;
    if (!track) return;
    await track.setEnabled(!micOn);
    setMicOn(v => !v);
  }, [micOn]);

  const toggleCamera = useCallback(async () => {
    const track = cameraTrackRef.current;
    if (!track) return;
    await track.setEnabled(!cameraOn);
    setCameraOn(v => !v);
  }, [cameraOn]);

  const toggleScreenShare = useCallback(async () => {
    if (!screenShare) {
      try {
        const screenTrack = await AgoraRTC.createScreenVideoTrack({}, "disable");
        screenTrackRef.current = screenTrack;

        await clientRef.current.unpublish(cameraTrackRef.current);
        await clientRef.current.publish(screenTrack);

        // Screen goes to main remote view area (localVidRef)
        if (localVidRef.current) screenTrack.play(localVidRef.current);

        setScreenShare(true);
        screenTrack.on("track-ended", stopScreenShare);
      } catch (e) {
        if (e.message !== "Permission denied") {
          console.log("Screen share:", e.message);
        }
      }
    } else {
      await stopScreenShare();
    }
  }, [screenShare]);

  const stopScreenShare = useCallback(async () => {
    const screenTrack = screenTrackRef.current;
    if (!screenTrack) return;

    await clientRef.current.unpublish(screenTrack);
    screenTrack.close();
    screenTrackRef.current = null;

    await clientRef.current.publish(cameraTrackRef.current);
    setScreenShare(false);
    // camera will re-play via the cameraOn useEffect
  }, []);

  const handleUnblockAudio = useCallback(async () => {
    try { await AgoraRTC.resumeAudioContext(); setAudioBlocked(false); }
    catch (e) { console.error(e); }
  }, []);

  const cleanup = useCallback(() => {
    micTrackRef.current?.close();
    cameraTrackRef.current?.close();
    screenTrackRef.current?.close();
    clientRef.current?.leave();
  }, []);

  const handleLeave = useCallback(async () => {
    cleanup();
    router.push("/mentorship");
  }, [cleanup, router]);

  const handleEndSession = useCallback(async () => {
    try {
      await endSession(sessionId);
      cleanup();
      router.push("/mentor/sessions");
    } catch (e) {
      console.error("Failed to end session:", e);
    }
  }, [sessionId, cleanup, router]);

  // ─────────────────────────────────────────────────────
  // RENDER STATES
  // ─────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-950 gap-4 text-white">
        <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
          <PhoneOff size={24} className="text-red-400" />
        </div>
        <p className="text-red-400 text-sm font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm text-white transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (connecting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-950 gap-3 text-white">
        <Loader2 size={28} className="animate-spin text-blue-400" />
        <span className="text-sm text-gray-400">Connecting to session...</span>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────
  // MAIN LAYOUT
  //
  // NORMAL (no screen share):
  //   ┌─────────────────────────────┐
  //   │                             │
  //   │     Remote person (full)    │
  //   │                             │
  //   │              ┌──────────┐   │
  //   │              │  My cam  │   │ ← PiP bottom-right
  //   │              └──────────┘   │
  //   └─────────────────────────────┘
  //
  // SCREEN SHARE (you sharing):
  //   ┌────────────────────┬──────┐
  //   │                    │ My   │
  //   │   Screen share     │ cam  │
  //   │   (your screen)    │      │
  //   │                    │ Rem  │
  //   │                    │ cam  │
  //   └────────────────────┴──────┘
  // ─────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-[calc(100vh-100.8px)] bg-gray-950 overflow-hidden">

      {screenShare ? (
        // ── SCREEN SHARE LAYOUT ──────────────────────
        <div className="flex w-full h-full gap-2 p-2">

          {/* Screen share — main area */}
          <div className="flex-1 relative bg-black rounded-2xl overflow-hidden">
            <div ref={localVidRef} className="w-full h-full" />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-md text-[11px] text-white/80">
              Your Screen
            </div>
          </div>

          {/* Right column — my camera + remote */}
          <div className="w-52 flex flex-col gap-2">

            {/* My camera PiP */}
            <VideoTile
              videoRef={pipVidRef}
              label="You (cam)"
              placeholder={!cameraOn}
              muted={!micOn}
              className="flex-1"
            />

            {/* Remote person */}
            <VideoTile
              videoRef={remoteVidRef}
              label={connectionDetails?.displayName ?? "Other"}
              placeholder={!remoteJoined}
              muted={!remoteMicOn}
              className="flex-1"
            />
          </div>
        </div>

      ) : (
        // ── NORMAL LAYOUT ────────────────────────────
        <div className="relative w-full h-full">

          {/* Remote video — full canvas */}
          <VideoTile
            videoRef={remoteVidRef}
            label={connectionDetails?.displayName ?? "Other"}
            placeholder={!remoteJoined}
            muted={!remoteMicOn}
            className="absolute inset-0 rounded-none"
          />

          {/* Waiting overlay when remote hasn't joined */}
          {!remoteJoined && (
            <WaitingOverlay message="Waiting for the other person to join..." />
          )}

          {/* My camera — PiP bottom-right */}
          <div className="absolute bottom-24 right-4 w-44 h-32 z-10">
            {/* Always keep div in DOM — hide with CSS when camera off */}
            <VideoTile
              videoRef={localVidRef}
              label="You"
              muted={!micOn}
              placeholder={!cameraOn}
              className={`w-full h-full border-2 border-white/20 shadow-2xl ${!cameraOn ? "opacity-100" : ""}`}
            />
          </div>
        </div>
      )}

      {/* ── Audio blocked banner ─────────────────────── */}
      {audioBlocked && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleUnblockAudio}
            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-full shadow-xl text-sm transition-colors"
          >
            <VolumeX size={16} />
            Tap to enable audio
          </button>
        </div>
      )}

      {/* ── Controls bar ─────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-end gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">

          {/* Mic */}
          <ControlBtn
            onClick={toggleMic}
            active={micOn}
            icon={Mic}
            inactiveIcon={MicOff}
            label={micOn ? "Mute" : "Unmute"}
          />

          {/* Camera */}
          <ControlBtn
            onClick={toggleCamera}
            active={cameraOn}
            icon={Video}
            inactiveIcon={VideoOff}
            label={cameraOn ? "Stop Video" : "Start Video"}
          />

          {/* Screen share */}
          <ControlBtn
            onClick={toggleScreenShare}
            active={!screenShare}
            icon={MonitorUp}
            inactiveIcon={MonitorStop}
            label={screenShare ? "Stop Share" : "Share Screen"}
            variant={screenShare ? "active" : "default"}
          />

          {/* Divider */}
          <div className="w-px h-8 bg-white/10 mx-1" />

          {/* Leave / End */}
          {isMentor ? (
            <ControlBtn
              onClick={handleEndSession}
              icon={PhoneOff}
              label="End Session"
              variant="danger"
            />
          ) : (
            <ControlBtn
              onClick={handleLeave}
              icon={PhoneOff}
              label="Leave"
              variant="danger"
            />
          )}
        </div>
      </div>
    </div>
  );
}