import React, { useMemo, useRef, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import type { LiveTvChannel } from '../types';
import JWPlayer from '../components/JWPlayer';

interface LiveTvChannelPageProps {
  channels: LiveTvChannel[];
}

const LiveTvChannelPage: React.FC<LiveTvChannelPageProps> = ({ channels }) => {
    const { channelId } = useParams<{ channelId: string }>();
    
    const selectedChannel = useMemo(() => 
        channels.find(c => c.id === channelId), 
        [channels, channelId]
    );

    const backButtonRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (backButtonRef.current) {
            backButtonRef.current.focus();
        }
        window.scrollTo(0, 0);
    }, [selectedChannel]);

    const streamUrl = useMemo(() => {
        if (!selectedChannel) return '';
        let url = selectedChannel.streamUrl;
        if (selectedChannel.type === 'embed' && url.includes('youtube.com/embed')) {
            try {
                const urlObject = new URL(url);
                urlObject.searchParams.set('autoplay', '1');
                // Removed mute=1 to default to unmuted playback.
                // Note: Most browsers block autoplay with sound, requiring user interaction to start.
                urlObject.searchParams.set('enablejsapi', '1');
                urlObject.searchParams.set('origin', window.location.origin);
                return urlObject.toString();
            } catch (e) {
                console.error("Invalid URL for YouTube embed:", url, e);
                return url; // fallback to original url
            }
        }
        return url;
    }, [selectedChannel]);

    if (!selectedChannel) {
        return <Navigate to="/live-tv" replace />;
    }

    const useJwPlayer = selectedChannel.type === 'hls' || selectedChannel.streamUrl.endsWith('.m3u8');

    return (
        <div className="animate-fade-in">
            <Link
                ref={backButtonRef}
                to="/live-tv"
                className="mb-6 bg-slate-800/50 hover:bg-slate-700/80 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Channel List
            </Link>

            <h2 className="text-3xl font-bold text-white mb-4">{selectedChannel.name}</h2>
            
            <div className="aspect-video bg-black rounded-lg shadow-2xl shadow-cyan-900/20 border border-slate-800 overflow-hidden">
                {useJwPlayer ? (
                    <JWPlayer key={selectedChannel.id} file={selectedChannel.streamUrl} title={selectedChannel.name} />
                ) : (
                    <iframe
                        key={selectedChannel.id}
                        src={streamUrl}
                        title={`${selectedChannel.name} Live Stream`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                )}
            </div>
        </div>
    );
};

export default LiveTvChannelPage;