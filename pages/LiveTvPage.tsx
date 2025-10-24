import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { LiveTvChannel } from '../types';
import JWPlayer from '../components/JWPlayer';

interface LiveTvPageProps {
  channels: LiveTvChannel[];
}

const LiveTvPageLoader = () => (
    <div className="animate-fade-in flex flex-col h-full">
        {/* Search and Filters */}
        <div className="shrink-0 mb-6 space-y-4">
            <div className="w-full max-w-lg h-11 bg-slate-800/50 rounded-lg animate-pulse"></div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="shrink-0 h-9 w-20 bg-slate-700/50 rounded-full animate-pulse"></div>
                ))}
            </div>
        </div>
        <div className="flex-grow overflow-y-auto -mr-4 pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-video bg-slate-800/50 rounded-lg"></div>
                        <div className="h-4 w-3/4 bg-slate-800/50 rounded mt-3 mx-auto"></div>
                        <div className="h-3 w-1/2 bg-slate-800/50 rounded mt-2 mx-auto"></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


const LiveTvPage: React.FC<LiveTvPageProps> = ({ channels }) => {
  const [selectedChannel, setSelectedChannel] = useState<LiveTvChannel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedChannel && backButtonRef.current) {
      backButtonRef.current.focus();
    }
  }, [selectedChannel]);


  const categories = useMemo(() => ['All', ...Array.from(new Set(channels.map(c => c.category)))], [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || selectedCategory === 'All' || channel.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [channels, searchTerm, selectedCategory]);

  if (loading) {
    return <LiveTvPageLoader />;
  }

  if (selectedChannel) {
    const useJwPlayer = selectedChannel.type === 'hls' || selectedChannel.streamUrl.endsWith('.m3u8');

    return (
      <div className="animate-fade-in">
        <button
          ref={backButtonRef}
          onClick={() => setSelectedChannel(null)}
          className="mb-6 bg-slate-700/50 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Channel List
        </button>

        <h2 className="text-3xl font-bold text-cyan-400 mb-4">{selectedChannel.name}</h2>
        
        <div className="aspect-video bg-black rounded-lg shadow-2xl shadow-cyan-900/20 border border-slate-700/50 overflow-hidden">
          {useJwPlayer ? (
             <JWPlayer key={selectedChannel.id} file={selectedChannel.streamUrl} title={selectedChannel.name} />
          ) : (
            <iframe
              src={selectedChannel.streamUrl}
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
  }

  return (
    <div className="animate-fade-in flex flex-col h-full">
      {/* Search and Filters */}
      <div className="shrink-0 mb-6 space-y-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg pl-10 pr-4 py-2.5 text-white bg-slate-800/50 border border-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 focus:border-transparent"
            aria-label="Search TV Channels"
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'All' ? null : category)}
              className={`shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${selectedCategory === category || (category === 'All' && !selectedCategory) ? 'bg-cyan-500 text-white' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto -mr-4 pr-4">
        {filteredChannels.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredChannels.map(channel => (
              <div
                key={channel.id}
                role="button"
                tabIndex={0}
                aria-label={`Play ${channel.name}`}
                onClick={() => setSelectedChannel(channel)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedChannel(channel); }}
                className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg transition-all duration-300 transform hover:-translate-y-1 focus:-translate-y-1 hover:scale-105 focus:scale-105"
              >
                <div className="aspect-video bg-slate-800/50 rounded-lg shadow-lg flex items-center justify-center p-3 border border-slate-700/50 transition-all duration-300 group-hover:border-cyan-500/50 group-hover:bg-slate-700/80 group-focus:border-cyan-500/50 group-focus:bg-slate-700/80">
                  <img src={channel.logoUrl} alt={`${channel.name} logo`} className="max-h-full max-w-full object-contain" />
                </div>
                <p className="text-center text-white font-semibold mt-2 px-1 truncate">{channel.name}</p>
                <p className="text-center text-gray-400 text-xs px-1">{channel.category}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p>No TV channels found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTvPage;