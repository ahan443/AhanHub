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
import { collection, getDocs, doc, writeBatch, setDoc, getDoc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';

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
        const docRef = await setDoc(doc(collection(db, 'anime')), anime);
        // Note: setDoc doesn't return a ref like addDoc, so we refetch to get the ID. A bit inefficient but simple.
        // A better approach might be to generate an ID client-side.
        const animeList = (await getDocs(collection(db, 'anime'))).docs.map(doc => ({ ...doc.data(), id: doc.id } as Anime));
        setAnimeData(animeList.reverse());
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
        const docRef = await setDoc(doc(collection(db, 'radio')), station);
        const radioList = (await getDocs(collection(db, 'radio'))).docs.map(doc => ({ ...doc.data(), id: doc.id } as RadioStation));
        setRadioData(radioList);
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
        const docRef = await setDoc(doc(collection(db, 'tv')), channel);
        const tvList = (await getDocs(collection(db, 'tv'))).docs.map(doc => ({ ...doc.data(), id: doc.id } as LiveTvChannel));
        setLiveTvData(tvList);
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