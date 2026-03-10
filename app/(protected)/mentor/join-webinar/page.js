"use client";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";

// Renders only the mentor's video — attendees can't publish anyway
const MentorStage = () => {
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);
  const mentorTrack = tracks[0]; // only 1 publisher in webinar

  if (!mentorTrack) return <div>Waiting for host to share video...</div>;

  return (
    <VideoTrack
      trackRef={mentorTrack}
      style={{ width: "100%", height: "100vh" }}
    />
  );
};

export default WebinarViewer = ({ webinarId, connectionDetails }) => {
  return (
    <LiveKitRoom
      serverUrl={connectionDetails.serverUrl}
      token={connectionDetails.token}
      connect={true}
      audio={false} // attendees don't publish
      video={false}
    >
      <MentorStage />
      <RoomAudioRenderer /> {/* still plays mentor's audio */}
    </LiveKitRoom>
  );
};
