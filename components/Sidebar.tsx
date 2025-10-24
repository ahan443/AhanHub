import React from 'react';
import { NavLink } from 'react-router-dom';

const IconQuran: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.996h18M12 6.253a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0 11.494a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM5 8.253a2.5 2.5 0 00-2.5 2.5v3.5a2.5 2.5 0 105 0v-3.5a2.5 2.5 0 00-2.5-2.5zM19 8.253a2.5 2.5 0 00-2.5 2.5v3.5a2.5 2.5 0 105 0v-3.5a2.5 2.5 0 00-2.5-2.5z" />
  </svg>
);

const IconAnime: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const IconRadio: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
  </svg>
);

const IconLiveTv: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const IconAbout: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconAdmin: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navLinkClasses = "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200";
  const activeClasses = "bg-cyan-500/20 text-cyan-400 font-semibold";
  const inactiveClasses = "text-gray-400 hover:bg-slate-700/50 hover:text-white";

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-30 h-full w-64 bg-slate-800/50 p-4 flex flex-col border-r border-slate-700 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-10">
          <div className="text-2xl font-bold tracking-wider text-white">
            Ahan<span className="text-cyan-400">Hub</span>
          </div>
          <button onClick={closeSidebar} className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-slate-700/50" aria-label="Close menu">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col space-y-2">
          <NavLink to="/" onClick={closeSidebar} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <IconQuran />
            <span>Quran</span>
          </NavLink>
          <NavLink to="/anime" onClick={closeSidebar} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <IconAnime />
            <span>Anime</span>
          </NavLink>
          <NavLink to="/fm-radio" onClick={closeSidebar} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <IconRadio />
            <span>FM Radio</span>
          </NavLink>
           <NavLink to="/live-tv" onClick={closeSidebar} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <IconLiveTv />
            <span>Live TV</span>
          </NavLink>
        </nav>
        <div className="mt-auto border-t border-slate-700/50 pt-2 space-y-2">
           <NavLink to="/admin" onClick={closeSidebar} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <IconAdmin />
            <span>Login</span>
          </NavLink>
           <NavLink to="/about" onClick={closeSidebar} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <IconAbout />
            <span>About Us</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;