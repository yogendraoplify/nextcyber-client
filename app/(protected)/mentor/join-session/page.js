"use client";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import axios from "axios";

export default VideoCall = ({ sessionId }) => {
  const [connectionDetails, setConnectionDetails] = useState(null);

  useEffect(() => {
    axios
      .post(`/api/livekit/session/${sessionId}/join`)
      .then((res) => setConnectionDetails(res.data));
  }, [sessionId]);

  if (!connectionDetails) return <div>Connecting...</div>;

  return (
    <LiveKitRoom
      serverUrl={connectionDetails.serverUrl}
      token={connectionDetails.token}
      connect={true}
      video={true}
      audio={true}
      onDisconnected={() => {
        // redirect to session summary page
        window.location.href = `/session/${sessionId}/summary`;
      }}
    >
      <VideoConference /> {/* gives you full UI out of the box */}
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};
