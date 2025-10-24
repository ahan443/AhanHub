import React, { useState, useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import QuranPage from './pages/QuranPage';
import AnimePage from './pages/AnimePage';
import FmRadioPage from './pages/FmRadioPage';
import LiveTvPage from './pages/LiveTvPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import { initialQuranData, initialAnimeData, initialRadioData, initialLiveTvData } from './constants';
import type { Surah, Anime, RadioStation, LiveTvChannel } from './types';

const App: React.FC = () => {
  const [quranData, setQuranData] = useState<Surah[]>(initialQuranData);
  const [animeData, setAnimeData] = useState<Anime[]>(initialAnimeData);
  const [radioData, setRadioData] = useState<RadioStation[]>(initialRadioData);
  const [liveTvData, setLiveTvData] = useState<LiveTvChannel[]>(initialLiveTvData);

  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true');

  useEffect(() => {
    sessionStorage.setItem('isAdmin', String(isAdmin));
  }, [isAdmin]);

  const handleAddSurah = (surah: Omit<Surah, 'number'>) => {
    const newSurah: Surah = {
      ...surah,
      number: quranData.length > 0 ? Math.max(...quranData.map(s => s.number)) + 1 : 1,
    };
    setQuranData(prev => [newSurah, ...prev]);
  };

  const handleAddAnime = (anime: Omit<Anime, 'id'>) => {
    const newAnime: Anime = {
      ...anime,
      id: Date.now(),
    };
    setAnimeData(prev => [newAnime, ...prev]);
  };
  
  const handleAddRadioStation = (station: Omit<RadioStation, 'id'>) => {
    const newStation: RadioStation = {
        ...station,
        id: Date.now(),
    };
    setRadioData(prev => [newStation, ...prev]);
  };

  const handleAddLiveTvChannel = (channel: Omit<LiveTvChannel, 'id'>) => {
    const newChannel: LiveTvChannel = {
        ...channel,
        id: Date.now(),
    };
    setLiveTvData(prev => [newChannel, ...prev]);
  };

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
        case '/admin': return "Admin Panel";
        case '/admin-login': return "Login";
        default: return "AhanHub";
      }
    };
    
    const isLoginPage = location.pathname === '/admin-login';
    const isAdminPage = location.pathname === '/admin';


    return (
      <div className="flex h-screen bg-slate-900 text-gray-200 overflow-hidden">
        {!isLoginPage && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
        <div className="flex flex-col flex-1 w-full lg:w-auto overflow-hidden">
            {/* Mobile Header */}
            {!isLoginPage && (
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
            )}

            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {!isLoginPage && <h1 className="hidden lg:block text-3xl font-bold mb-8 tracking-tight text-cyan-400">{getTitle()}</h1>}
              <Routes>
                <Route path="/" element={<QuranPage surahs={quranData} />} />
                <Route path="/anime" element={<AnimePage animes={animeData} />} />
                <Route path="/fm-radio" element={<FmRadioPage stations={radioData} />} />
                <Route path="/live-tv" element={<LiveTvPage channels={liveTvData} />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin-login" element={<AdminLoginPage onLogin={() => setIsAdmin(true)} />} />
                <Route path="/admin" element={
                  isAdmin ? (
                    <AdminPage 
                      onAddSurah={handleAddSurah}
                      onAddAnime={handleAddAnime}
                      onAddRadioStation={handleAddRadioStation}
                      onAddLiveTvChannel={handleAddLiveTvChannel}
                      onLogout={() => setIsAdmin(false)}
                    />
                  ) : (
                    <Navigate to="/admin-login" />
                  )
                }/>
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