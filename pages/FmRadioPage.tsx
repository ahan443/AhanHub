
import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { RadioStation } from '../types';

interface FmRadioPageProps {
  stations: RadioStation[];
}

const PlayIcon: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const StarIcon: React.FC<{ isFavorite: boolean }> = ({ isFavorite }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-500'}`} viewBox="0 0 20 20" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const FmRadioPageLoader = () => (
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
            <div className="mb-8">
                <div className="h-6 w-32 bg-slate-700/50 rounded animate-pulse mb-4 px-1"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl animate-pulse text-center">
                            <div className="flex items-center justify-center h-20 mb-3">
                                <div className="h-12 w-12 bg-slate-800 rounded-full"></div>
                            </div>
                            <div className="h-4 w-24 bg-slate-800 rounded mx-auto"></div>
                            <div className="h-3 w-16 bg-slate-800 rounded mx-auto mt-2"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);


const FmRadioPage: React.FC<FmRadioPageProps> = ({ stations }) => {
  const [selectedStation, setSelectedStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
        const savedFavorites = localStorage.getItem('favoriteStations');
        if (savedFavorites) {
            const parsed = JSON.parse(savedFavorites);
            // Ensure we only load an array of strings, filtering out any old numeric IDs or other invalid data.
            if (Array.isArray(parsed)) {
                return parsed.filter(id => typeof id === 'string');
            }
        }
        return [];
    } catch (error) {
        console.error("Could not parse favorite stations from localStorage", error);
        return [];
    }
  });
  
  const genres = useMemo(() => ['All', ...Array.from(new Set(stations.map(s => s.genre)))], [stations]);

  useEffect(() => {
    try {
        localStorage.setItem('favoriteStations', JSON.stringify(favorites));
    } catch (error) {
        console.error("Could not save favorite stations to localStorage", error);
    }
  }, [favorites]);
  
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
        const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) || station.genre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = !selectedGenre || selectedGenre === 'All' || station.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });
  }, [stations, searchTerm, selectedGenre]);


  const currentTrack = selectedStation?.tracks[0];

  const handleSelectStation = (station: RadioStation) => {
    setSelectedStation(station);
    setIsPlaying(true);
  }

  useEffect(() => {
    if (currentTrack && audioRef.current) {
        audioRef.current.src = currentTrack.audioUrl;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        setIsPlaying(true);
    }
  }, [currentTrack]);
  
  const handlePlayPause = () => {
    if(audioRef.current){
        if(isPlaying){
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
        setIsPlaying(!isPlaying);
    }
  };
  
  const handleNextPrev = (direction: 'next' | 'prev') => {
    if (!selectedStation) return;
    const currentIndex = filteredStations.findIndex(s => s.id === selectedStation.id);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % filteredStations.length;
    } else {
        nextIndex = (currentIndex - 1 + filteredStations.length) % filteredStations.length;
    }
    setSelectedStation(filteredStations[nextIndex]);
  };

  const handleGoBack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setSelectedStation(null);
  };
  
  const toggleFavorite = (stationId: string) => {
    setFavorites(prevFavorites => {
        if (prevFavorites.includes(stationId)) {
            return prevFavorites.filter(id => id !== stationId);
        } else {
            return [...prevFavorites, stationId];
        }
    });
  };

  if (stations.length === 0) {
    return <FmRadioPageLoader />;
  }

  if (selectedStation && currentTrack) {
    return (
      <div className="animate-fade-in relative flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
         <button
          onClick={handleGoBack}
          className="absolute top-0 left-0 bg-slate-800/50 hover:bg-slate-700/80 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to List
        </button>

        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-900/40 -z-10 rounded-lg"></div>

        <div className="w-full max-w-md text-center p-8">
            <div className={`relative w-64 h-64 mx-auto mb-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-900/20 border-4 border-slate-800`}>
                <div className={`absolute inset-0 rounded-full transition-all duration-500 ${isPlaying ? 'scale-100 animate-pulse shadow-[0_0_40px_10px_rgba(34,211,238,0.2)] bg-cyan-500/10' : 'scale-0'}`}></div>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-cyan-400 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
                </svg>
            </div>

            <div className="flex items-center justify-center space-x-3 mb-2">
                 <h2 className="text-4xl font-bold text-white truncate">{selectedStation.name}</h2>
                 <button onClick={() => toggleFavorite(selectedStation.id)} aria-label="Toggle Favorite">
                    <StarIcon isFavorite={favorites.includes(selectedStation.id)} />
                 </button>
            </div>
            <p className="text-lg text-cyan-400 mb-8">{selectedStation.genre}</p>

            <div className="flex items-center justify-center space-x-6">
                <button onClick={() => handleNextPrev('prev')} className="text-gray-400 hover:text-white transition-colors p-2" aria-label="Previous Station">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                </button>

                <button
                    onClick={handlePlayPause}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-5 shadow-lg shadow-cyan-500/30 transition-all duration-300"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                
                <button onClick={() => handleNextPrev('next')} className="text-gray-400 hover:text-white transition-colors p-2" aria-label="Next Station">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
        <audio ref={audioRef} key={selectedStation.id} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      </div>
    );
  }

  const favoriteStations = stations.filter(s => favorites.includes(s.id));

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
                    placeholder="Search stations or countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-lg pl-10 pr-4 py-2.5 text-white bg-slate-900/70 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                    aria-label="Search Stations"
                />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {genres.map(genre => (
                    <button 
                        key={genre}
                        onClick={() => setSelectedGenre(genre === 'All' ? null : genre)}
                        className={`shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${selectedGenre === genre || (genre === 'All' && !selectedGenre) ? 'bg-cyan-500 text-white' : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'}`}
                    >
                        {genre}
                    </button>
                ))}
            </div>
        </div>
      
        <div className="flex-grow overflow-y-auto -mr-4 pr-4">
             {/* Favorites Section */}
            {favoriteStations.length > 0 && (!selectedGenre || selectedGenre === 'All') && !searchTerm && (
                 <div className="mb-8">
                    <h3 className="font-bold text-yellow-400 text-lg mb-4 px-1">Favorites</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {favoriteStations.map(station => (
                            <StationCard key={`fav-${station.id}`} station={station} isFavorite={true} onSelect={handleSelectStation} onToggleFavorite={toggleFavorite} />
                        ))}
                    </div>
                 </div>
            )}
            
            {/* All Stations Section */}
            <div>
                 <h3 className="font-bold text-cyan-400 text-lg mb-4 px-1">{selectedGenre || "All Stations"}</h3>
                 {filteredStations.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredStations.map(station => (
                            <StationCard key={station.id} station={station} isFavorite={favorites.includes(station.id)} onSelect={handleSelectStation} onToggleFavorite={toggleFavorite} />
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-10 text-gray-400">
                        <p>No stations found.</p>
                    </div>
                 )}
            </div>
        </div>
    </div>
  );
};

interface StationCardProps {
    station: RadioStation;
    isFavorite: boolean;
    onSelect: (station: RadioStation) => void;
    onToggleFavorite: (id: string) => void;
}

const StationCard: React.FC<StationCardProps> = ({ station, isFavorite, onSelect, onToggleFavorite }) => {
    return (
        <div onClick={() => onSelect(station)} className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-800/50 hover:-translate-y-1 text-center">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(station.id);
                }}
                className="absolute top-2 right-2 p-1 z-10"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <StarIcon isFavorite={isFavorite} />
            </button>
            <div className="flex items-center justify-center h-20 mb-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
                </svg>
            </div>
            <p className="font-bold text-white truncate">{station.name}</p>
            <p className="text-sm text-gray-400">{station.genre}</p>
        </div>
    );
};

export default FmRadioPage;
