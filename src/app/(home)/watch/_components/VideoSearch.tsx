import React, { useState } from 'react';
import axios from 'axios';
import {Image} from '@nextui-org/image';

const VideoSearch: React.FC<{ onVideoSelect: (videoId: string) => void }> = ({ onVideoSelect }) => {
    const [query, setQuery] = useState('');
    const [videos, setVideos] = useState<any[]>([]);

    const searchVideos = async () => {
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; // Ensure your API key is set correctly
        const res = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${API_KEY}`
        );
        setVideos(res.data.items);
    };

    return (
        <div className="video-search">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a video..."
                className="search-input"
            />
            <button onClick={searchVideos} className="search-button">Search</button>
            <div className="video-results">
                {videos.map((video) => (
                    <div key={video.id.videoId} className="video-card" onClick={() => onVideoSelect(video.id.videoId)}>
                        <Image src={video.snippet.thumbnails.default.url} alt={video.snippet.title} className="video-thumbnail" />
                        <h3 className="video-title">{video.snippet.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoSearch;
