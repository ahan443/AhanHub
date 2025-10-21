
import React, { useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import QuranPage from './pages/QuranPage';
import AnimePage from './pages/AnimePage';
import FmRadioPage from './pages/FmRadioPage';
import LiveTvPage from './pages/LiveTvPage';
import AboutPage from './pages/AboutPage';
import { QuranData, AnimeData, RadioData, LiveTvData } from './constants';

const App: React.FC = () => {
  const MainContent: React.FC = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const getTitle = () => {
      switch(location.pathname) {
        case '/': return "Quran Recitations";
        case '/anime': return "Anime Streaming";
        case '/fm-radio': return "FM Radio";
        case '/live-tv': return "Live TV";
        case '/about': return "About Us";
        default: return "AhanHub";
      }
    };

    return (
      <div className="flex h-screen bg-slate-900 text-gray-200 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex flex-col flex-1 w-full lg:w-auto overflow-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 shrink-0 border-b border-slate-700/80">
                <div className="text-xl font-bold tracking-wider text-white">
                    Ahan<span className="text-cyan-400">Hub</span>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 rounded-md hover:bg-slate-700/50 text-gray-300 hover:text-white"
                    aria-label="Open menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </header>

            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              <h1 className="hidden lg:block text-3xl font-bold mb-8 tracking-tight text-cyan-400">{getTitle()}</h1>
              <Routes>
                <Route path="/" element={<QuranPage surahs={QuranData} />} />
                <Route path="/anime" element={<AnimePage animes={AnimeData} />} />
                <Route path="/fm-radio" element={<FmRadioPage stations={RadioData} />} />
                <Route path="/live-tv" element={<LiveTvPage channels={LiveTvData} />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
        </div>
      </div>
    );
  };
  
  return (
    <HashRouter>
      <MainContent />
    </HashRouter>
  );
};

export default App;
