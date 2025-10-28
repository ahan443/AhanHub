
import React, { useState, useEffect } from 'react';
import type { Anime } from '../types';

interface AnimePageProps {
  animes: Anime[];
}

const AnimePageLoader = () => (
    <div className="animate-fade-in">
        <div className="mb-8">
            <div className="w-full max-w-lg h-10 bg-slate-800/50 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-[2/3] bg-slate-800/50 rounded-lg"></div>
                </div>
            ))}
        </div>
    </div>
);

const AnimePage: React.FC<AnimePageProps> = ({ animes }) => {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnimes = animes.filter(anime =>
    anime.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (animes.length === 0) {
    return <AnimePageLoader />;
  }

  if (selectedAnime) {
    const currentEpisode = selectedAnime.episodes.find(ep => ep.videoUrl === selectedVideoUrl);
    
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => {
            setSelectedAnime(null);
            setSelectedVideoUrl(null);
          }}
          className="mb-6 bg-slate-800/50 hover:bg-slate-700/80 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to List
        </button>

        <div>
            {/* Title and Synopsis first */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">{selectedAnime.title}</h2>
                <p className="text-gray-300 mt-2 leading-relaxed max-w-4xl">{selectedAnime.synopsis}</p>
            </div>

            {/* Player and Episode List */}
            <div>
                {selectedVideoUrl ? (
                    <div className="aspect-video bg-black rounded-lg mb-4 overflow-hidden border border-slate-800 shadow-2xl shadow-cyan-900/20">
                        <iframe
                            key={selectedVideoUrl}
                            src={selectedVideoUrl}
                            title={currentEpisode ? `${selectedAnime.title} - ${currentEpisode.title}` : selectedAnime.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div className="aspect-video bg-slate-900/50 border border-slate-800 rounded-lg mb-4 flex items-center justify-center">
                        <p className="text-gray-400">Select an episode to begin watching</p>
                    </div>
                )}
                
                <h3 className="text-2xl font-semibold mb-4 border-b-2 border-slate-800 pb-2 text-cyan-400">Episodes</h3>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {selectedAnime.episodes.length > 0 ? selectedAnime.episodes.map(episode => (
                        <div
                            key={episode.number}
                            onClick={() => setSelectedVideoUrl(episode.videoUrl)}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 flex items-center space-x-4 border ${selectedVideoUrl === episode.videoUrl ? 'bg-cyan-900/50 border-cyan-700' : 'bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/50'}`}
                        >
                            <div className="text-cyan-400 font-bold text-2xl w-8 text-center">{episode.number}</div>
                            <div>
                                <p className="font-semibold text-white">{episode.title}</p>
                            </div>
                        </div>
                    )) : <p className="text-gray-400">No episodes available for this series yet.</p>}
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
        <div className="mb-8">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Search for anime..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-lg pl-10 pr-4 py-2.5 text-white bg-slate-900/70 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                    aria-label="Search Anime"
                />
            </div>
        </div>

      {filteredAnimes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredAnimes.map(anime => (
            <div
              key={anime.id}
              onClick={() => setSelectedAnime(anime)}
              className="group cursor-pointer transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg">
                <img src={anime.imageUrl} alt={anime.title} className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-lg">{anime.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
            <p>No anime found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default AnimePage;
