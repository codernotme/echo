'use client'

import React, { useState } from "react"
import VideoPlayer from "./_components/VideoPlayer"
import VideoSearch from "./_components/VideoSearch"

export default function Page() {
  const [selectedVideoId, setSelectedVideoId] = useState<string>("")

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId)
  }

  return (
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">ECHO Video Player</h1>
          <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
            <VideoPlayer videoId={selectedVideoId} />
            <VideoSearch onVideoSelect={handleVideoSelect} />
          </div>
        </div>
      </div>
  )
}