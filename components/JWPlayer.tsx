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
    const playerInstance = useRef<any>(null);

    useEffect(() => {
        if (!file || typeof window.jwplayer === 'undefined') {
            return;
        }

        // If player already exists, just load the new file and ensure it's unmuted
        if (playerInstance.current) {
            playerInstance.current.load([{ file, title }]);
            playerInstance.current.setMute(false);
            return;
        }
        
        const player = window.jwplayer(playerId);

        player.setup({
            file: file,
            title: title,
            width: "100%",
            aspectratio: "16:9",
            autostart: true,
            // Explicitly start with sound enabled. Browser may still override this.
            mute: false,
        });

        // On player ready, explicitly try to unmute. 
        // This has a higher chance of success after a user interaction (like clicking a channel).
        player.on('ready', () => {
            player.setMute(false);
        });

        playerInstance.current = player;

        return () => {
            if (playerInstance.current) {
                try {
                    // Check if player is in DOM before removing
                    if (document.getElementById(playerId)) {
                         playerInstance.current.remove();
                    }
                } catch (e) {
                    console.error("Error removing JWPlayer instance:", e);
                }
                playerInstance.current = null;
            }
        };
    }, [file, title, playerId]);

    return <div id={playerId} className="w-full h-full"></div>;
};

export default JWPlayer;
