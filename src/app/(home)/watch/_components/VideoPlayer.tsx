import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

interface VideoPlayerProps {
  videoId: string
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  return (
    <Card className="bg-gray-900">
      <CardContent className="p-4">
        {videoId ? (
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            ></iframe>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-64 bg-gray-900 rounded-lg">
            <p className="text-xl text-gray-400">Select a video to play</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
