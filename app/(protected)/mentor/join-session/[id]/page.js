// "use client";
// import {
//   LiveKitRoom,
//   VideoConference,
//   RoomAudioRenderer,
// } from "@livekit/components-react";
// import "@livekit/components-styles";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default VideoCall = ({ sessionId }) => {
//   const [connectionDetails, setConnectionDetails] = useState(null);

//   useEffect(() => {
//     axios
//       .post(`/api/livekit/session/${sessionId}/join`)
//       .then((res) => setConnectionDetails(res.data));
//   }, [sessionId]);

//   if (!connectionDetails) return <div>Connecting...</div>;

//   return (
//     <LiveKitRoom
//       serverUrl={connectionDetails.serverUrl}
//       token={connectionDetails.token}
//       connect={true}
//       video={true}
//       audio={true}
//       onDisconnected={() => {
//         // redirect to session summary page
//         window.location.href = `/session/${sessionId}/summary`;
//       }}
//     >
//       <VideoConference /> {/* gives you full UI out of the box */}
//       <RoomAudioRenderer />
//     </LiveKitRoom>
//   );
// };

// "use client";
// import { useEffect, useRef, useState } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import axios from "axios";

// export default function VideoCall({ sessionId }) {
//   const [connectionDetails, setConnectionDetails] = useState(null);
//   const [joined, setJoined] = useState(false);
//   const [error, setError] = useState(null);

//   const clientRef = useRef(null);
//   const localVideoRef = useRef(null); // your own camera
//   const remoteVideoRef = useRef(null); // other person's camera

//   // ── Fetch token from your API ──────────────────────
//   useEffect(() => {
//     axios
//       .post(`/api/session/${sessionId}/join`)
//       .then((res) => setConnectionDetails(res.data))
//       .catch(() => setError("Failed to connect to session."));
//   }, [sessionId]);

//   // ── Join Agora channel once we have credentials ────
//   useEffect(() => {
//     if (!connectionDetails) return;

//     const join = async () => {
//       try {
//         const { appId, channelName, token, uid } = connectionDetails;

//         const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
//         clientRef.current = client;

//         // ── Listen for remote user joining ────────────
//         client.on("user-published", async (user, mediaType) => {
//           await client.subscribe(user, mediaType);

//           if (mediaType === "video") {
//             user.videoTrack.play(remoteVideoRef.current);
//           }
//           if (mediaType === "audio") {
//             user.audioTrack.play();
//           }
//         });

//         client.on("user-unpublished", (user, mediaType) => {
//           if (mediaType === "video" && remoteVideoRef.current) {
//             remoteVideoRef.current.innerHTML = "";
//           }
//         });

//         // ── Join the channel ──────────────────────────
//         await client.join(appId, channelName, token, uid);

//         // ── Publish local camera + mic ────────────────
//         const [micTrack, cameraTrack] =
//           await AgoraRTC.createMicrophoneAndCameraTracks();

//         cameraTrack.play(localVideoRef.current);
//         await client.publish([micTrack, cameraTrack]);

//         setJoined(true);
//       } catch (e) {
//         setError(e.message);
//       }
//     };

//     join();

//     // ── Cleanup on unmount ────────────────────────────
//     return () => {
//       clientRef.current?.leave();
//     };
//   }, [connectionDetails]);

//   const handleLeave = async () => {
//     await clientRef.current?.leave();
//     window.location.href = `/session/${sessionId}/summary`;
//   };

//   if (error) return <div className="p-8 text-red-500">{error}</div>;
//   if (!joined) return <div className="p-8 text-gray-500">Connecting...</div>;

//   return (
//     <div className="relative w-full h-screen bg-black">
//       {/* Remote video — full screen */}
//       <div ref={remoteVideoRef} className="w-full h-full" />

//       {/* Local video — picture-in-picture */}
//       <div
//         ref={localVideoRef}
//         className="absolute bottom-6 right-6 w-48 h-36 rounded-xl overflow-hidden border-2 border-white shadow-lg"
//       />

//       {/* Leave button */}
//       <button
//         onClick={handleLeave}
//         className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg transition-colors"
//       >
//         Leave Session
//       </button>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useRef, useState } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import axios from "axios";
// const sessionId = "0a71174d-4ccd-4d0b-a0c1-5bca969a1df8";

// export default function VideoCall() {
//   const [connectionDetails, setConnectionDetails] = useState({
//     success: true,
//     token:
//       "007eJxTYDifcTrO8+WWuXcYcmtszs/78WCDw2X3jjLeBW4CEU6iN+wUGJLMkowtUoySjc2MLEyM00wsLSwsDC2TLCzTEpNSLJKStPh2Zm6T2Jl5JyWZhZGBkYGFgZEBxGcCk8xgkgVM6jAUpxYXZ+bn6Rokmhsampuk6JokJ6fomqQYJOkmGiQb6pomJSdamlkmGqakWXAxGJpZGlkamBubGgAAghI1Ng==",
//     appId: "b6b38d2c362843f4988819b89fabd8bb",
//     channelName: "session-0a71174d-4ccd-4d0b-a0c1-5bca969a1df8",
//     uid: 1692907350,
//     role: "publisher",
//     displayName: "Ritik",
//   });
//   const [joined, setJoined] = useState(false);
//   const [error, setError] = useState(null);
//   const [audioBlocked, setAudioBlocked] = useState(false);
//   const [remoteJoined, setRemoteJoined] = useState(false);

//   const clientRef = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const micTrackRef = useRef(null); // ✅ store refs for cleanup
//   const cameraTrackRef = useRef(null);

//   // useEffect(() => {
//   //   const joinSessionDets = async () => {
//   //     try {
//   //       const res = await joinSession(sessionId);
//   //       setConnectionDetails(res.data);
//   //     } catch (error) {
//   //       console.log(error);
//   //     }
//   //   };
//   //   // axios
//   //   //   .post(`/api/session/${sessionId}/join`)
//   //   //   .then((res) => setConnectionDetails(res.data))
//   //   //   .catch(() => setError("Failed to connect to session."));
//   // }, [sessionId]);

//   // useEffect(() => {
//   //   if (!connectionDetails) return;

//   //   const join = async () => {
//   //     try {
//   //       const { appId, channelName, token, uid } = connectionDetails;

//   //       const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
//   //       clientRef.current = client;

//   //       // ✅ Handle browser audio autoplay block
//   //       client.on("autoplay-fallback", () => setAudioBlocked(true));

//   //       client.on("user-published", async (user, mediaType) => {
//   //         await client.subscribe(user, mediaType);

//   //         if (mediaType === "video") {
//   //           setRemoteJoined(true);
//   //           // ✅ Small delay so div is in DOM before playing
//   //           setTimeout(() => {
//   //             if (remoteVideoRef.current) {
//   //               user.videoTrack.play(remoteVideoRef.current);
//   //             }
//   //           }, 100);
//   //         }

//   //         if (mediaType === "audio") {
//   //           try {
//   //             user.audioTrack.play();
//   //           } catch {
//   //             setAudioBlocked(true);
//   //           }
//   //         }
//   //       });

//   //       client.on("user-unpublished", (user, mediaType) => {
//   //         if (mediaType === "video") setRemoteJoined(false);
//   //       });

//   //       client.on("user-left", () => setRemoteJoined(false));

//   //       await client.join(appId, channelName, token, uid);

//   //       const [micTrack, cameraTrack] =
//   //         await AgoraRTC.createMicrophoneAndCameraTracks();

//   //       // ✅ Store track refs before publishing
//   //       micTrackRef.current = micTrack;
//   //       cameraTrackRef.current = cameraTrack;

//   //       await client.publish([micTrack, cameraTrack]);

//   //       // ✅ setJoined first so localVideoRef div renders, then play in next effect
//   //       setJoined(true);
//   //     } catch (e) {
//   //       setError(e.message);
//   //     }
//   //   };

//   //   join();

//   //   return () => {
//   //     // ✅ Close tracks properly so camera/mic light turns off
//   //     micTrackRef.current?.close();
//   //     cameraTrackRef.current?.close();
//   //     clientRef.current?.leave();
//   //   };
//   // }, [connectionDetails]);

//   useEffect(() => {
//     if (!connectionDetails) return;

//     let cancelled = false; // ✅ track if effect was cleaned up

//     const join = async () => {
//       try {
//         const { appId, channelName, token, uid } = connectionDetails;

//         const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
//         clientRef.current = client;

//         client.on("autoplay-fallback", () => setAudioBlocked(true));

//         client.on("user-published", async (user, mediaType) => {
//           await client.subscribe(user, mediaType);

//           if (mediaType === "video") {
//             setRemoteJoined(true);
//             setTimeout(() => {
//               if (remoteVideoRef.current) {
//                 user.videoTrack.play(remoteVideoRef.current);
//               }
//             }, 100);
//           }

//           if (mediaType === "audio") {
//             try {
//               user.audioTrack.play();
//             } catch {
//               setAudioBlocked(true);
//             }
//           }
//         });

//         client.on("user-unpublished", (user, mediaType) => {
//           if (mediaType === "video") setRemoteJoined(false);
//         });

//         client.on("user-left", () => setRemoteJoined(false));

//         await client.join(appId, channelName, token, uid);

//         // ✅ If cleanup already ran while joining — leave immediately and stop
//         if (cancelled) {
//           await client.leave();
//           return;
//         }

//         const [micTrack, cameraTrack] =
//           await AgoraRTC.createMicrophoneAndCameraTracks();

//         // ✅ Check again after creating tracks
//         if (cancelled) {
//           micTrack.close();
//           cameraTrack.close();
//           await client.leave();
//           return;
//         }

//         micTrackRef.current = micTrack;
//         cameraTrackRef.current = cameraTrack;

//         await client.publish([micTrack, cameraTrack]);

//         if (!cancelled) setJoined(true);
//       } catch (e) {
//         // ✅ Ignore abort errors caused by cleanup — not a real error
//         if (cancelled) return;
//         if (e?.code === "OPERATION_ABORTED") return;
//         setError(e.message);
//       }
//     };

//     join();

//     return () => {
//       cancelled = true; // ✅ signal that we've cleaned up
//       micTrackRef.current?.close();
//       cameraTrackRef.current?.close();
//       clientRef.current?.leave();
//     };
//   }, [connectionDetails]);

//   // ✅ Play local camera AFTER the div is in the DOM
//   useEffect(() => {
//     if (joined && localVideoRef.current && cameraTrackRef.current) {
//       cameraTrackRef.current.play(localVideoRef.current);
//     }
//   }, [joined]);

//   const handleUnblockAudio = async () => {
//     try {
//       await AgoraRTC.resumeAudioContext();
//       setAudioBlocked(false);
//     } catch (e) {
//       console.error("Failed to resume audio:", e);
//     }
//   };

//   const handleLeave = async () => {
//     micTrackRef.current?.close();
//     cameraTrackRef.current?.close();
//     await clientRef.current?.leave();
//     window.location.href = `/session/${sessionId}/summary`;
//   };

//   if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

//   if (!joined)
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-950 gap-3 text-white">
//         <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
//         <span className="text-sm text-gray-300">Connecting...</span>
//       </div>
//     );

//   return (
//     <div className="relative w-full h-screen bg-black overflow-hidden">
//       {/* Remote video — full screen */}
//       <div ref={remoteVideoRef} className="w-full h-full" />

//       {/* Waiting for other person */}
//       {!remoteJoined && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white gap-3">
//           <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-300">
//             Waiting for the other person...
//           </p>
//         </div>
//       )}

//       {/* Local video — picture-in-picture */}
//       <div
//         ref={localVideoRef}
//         className="absolute bottom-24 right-6 w-48 h-36 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl"
//       />

//       {/* Audio blocked banner */}
//       {audioBlocked && (
//         <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50">
//           <button
//             onClick={handleUnblockAudio}
//             className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-full shadow-xl text-sm transition-colors"
//           >
//             🔇 Tap to enable audio
//           </button>
//         </div>
//       )}

//       {/* Leave button */}
//       <button
//         onClick={handleLeave}
//         className="absolute bottom-8 left-1/2 -translate-x-1/2 px-7 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg transition-colors"
//       >
//         Leave Session
//       </button>
//     </div>
//   );
// }

"use client";
import { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useParams } from "next/navigation";
import { joinSession } from "@/services/mentorApi";

// ─── Control Button ───────────────────────────────────────
const ControlBtn = ({
  onClick,
  active,
  activeIcon,
  inactiveIcon,
  label,
  danger,
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 group"
  >
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all shadow-lg
      ${
        danger
          ? "bg-red-500 hover:bg-red-600 text-white"
          : active
            ? "bg-white/20 hover:bg-white/30 text-white"
            : "bg-red-500/90 hover:bg-red-600 text-white"
      }`}
    >
      {active ? activeIcon : inactiveIcon}
    </div>
    <span className="text-[11px] text-white/60 font-medium">{label}</span>
  </button>
);

export default function VideoCall({ isMentor = false }) {
  const params = useParams();
  const sessionId = params.id;
  const [connectionDetails, setConnectionDetails] = useState();

  const [joined, setJoined] = useState(false);
  const [error, setError] = useState(null);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [remoteJoined, setRemoteJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);

  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const micTrackRef = useRef(null);
  const cameraTrackRef = useRef(null);
  const screenTrackRef = useRef(null);

  const connentToServer = async (sessionId) => {
    const res = await joinSession(sessionId);
    if (res.data.success === true) {
      setConnectionDetails(res.data);
    }
  };

  useEffect(() => {
    connentToServer(sessionId);
  }, []);

  useEffect(() => {
    if (!connectionDetails) return;

    let cancelled = false;

    const join = async () => {
      try {
        const { appId, channelName, token, uid } = connectionDetails;

        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        client.on("autoplay-fallback", () => setAudioBlocked(true));

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            setRemoteJoined(true);
            setTimeout(() => {
              if (remoteVideoRef.current)
                user.videoTrack.play(remoteVideoRef.current);
            }, 100);
          }
          if (mediaType === "audio") {
            try {
              user.audioTrack.play();
            } catch {
              setAudioBlocked(true);
            }
          }
        });

        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "video") setRemoteJoined(false);
        });
        client.on("user-left", () => setRemoteJoined(false));

        await client.join(appId, channelName, token, uid);
        if (cancelled) {
          await client.leave();
          return;
        }

        const [micTrack, cameraTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks();

        if (cancelled) {
          micTrack.close();
          cameraTrack.close();
          await client.leave();
          return;
        }

        micTrackRef.current = micTrack;
        cameraTrackRef.current = cameraTrack;

        await client.publish([micTrack, cameraTrack]);
        if (!cancelled) setJoined(true);
      } catch (e) {
        if (cancelled || e?.code === "OPERATION_ABORTED") return;
        setError(e.message);
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

  useEffect(() => {
    if (joined && localVideoRef.current && cameraTrackRef.current) {
      cameraTrackRef.current.play(localVideoRef.current);
    }
  }, [joined]);

  // ── Controls ──────────────────────────────────────────
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
    if (cameraOn && localVideoRef.current) {
      localVideoRef.current.innerHTML = "";
    } else if (!cameraOn && localVideoRef.current) {
      track.play(localVideoRef.current);
    }
  };
  // const toggleCamera = async () => {
  //   const track = cameraTrackRef.current;
  //   if (!track) return;
  //   await track.setEnabled(!cameraOn);
  //   setCameraOn((prev) => !prev);
  //   // ✅ No manual play here — useEffect handles it
  // };

  // useEffect(() => {
  //   if (cameraOn && localVideoRef.current && cameraTrackRef.current) {
  //     // ✅ Small delay to ensure div is back in DOM
  //     setTimeout(() => {
  //       cameraTrackRef.current?.play(localVideoRef.current);
  //     }, 50);
  //   }
  // }, [cameraOn]);

  // // ─── Add this effect ──────────────────────────────────────
  // useEffect(() => {
  //   if (screenShare && localVideoRef.current && screenTrackRef.current) {
  //     setTimeout(() => {
  //       screenTrackRef.current?.play(localVideoRef.current);
  //     }, 50);
  //   }
  // }, [screenShare]);

  const toggleScreenShare = async () => {
    if (!screenShare) {
      try {
        const screenTrack = await AgoraRTC.createScreenVideoTrack(
          {},
          "disable",
        );
        screenTrackRef.current = screenTrack;
        await clientRef.current.unpublish(cameraTrackRef.current);
        await clientRef.current.publish(screenTrack);
        screenTrack.play(localVideoRef.current);
        setScreenShare(true);
        screenTrack.on("track-ended", async () => await stopScreenShare());
      } catch (e) {
        console.log("Screen share cancelled:", e.message);
      }
    } else {
      await stopScreenShare();
    }
  };

  // const toggleScreenShare = async () => {
  //   if (!screenShare) {
  //     try {
  //       const screenTrack = await AgoraRTC.createScreenVideoTrack(
  //         {},
  //         "disable",
  //       );
  //       screenTrackRef.current = screenTrack;

  //       await clientRef.current.unpublish(cameraTrackRef.current);
  //       await clientRef.current.publish(screenTrack);

  //       // ✅ Remove: screenTrack.play(localVideoRef.current) — effect handles it
  //       setScreenShare(true); // ← effect fires after this

  //       screenTrack.on("track-ended", async () => await stopScreenShare());
  //     } catch (e) {
  //       console.log("Screen share cancelled:", e.message);
  //     }
  //   } else {
  //     await stopScreenShare();
  //   }
  // };
  const stopScreenShare = async () => {
    const screenTrack = screenTrackRef.current;
    if (!screenTrack) return;
    await clientRef.current.unpublish(screenTrack);
    screenTrack.close();
    screenTrackRef.current = null;
    await clientRef.current.publish(cameraTrackRef.current);
    if (localVideoRef.current)
      cameraTrackRef.current.play(localVideoRef.current);
    setScreenShare(false);
  };

  const handleLeave = async () => {
    micTrackRef.current?.close();
    cameraTrackRef.current?.close();
    screenTrackRef.current?.close();
    await clientRef.current?.leave();
    window.location.href = `/session/${sessionId}/summary`;
  };

  const handleEndSession = async () => {
    try {
      await axios.post(`/api/session/${sessionId}/end`);
      micTrackRef.current?.close();
      cameraTrackRef.current?.close();
      screenTrackRef.current?.close();
      await clientRef.current?.leave();
      window.location.href = `/session/${sessionId}/summary`;
    } catch (e) {
      console.error("Failed to end session:", e);
    }
  };

  const handleUnblockAudio = async () => {
    try {
      await AgoraRTC.resumeAudioContext();
      setAudioBlocked(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

  if (!joined)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950 gap-3 text-white">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-300">Connecting...</span>
      </div>
    );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Remote video */}
      <div ref={remoteVideoRef} className="w-full h-full" />
      {/* Waiting overlay */}
      {!remoteJoined && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white gap-3">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-300">
            Waiting for the other person...
          </p>
        </div>
      )}
      {/* Camera off placeholder */}
      {!cameraOn && !screenShare && (
        <div className="absolute bottom-24 right-6 w-48 h-36 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-gray-900 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
            👤
          </div>
        </div>
      )}
      {/* Local video PiP */}
      {/* ✅ Always in DOM — just hidden when camera off */}
      {/* // ❌ This removes the div from DOM when cameraOn is false */}
      {(cameraOn || screenShare) && (
        <div
          ref={localVideoRef}
          className="absolute bottom-24 right-6 w-48 h-36 ..."
        />
      )}
      {/* <div
        ref={localVideoRef}
        className={`absolute bottom-24 right-6 w-48 h-36 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl
    ${!cameraOn && !screenShare ? "hidden" : ""}`}
      /> */}
      {/* Audio blocked */}
      {audioBlocked && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleUnblockAudio}
            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-full shadow-xl text-sm transition-colors"
          >
            🔇 Tap to enable audio
          </button>
        </div>
      )}
      {/* ── Controls bar ──────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-4">
        {/* Mic */}
        <ControlBtn
          onClick={toggleMic}
          active={micOn}
          activeIcon="🎙️"
          inactiveIcon="🔇"
          label={micOn ? "Mute" : "Unmute"}
        />

        {/* Camera */}
        <ControlBtn
          onClick={toggleCamera}
          active={cameraOn}
          activeIcon="📷"
          inactiveIcon="📷"
          label={cameraOn ? "Stop Video" : "Start Video"}
        />

        {/* Screen share */}
        <ControlBtn
          onClick={toggleScreenShare}
          active={!screenShare}
          activeIcon="🖥️"
          inactiveIcon="⏹️"
          label={screenShare ? "Stop Share" : "Share Screen"}
        />

        {/* Leave / End — different per role */}
        {isMentor ? (
          <ControlBtn
            onClick={handleEndSession}
            active={false}
            activeIcon="📵"
            inactiveIcon="📵"
            label="End Session"
            danger
          />
        ) : (
          <ControlBtn
            onClick={handleLeave}
            active={false}
            activeIcon="📵"
            inactiveIcon="📵"
            label="Leave"
            danger
          />
        )}
      </div>
    </div>
  );
}
