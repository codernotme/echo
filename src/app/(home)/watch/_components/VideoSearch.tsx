import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Image } from "@nextui-org/image";

interface Video {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { default: { url: string } };
  };
}

interface VideoSearchProps {
  onVideoSelect: (videoId: string) => void;
}

export default function VideoSearch({ onVideoSelect }: VideoSearchProps) {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);

  const searchVideos = async () => {
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    try {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${API_KEY}`
      );
      setVideos(res.data.items);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a video..."
          className="flex-grow"
        />
        <Button onClick={searchVideos}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {videos.map((video) => (
          <Card
            key={video.id.videoId}
            className="cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <CardContent
              className="p-4 flex items-center space-x-4"
              onClick={() => onVideoSelect(video.id.videoId)}
            >
              <Image
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                className="w-24 h-18 object-cover rounded"
              />
              <h3 className="font-semibold line-clamp-2">
                {video.snippet.title}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
