import React from 'react';
import { Link } from 'react-router-dom';
import type { Surah, Anime, RadioStation, LiveTvChannel } from '../types';

interface HomePageProps {
  surahs: Surah[];
  animes: Anime[];
  stations: RadioStation[];
  channels: LiveTvChannel[];
}

// Reusable Section Component
const ContentSection: React.FC<{ title: string; viewAllLink: string; children: React.ReactNode; }> = ({ title, viewAllLink, children }) => (
    <section className="mb-16">
        <div className="flex justify-between items-baseline mb-6 border-b-2 border-slate-800 pb-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
            <Link to={viewAllLink} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 group">
                <span>View All</span>
                <span className="transform transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
        </div>
        <div className="flex space-x-6 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
            {children}
        </div>
    </section>
);

// Specific Card Components for Homepage
const QuranCard: React.FC<{ surah: Surah }> = ({ surah }) => (
    <Link 
        to="/quran"
        className="flex-shrink-0 w-72 bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 hover:scale-[1.03]"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                    <span className="text-cyan-400 font-mono font-bold text-lg">{surah.number}</span>
                </div>
                <div>
                    <p className="font-bold text-white truncate">{surah.englishName}</p>
                    <p className="text-sm text-gray-400 truncate">{surah.englishNameTranslation}</p>
                </div>
            </div>
            <p className="font-semibold text-lg text-gray-300 pl-2" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{surah.name}</p>
        </div>
    </Link>
);

const AnimeCard: React.FC<{ anime: Anime }> = ({ anime }) => (
    <Link 
        to="/anime"
        className="flex-shrink-0 w-44 group cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03]"
    >
        <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg border-2 border-slate-800 transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-xl group-hover:shadow-cyan-500/15">
            <img src={anime.imageUrl} alt={anime.title} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-bold text-base leading-tight drop-shadow-md">{anime.title}</h3>
            </div>
        </div>
    </Link>
);


const RadioCard: React.FC<{ station: RadioStation }> = ({ station }) => (
    <Link 
        to="/fm-radio"
        className="flex-shrink-0 w-52 group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 hover:scale-[1.03] text-center overflow-hidden"
    >
        <div className="absolute -inset-2 bg-cyan-500/10 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 blur-2xl"></div>
        <div className="relative flex items-center justify-center h-20 mb-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-400 group-hover:text-cyan-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
            </svg>
        </div>
        <div className="relative">
             <p className="font-bold text-white truncate">{station.name}</p>
             <p className="text-sm text-gray-400">{station.genre}</p>
        </div>
    </Link>
);


const TvCard: React.FC<{ channel: LiveTvChannel }> = ({ channel }) => (
    <Link
        to={`/live-tv/${channel.id}`}
        aria-label={`Play ${channel.name}`}
        className="flex-shrink-0 w-52 group transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03]"
    >
        <div className="aspect-video bg-slate-900/50 backdrop-blur-sm border-2 border-slate-800 rounded-lg shadow-lg flex items-center justify-center p-3 transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-xl group-hover:shadow-cyan-500/15">
            <img src={channel.logoUrl} alt={`${channel.name} logo`} className="max-h-full max-w-full object-contain" />
        </div>
        <p className="text-center text-white font-semibold mt-3 px-1 truncate">{channel.name}</p>
    </Link>
);


// Main HomePage Component
const HomePage: React.FC<HomePageProps> = ({ surahs, animes, stations, channels }) => {
    return (
        <div className="animate-fade-in">
            <div className="text-center mb-16 pt-8">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                    Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">AhanHub</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-gray-400">
                    Your all-in-one destination for spiritual reflection, captivating anime, global radio stations, and live television.
                </p>
            </div>

            {surahs.length > 0 && (
                 <ContentSection title="Featured Surahs" viewAllLink="/quran">
                    {surahs.map(surah => <QuranCard key={surah.number} surah={surah} />)}
                </ContentSection>
            )}
            
            {animes.length > 0 && (
                <ContentSection title="Popular Anime" viewAllLink="/anime">
                    {animes.map(anime => <AnimeCard key={anime.id} anime={anime} />)}
                </ContentSection>
            )}
            
            {stations.length > 0 && (
                <ContentSection title="FM Radio Stations" viewAllLink="/fm-radio">
                    {stations.map(station => <RadioCard key={station.id} station={station} />)}
                </ContentSection>
            )}

            {channels.length > 0 && (
                <ContentSection title="Live TV Channels" viewAllLink="/live-tv">
                    {channels.map(channel => <TvCard key={channel.id} channel={channel} />)}
                </ContentSection>
            )}
        </div>
    );
};

export default HomePage;