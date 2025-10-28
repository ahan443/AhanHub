
import React, { useState, useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import QuranPage from './pages/QuranPage';
import AnimePage from './pages/AnimePage';
import FmRadioPage from './pages/FmRadioPage';
import LiveTvPage from './pages/LiveTvPage';
import LiveTvChannelPage from './pages/LiveTvChannelPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import { initialQuranData, initialAnimeData, initialRadioData, initialLiveTvData } from './constants';
import type { Surah, Anime, RadioStation, LiveTvChannel } from './types';
import { db } from './services/firebase';
import { collection, getDocs, doc, writeBatch, setDoc, getDoc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';

const App: React.FC = () => {
  const [quranData, setQuranData] = useState<Surah[]>([]);
  const [animeData, setAnimeData] = useState<Anime[]>([]);
  const [radioData, setRadioData] = useState<RadioStation[]>([]);
  const [liveTvData, setLiveTvData] = useState<LiveTvChannel[]>([]);
  
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true');

  useEffect(() => {
    const fetchCollection = async (
        collectionName: string, 
        setter: React.Dispatch<React.SetStateAction<any[]>>, 
        initialData: any[],
        orderByField?: string
    ) => {
        try {
            const coll = collection(db, collectionName);
            const q = orderByField ? query(coll, orderBy(orderByField)) : coll;
            let snapshot = await getDocs(q);

            if (snapshot.empty) {
                console.log(`${collectionName} collection is empty, seeding data...`);
                const batch = writeBatch(db);
                initialData.forEach(item => {
                    const docId = item.number ? String(item.number).padStart(3, '0') : undefined;
                    const docRef = docId ? doc(coll, docId) : doc(coll);
                    batch.set(docRef, item);
                });
                await batch.commit();
                snapshot = await getDocs(q);
            }
            
            const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

            // Specific logic for anime to show newest first
            if (collectionName === 'anime') {
                setter(list.reverse());
            } else {
                setter(list);
            }

        } catch (error) {
            console.error(`Error fetching or seeding ${collectionName} data:`, error);
            // In case of error, you might want to set some default state or show an error
        }
    };

    fetchCollection('quran', setQuranData, initialQuranData, 'number');
    fetchCollection('anime', setAnimeData, initialAnimeData);
    fetchCollection('radio', setRadioData, initialRadioData);
    fetchCollection('tv', setLiveTvData, initialLiveTvData);

  }, []);


  useEffect(() => {
    sessionStorage.setItem('isAdmin', String(isAdmin));
  }, [isAdmin]);

  // --- CRUD Handlers ---

  // Quran
  const handleAddSurah = async (surah: Surah) => {
     try {
        const docId = String(surah.number).padStart(3, '0');
        const docRef = doc(db, 'quran', docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            throw new Error(`Surah with number ${surah.number} already exists.`);
        }
        await setDoc(docRef, surah);
        setQuranData(prev => [...prev, surah].sort((a,b) => a.number - b.number));
    } catch (e) {
        console.error("Error adding Surah: ", e);
        throw e;
    }
  };
  const handleUpdateSurah = async (number: number, data: Omit<Surah, 'number'>) => {
    try {
        const docId = String(number).padStart(3, '0');
        const docRef = doc(db, 'quran', docId);
        await updateDoc(docRef, data);
        setQuranData(prev => prev.map(s => s.number === number ? { number, ...data } : s));
    } catch (e) {
        console.error("Error updating Surah: ", e);
        throw e;
    }
  };
  const handleDeleteSurah = async (number: number) => {
    try {
        const docId = String(number).padStart(3, '0');
        await deleteDoc(doc(db, 'quran', docId));
        setQuranData(prev => prev.filter(s => s.number !== number));
    } catch (e) {
        console.error("Error deleting Surah: ", e);
        throw e;
    }
  };

  // Anime
  const handleAddAnime = async (anime: Omit<Anime, 'id'>) => {
    try {
        const newDocRef = doc(collection(db, 'anime'));
        await setDoc(newDocRef, anime);
        const newAnimeWithId: Anime = { ...anime, id: newDocRef.id };
        // Prepend new anime to keep the newest ones at the top, consistent with initial load's .reverse()
        setAnimeData(prev => [newAnimeWithId, ...prev]);
    } catch (e) {
        console.error("Error adding Anime: ", e);
        throw e;
    }
  };
   const handleUpdateAnime = async (id: string, data: Omit<Anime, 'id'>) => {
    try {
        const docRef = doc(db, 'anime', id);
        await updateDoc(docRef, data);
        setAnimeData(prev => prev.map(a => a.id === id ? { id, ...data } : a));
    } catch (e) {
        console.error("Error updating Anime: ", e);
        throw e;
    }
  };
  const handleDeleteAnime = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'anime', id));
        setAnimeData(prev => prev.filter(a => a.id !== id));
    } catch (e) {
        console.error("Error deleting Anime: ", e);
        throw e;
    }
  };
  
  // Radio
  const handleAddRadioStation = async (station: Omit<RadioStation, 'id'>) => {
     try {
        const newDocRef = doc(collection(db, 'radio'));
        await setDoc(newDocRef, station);
        const newStationWithId: RadioStation = { ...station, id: newDocRef.id };
        // Append to the end, as the original load doesn't reverse
        setRadioData(prev => [...prev, newStationWithId]);
    } catch (e) {
        console.error("Error adding Radio Station: ", e);
        throw e;
    }
  };
  const handleUpdateRadioStation = async (id: string, data: Omit<RadioStation, 'id'>) => {
    try {
        const docRef = doc(db, 'radio', id);
        await updateDoc(docRef, data);
        setRadioData(prev => prev.map(s => s.id === id ? { id, ...data } : s));
    } catch (e) {
        console.error("Error updating Radio Station: ", e);
        throw e;
    }
  };
  const handleDeleteRadioStation = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'radio', id));
        setRadioData(prev => prev.filter(s => s.id !== id));
    } catch (e) {
        console.error("Error deleting Radio Station: ", e);
        throw e;
    }
  };

  // Live TV
  const handleAddLiveTvChannel = async (channel: Omit<LiveTvChannel, 'id'>) => {
    try {
        const newDocRef = doc(collection(db, 'tv'));
        await setDoc(newDocRef, channel);
        const newChannelWithId: LiveTvChannel = { ...channel, id: newDocRef.id };
        // Append to the end
        setLiveTvData(prev => [...prev, newChannelWithId]);
    } catch (e) {
        console.error("Error adding Live TV Channel: ", e);
        throw e;
    }
  };
   const handleUpdateLiveTvChannel = async (id: string, data: Omit<LiveTvChannel, 'id'>) => {
    try {
        const docRef = doc(db, 'tv', id);
        await updateDoc(docRef, data);
        setLiveTvData(prev => prev.map(c => c.id === id ? { id, ...data } : c));
    } catch (e) {
        console.error("Error updating Live TV Channel: ", e);
        throw e;
    }
  };
  const handleDeleteLiveTvChannel = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'tv', id));
        setLiveTvData(prev => prev.filter(c => c.id !== id));
    } catch (e) {
        console.error("Error deleting Live TV Channel: ", e);
        throw e;
    }
  };


  const MainContent: React.FC = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const getTitle = () => {
      const { pathname } = location;
      if (pathname.startsWith('/live-tv/')) return "Live TV";
      switch(pathname) {
        case '/': return "Home";
        case '/quran': return "Quran Recitations";
        case '/anime': return "Anime Streaming";
        case '/fm-radio': return "FM Radio";
        case '/live-tv': return "Live TV";
        case '/about': return "About AhanHub";
        case '/admin': return "Admin Dashboard";
        case '/admin-login': return "Admin Login";
        default: return "AhanHub";
      }
    };
    
    const isLoginPage = location.pathname === '/admin-login';

    return (
      <div className="flex h-screen bg-transparent text-gray-200 overflow-hidden">
        {!isLoginPage && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            {/* Mobile Header */}
            {!isLoginPage && (
              <header className="lg:hidden flex items-center justify-between p-4 shrink-0 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                  <div className="text-xl font-bold tracking-wider text-white">
                      Ahan<span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Hub</span>
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
              {!isLoginPage && <h1 className="hidden lg:block text-4xl font-bold mb-8 tracking-tight text-white">{getTitle()}</h1>}
              <Routes>
                <Route path="/" element={<HomePage 
                    surahs={quranData.slice(0, 6)} 
                    animes={animeData.slice(0, 5)} 
                    stations={radioData.slice(0, 5)}
                    channels={liveTvData.slice(0, 5)}
                />} />
                <Route path="/quran" element={<QuranPage surahs={quranData} />} />
                <Route path="/anime" element={<AnimePage animes={animeData} />} />
                <Route path="/fm-radio" element={<FmRadioPage stations={radioData} />} />
                <Route path="/live-tv" element={<LiveTvPage channels={liveTvData} />} />
                <Route path="/live-tv/:channelId" element={<LiveTvChannelPage channels={liveTvData} />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin-login" element={<AdminLoginPage onLogin={() => setIsAdmin(true)} />} />
                <Route path="/admin" element={
                  isAdmin ? (
                    <AdminPage 
                      quran={quranData}
                      animes={animeData}
                      radioStations={radioData}
                      tvChannels={liveTvData}
                      onAddSurah={handleAddSurah}
                      onUpdateSurah={handleUpdateSurah}
                      onDeleteSurah={handleDeleteSurah}
                      onAddAnime={handleAddAnime}
                      onUpdateAnime={handleUpdateAnime}
                      onDeleteAnime={handleDeleteAnime}
                      onAddRadioStation={handleAddRadioStation}
                      onUpdateRadioStation={handleUpdateRadioStation}
                      onDeleteRadioStation={handleDeleteRadioStation}
                      onAddLiveTvChannel={handleAddLiveTvChannel}
                      onUpdateLiveTvChannel={handleUpdateLiveTvChannel}
                      onDeleteLiveTvChannel={handleDeleteLiveTvChannel}
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
