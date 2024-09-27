import React from 'react';

const VideoPlayer: React.FC<{ videoId: string }> = ({ videoId }) => {
    return (
        <div className="video-player">
            {videoId ? (
                <iframe
                    className="video-iframe"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            ) : (
                <p>Select a video to play.</p>
            )}
        </div>
    );
};

export default VideoPlayer;
