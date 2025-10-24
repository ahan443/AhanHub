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
import { db } from './services/firebase';
import { collection, getDocs, addDoc, writeBatch, doc, orderBy, query } from 'firebase/firestore';

const App: React.FC = () => {
  const [quranData, setQuranData] = useState<Surah[]>([]);
  const [animeData, setAnimeData] = useState<Anime[]>([]);
  const [radioData, setRadioData] = useState<RadioStation[]>([]);
  const [liveTvData, setLiveTvData] = useState<LiveTvChannel[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true');

  useEffect(() => {
    const fetchAndSeedData = async () => {
      try {
        // --- Quran ---
        const quranCollection = collection(db, 'quran');
        let quranSnapshot = await getDocs(query(quranCollection, orderBy('number')));
        if (quranSnapshot.empty) {
          console.log('Quran collection is empty, seeding data...');
          const batch = writeBatch(db);
          initialQuranData.forEach(surah => {
            const docRef = doc(quranCollection, String(surah.number).padStart(3, '0'));
            batch.set(docRef, surah);
          });
          await batch.commit();
          quranSnapshot = await getDocs(query(quranCollection, orderBy('number')));
        }
        const quranList = quranSnapshot.docs.map(doc => doc.data() as Surah);
        setQuranData(quranList);

        // --- Anime ---
        const animeCollection = collection(db, 'anime');
        let animeSnapshot = await getDocs(animeCollection);
        if (animeSnapshot.empty) {
            console.log('Anime collection is empty, seeding data...');
            const batch = writeBatch(db);
            initialAnimeData.forEach(anime => {
                const docRef = doc(animeCollection);
                batch.set(docRef, anime);
            });
            await batch.commit();
            animeSnapshot = await getDocs(animeCollection);
        }
        const animeList = animeSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Anime));
        setAnimeData(animeList.reverse());


        // --- Radio ---
        const radioCollection = collection(db, 'radio');
        let radioSnapshot = await getDocs(radioCollection);
        if (radioSnapshot.empty) {
            console.log('Radio collection is empty, seeding data...');
            const batch = writeBatch(db);
            initialRadioData.forEach(station => {
                const docRef = doc(radioCollection);
                batch.set(docRef, station);
            });
            await batch.commit();
            radioSnapshot = await getDocs(radioCollection);
        }
        const radioList = radioSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as RadioStation));
        setRadioData(radioList);


        // --- Live TV ---
        const tvCollection = collection(db, 'tv');
        let tvSnapshot = await getDocs(tvCollection);
        if (tvSnapshot.empty) {
            console.log('Live TV collection is empty, seeding data...');
            const batch = writeBatch(db);
            initialLiveTvData.forEach(channel => {
                const docRef = doc(tvCollection);
                batch.set(docRef, channel);
            });
            await batch.commit();
            tvSnapshot = await getDocs(tvCollection);
        }
        const tvList = tvSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as LiveTvChannel));
        setLiveTvData(tvList);

      } catch (error) {
        console.error("Error fetching or seeding data:", error);
        alert("Could not connect to Firebase. Please check your configuration in services/firebase.ts and ensure Firestore is enabled in your project.");
      } finally {
        setDataLoaded(true);
      }
    };

    fetchAndSeedData();
  }, []);


  useEffect(() => {
    sessionStorage.setItem('isAdmin', String(isAdmin));
  }, [isAdmin]);

  const handleAddSurah = async (surah: Omit<Surah, 'number'>) => {
    const newSurahNumber = quranData.length > 0 ? Math.max(...quranData.map(s => s.number)) + 1 : 1;
    const newSurah: Surah = {
      ...surah,
      number: newSurahNumber,
    };
     try {
        await addDoc(collection(db, 'quran'), newSurah);
        setQuranData(prev => [newSurah, ...prev].sort((a,b) => a.number - b.number));
    } catch (e) {
        console.error("Error adding Surah: ", e);
    }
  };

  const handleAddAnime = async (anime: Omit<Anime, 'id'>) => {
    try {
        const docRef = await addDoc(collection(db, 'anime'), anime);
        const newAnime: Anime = {
            ...anime,
            id: docRef.id,
        };
        setAnimeData(prev => [newAnime, ...prev]);
    } catch (e) {
        console.error("Error adding Anime: ", e);
    }
  };
  
  const handleAddRadioStation = async (station: Omit<RadioStation, 'id'>) => {
     try {
        const docRef = await addDoc(collection(db, 'radio'), station);
        const newStation: RadioStation = {
            ...station,
            id: docRef.id,
        };
        setRadioData(prev => [newStation, ...prev]);
    } catch (e) {
        console.error("Error adding Radio Station: ", e);
    }
  };

  const handleAddLiveTvChannel = async (channel: Omit<LiveTvChannel, 'id'>) => {
    try {
        const docRef = await addDoc(collection(db, 'tv'), channel);
        const newChannel: LiveTvChannel = {
            ...channel,
            id: docRef.id,
        };
        setLiveTvData(prev => [newChannel, ...prev]);
    } catch (e) {
        console.error("Error adding Live TV Channel: ", e);
    }
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

    if (!dataLoaded && !isLoginPage) {
      return (
        <div className="flex items-center justify-center h-screen w-screen">
          <div className="text-center">
            <div className="text-2xl font-bold tracking-wider text-white mb-4">
                Ahan<span className="text-cyan-400">Hub</span>
            </div>
            <p className="text-gray-300">Loading Content...</p>
          </div>
        </div>
      )
    }

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