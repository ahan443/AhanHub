import React, { useRef, useEffect } from 'react';

declare global {
  interface Window {
    jwplayer: any;
  }
}

interface JWPlayerProps {
  file: string;
  title: string;
}

const JWPlayer: React.FC<JWPlayerProps> = ({ file, title }) => {
    const playerId = useRef(`jwplayer-${Math.random().toString(36).substring(2)}`).current;
    
    useEffect(() => {
        if (!file || typeof window.jwplayer === 'undefined') {
            return;
        }
        
        let player: any;
        try {
            player = window.jwplayer(playerId);

            player.setup({
                file: file,
                title: title,
                width: "100%",
                aspectratio: "16:9",
                autostart: true,
                // Defaulting to unmuted. Note: Most browsers block autoplay with sound,
                // so the user may need to press play manually.
                mute: false,
            });
        } catch (e) {
            console.error("Error setting up JWPlayer instance:", e);
        }

        return () => {
            // This robust cleanup ensures the correct player instance is removed.
            // When navigating between pages, the old component unmounts, this runs,
            // and removes the player, preventing conflicts with the new instance.
            const playerInstance = window.jwplayer(playerId);
            if (playerInstance && typeof playerInstance.remove === 'function') {
                try {
                    playerInstance.remove();
                } catch (e) {
                    console.error("Error removing JWPlayer instance:", e);
                }
            }
        };
    }, [file, title, playerId]);

    return <div id={playerId} className="w-full h-full"></div>;
};

export default JWPlayer;