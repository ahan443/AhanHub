
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Surah } from '../types';

interface QuranPageProps {
  surahs: Surah[];
}

const QuranPageLoader = () => (
    <div className="animate-fade-in flex flex-col h-full">
        <div className="shrink-0 mb-6">
            <div className="w-full max-w-lg h-11 bg-slate-800/50 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex-grow overflow-y-auto -mr-4 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-slate-900/50 p-4 rounded-xl animate-pulse border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-slate-800"></div>
                                <div>
                                    <div className="h-4 w-24 bg-slate-800 rounded"></div>
                                    <div className="h-3 w-32 bg-slate-800 rounded mt-2"></div>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0 pl-2">
                                <div className="h-5 w-16 bg-slate-800 rounded"></div>
                                <div className="h-2 w-20 bg-slate-800 rounded mt-2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const AutoNextToggleIcon: React.FC<{ enabled: boolean }> = ({ enabled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${enabled ? 'text-cyan-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    {!enabled && (
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19L19 5" />
    )}
  </svg>
);


const QuranPage: React.FC<QuranPageProps> = ({ surahs }) => {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAutoNextEnabled, setIsAutoNextEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('quranAutoNextEnabled');
      return saved !== 'false';
    } catch {
      return true;
    }
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('quranAutoNextEnabled', String(isAutoNextEnabled));
    } catch (e) {
      console.error("Failed to save auto-next preference:", e);
    }
  }, [isAutoNextEnabled]);

  const handleSelectSurah = useCallback((surah: Surah) => {
    setSelectedSurah(surah);
  }, []);

  const handleGoBack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setSelectedSurah(null);
  };

  const filteredSurahs = surahs.filter(surah => {
    const term = searchTerm.toLowerCase();
    return (
      surah.englishName.toLowerCase().includes(term) ||
      surah.name.toLowerCase().includes(term) ||
      (surah.englishNameTranslation && surah.englishNameTranslation.toLowerCase().includes(term)) ||
      surah.number.toString().includes(term)
    );
  });

  const handleAudioEnded = useCallback(() => {
    if (!isAutoNextEnabled || !selectedSurah) return;

    const currentIndex = filteredSurahs.findIndex(s => s.number === selectedSurah.number);
    if (currentIndex > -1 && currentIndex < filteredSurahs.length - 1) {
        const nextSurah = filteredSurahs[currentIndex + 1];
        handleSelectSurah(nextSurah);
    }
  }, [isAutoNextEnabled, selectedSurah, filteredSurahs, handleSelectSurah]);

  if (surahs.length === 0) {
    return <QuranPageLoader />;
  }

  if (selectedSurah) {
    return (
        <div className="animate-fade-in relative flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
            <button
                onClick={handleGoBack}
                className="absolute top-0 left-0 bg-slate-800/50 hover:bg-slate-700/80 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to List
            </button>
            <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-2xl shadow-2xl shadow-cyan-900/20 overflow-hidden">
                <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-white">{selectedSurah.englishName}</h2>
                            <p className="text-lg text-cyan-400">{selectedSurah.englishNameTranslation}</p>
                        </div>
                        <div className="text-4xl font-semibold text-gray-300 text-right" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
                            {selectedSurah.name}
                        </div>
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                        {selectedSurah.revelationType} &bull; {selectedSurah.numberOfAyahs} Ayahs
                    </div>
                </div>
                 {selectedSurah.description && (
                    <div className="p-6 border-y border-slate-800 bg-black/10">
                        <p className="text-gray-300 leading-relaxed">{selectedSurah.description}</p>
                    </div>
                )}
                <div className="p-6 bg-black/30 flex items-center gap-4">
                    <audio
                        ref={audioRef}
                        controls
                        className="w-full"
                        key={selectedSurah.audioUrl}
                        src={selectedSurah.audioUrl}
                        autoPlay
                        onEnded={handleAudioEnded}
                    >
                        Your browser does not support the audio element.
                    </audio>
                    <button
                        onClick={() => setIsAutoNextEnabled(prev => !prev)}
                        className="p-3 rounded-full hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                        aria-label={isAutoNextEnabled ? "Disable Auto-Next" : "Enable Auto-Next"}
                        title={isAutoNextEnabled ? "Auto-Next Enabled" : "Auto-Next Disabled"}
                    >
                        <AutoNextToggleIcon enabled={isAutoNextEnabled} />
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col h-full">
        <div className="shrink-0 mb-6">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Search by name, translation or number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-lg pl-10 pr-4 py-2.5 text-white bg-slate-900/70 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                    aria-label="Search Surahs"
                />
            </div>
        </div>
      
        <div className="flex-grow overflow-y-auto -mr-4 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs.length > 0 ? (
                filteredSurahs.map(surah => (
                    <div
                        key={surah.number}
                        onClick={() => handleSelectSurah(surah)}
                        className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-800/50 hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                                    <span className="text-cyan-400 font-mono font-bold text-lg">{surah.number}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-white">{surah.englishName}</p>
                                    <p className="text-sm text-gray-400">{surah.englishNameTranslation}</p>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0 pl-2">
                                <p className="font-semibold text-xl text-gray-300" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{surah.name}</p>
                                <p className="text-xs text-gray-500">{surah.revelationType} &bull; {surah.numberOfAyahs} Ayahs</p>
                            </div>
                        </div>
                    </div>
                ))
                ) : (
                <div className="text-center py-10 text-gray-400 md:col-span-2 lg:col-span-3">
                    <p>No Surahs found.</p>
                </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default QuranPage;