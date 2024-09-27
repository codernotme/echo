"use client";
import React, { useState } from "react";
import VideoPlayer from "./_components/VideoPlayer";
import VideoSearch from "./_components/VideoSearch";

const Home: React.FC = () => {
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  return (
    <div className="container">
      <h1 className="header">ECHO Video Player</h1>
      <VideoPlayer videoId={selectedVideoId} />
      <VideoSearch onVideoSelect={handleVideoSelect} />
    </div>
  );
};

export default Home;
