"use client";
import { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { endWebinar, startWebinar } from "@/services/mentorApi";
import { useParams } from "next/navigation";

export default function WebinarHost() {
  const params = useParams();
  const webinarServiceId = params.id;
  const [details, setDetails] = useState();
  const [live, setLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [error, setError] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);

  const clientRef = useRef(null);
  const localVidRef = useRef(null); // div ref for camera
  const micTrackRef = useRef(null);
  const cameraTrackRef = useRef(null);
  const screenTrackRef = useRef(null);

  const handleGoLive = async () => {
    try {
      const res = await startWebinar(webinarServiceId);

      setDetails(res.data);
    } catch (e) {
      setError(e.response?.data?.message ?? "Failed to start webinar.");
    }
  };

  useEffect(() => {
    if (!details) return;

    const join = async () => {
      try {
        const { appId, channelName, token, uid } = details;

        const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        clientRef.current = client;

        await client.setClientRole("host");

        client.on("user-joined", () => setViewers((v) => v + 1));
        client.on("user-left", () => setViewers((v) => Math.max(0, v - 1)));

        await client.join(appId, channelName, token, uid);

        const [micTrack, cameraTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks();

        micTrackRef.current = micTrack;
        cameraTrackRef.current = cameraTrack;

        await client.publish([micTrack, cameraTrack]);

        // ✅ setLive first so the div renders, then play in callback
        setLive(true);
      } catch (e) {
        setError(e.message);
      }
    };

    join();

    return () => {
      micTrackRef.current?.close();
      cameraTrackRef.current?.close();
      screenTrackRef.current?.close();
      clientRef.current?.leave();
    };
  }, [details]);

  // ✅ Play camera AFTER the video div is in the DOM
  useEffect(() => {
    if (live && localVidRef.current && cameraTrackRef.current) {
      cameraTrackRef.current.play(localVidRef.current);
    }
  }, [live]);

  // ── Controls ─────────────────────────────────────────
  const toggleMic = async () => {
    const track = micTrackRef.current;
    if (!track) return;
    await track.setEnabled(!micOn);
    setMicOn((prev) => !prev);
  };

  const toggleCamera = async () => {
    const track = cameraTrackRef.current;
    if (!track) return;
    await track.setEnabled(!cameraOn);
    setCameraOn((prev) => !prev);
    // Show black when camera off
    if (cameraOn && localVidRef.current) {
      localVidRef.current.innerHTML = "";
    } else if (!cameraOn && localVidRef.current) {
      track.play(localVidRef.current);
    }
  };

  const toggleScreenShare = async () => {
    if (!screenShare) {
      try {
        const screenTrack = await AgoraRTC.createScreenVideoTrack(
          {},
          "disable",
        );
        screenTrackRef.current = screenTrack;

        // Unpublish camera, publish screen
        await clientRef.current.unpublish(cameraTrackRef.current);
        await clientRef.current.publish(screenTrack);

        screenTrack.play(localVidRef.current);
        setScreenShare(true);

        // Auto stop when user stops sharing from browser UI
        screenTrack.on("track-ended", async () => {
          await stopScreenShare();
        });
      } catch (e) {
        console.log("Screen share cancelled or failed:", e.message);
      }
    } else {
      await stopScreenShare();
    }
  };

  const stopScreenShare = async () => {
    const screenTrack = screenTrackRef.current;
    if (!screenTrack) return;

    await clientRef.current.unpublish(screenTrack);
    screenTrack.close();
    screenTrackRef.current = null;

    // Re-publish camera
    await clientRef.current.publish(cameraTrackRef.current);
    if (localVidRef.current) cameraTrackRef.current.play(localVidRef.current);

    setScreenShare(false);
  };

  const handleEndWebinar = async () => {
    micTrackRef.current?.close();
    cameraTrackRef.current?.close();
    screenTrackRef.current?.close();
    await clientRef.current?.leave();
    await endWebinar(webinarServiceId);
  };

  // ── States ────────────────────────────────────────────
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

  if (!live) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-950">
        <h2 className="text-2xl font-bold text-white">Ready to go live?</h2>
        <p className="text-gray-400 text-sm">
          Your camera and mic will turn on automatically
        </p>
        <button
          onClick={handleGoLive}
          className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full text-lg transition-colors"
        >
          Go Live
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-100.8px)] bg-gray-950 overflow-hidden">
      {/* ── Camera / Screen feed ─────────────────────── */}
      <div ref={localVidRef} className="w-full h-full object-cover" />

      {/* Camera off placeholder */}
      {!cameraOn && !screenShare && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-4xl text-gray-400">
            👤
          </div>
        </div>
      )}

      {/* ── Top bar ──────────────────────────────────── */}
      <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        LIVE · {viewers} watching
      </div>

      {/* ── Bottom controls ───────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        {/* Mic */}
        <ControlBtn
          active={micOn}
          onClick={toggleMic}
          activeIcon="🎙️"
          inactiveIcon="🔇"
          label={micOn ? "Mute" : "Unmute"}
        />

        {/* Camera */}
        <ControlBtn
          active={cameraOn}
          onClick={toggleCamera}
          activeIcon="📷"
          inactiveIcon="🚫"
          label={cameraOn ? "Stop Video" : "Start Video"}
        />

        {/* Screen share */}
        <ControlBtn
          active={!screenShare}
          onClick={toggleScreenShare}
          activeIcon="🖥️"
          inactiveIcon="⏹️"
          label={screenShare ? "Stop Share" : "Share Screen"}
          accent={screenShare ? "bg-blue-500" : ""}
        />

        {/* End */}
        <button
          onClick={handleEndWebinar}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white text-xl transition-colors shadow-lg">
            📵
          </div>
          <span className="text-xs text-white/70">End</span>
        </button>
      </div>
    </div>
  );
}

// ── Reusable control button ───────────────────────────────
function ControlBtn({
  active,
  onClick,
  activeIcon,
  inactiveIcon,
  label,
  accent,
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group"
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-colors shadow-lg
        ${accent || (active ? "bg-white/20 hover:bg-white/30" : "bg-red-500 hover:bg-red-600")}`}
      >
        {active ? activeIcon : inactiveIcon}
      </div>
      <span className="text-xs text-white/70">{label}</span>
    </button>
  );
}
