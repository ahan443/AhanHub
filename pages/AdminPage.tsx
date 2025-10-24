import React, { useState } from 'react';
import type { Surah, Anime, RadioStation, LiveTvChannel, Episode } from '../types';

type AdminPageProps = {
    onAddSurah: (surah: Omit<Surah, 'number'>) => void;
    onAddAnime: (anime: Omit<Anime, 'id'>) => void;
    onAddRadioStation: (station: Omit<RadioStation, 'id'>) => void;
    onAddLiveTvChannel: (channel: Omit<LiveTvChannel, 'id'>) => void;
    onLogout: () => void;
}

type Tab = 'quran' | 'anime' | 'radio' | 'tv';

const AdminPage: React.FC<AdminPageProps> = ({ onAddSurah, onAddAnime, onAddRadioStation, onAddLiveTvChannel, onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('anime');

    const renderForm = () => {
        switch (activeTab) {
            case 'anime': return <AnimeForm onAdd={onAddAnime} />;
            case 'quran': return <QuranForm onAdd={onAddSurah} />;
            case 'radio': return <RadioForm onAdd={onAddRadioStation} />;
            case 'tv': return <TvForm onAdd={onAddLiveTvChannel} />;
            default: return null;
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-end mb-4">
                <button
                    onClick={onLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors inline-flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg">
                <div className="flex border-b border-slate-700">
                    <TabButton name="Anime" tab="anime" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Quran" tab="quran" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="FM Radio" tab="radio" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Live TV" tab="tv" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="p-4 sm:p-6">
                    {renderForm()}
                </div>
            </div>
        </div>
    );
};

// --- Child Components for Forms ---

const TabButton: React.FC<{ name: string; tab: Tab; activeTab: Tab; setActiveTab: (tab: Tab) => void; }> = ({ name, tab, activeTab, setActiveTab }) => {
    const isActive = activeTab === tab;
    return (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 sm:px-6 font-semibold text-sm transition-colors focus:outline-none ${isActive ? 'bg-slate-700/50 text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:bg-slate-700/20'}`}
        >
            {name}
        </button>
    )
}

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div className="mb-4">
        <label htmlFor={props.id} className="block text-gray-300 text-sm font-bold mb-2">{label}</label>
        <input {...props} className="w-full px-3 py-2 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" />
    </div>
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div className="mb-4">
        <label htmlFor={props.id} className="block text-gray-300 text-sm font-bold mb-2">{label}</label>
        <textarea {...props} className="w-full px-3 py-2 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" />
    </div>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div className="mb-4">
        <label htmlFor={props.id} className="block text-gray-300 text-sm font-bold mb-2">{label}</label>
        <select {...props} className="w-full px-3 py-2 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors">
            {children}
        </select>
    </div>
);

const SubmitButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        {children}
    </button>
);

const FormMessage: React.FC<{ message: string; type: 'success' | 'error'}> = ({ message, type }) => {
    if (!message) return null;
    const colors = type === 'success' ? 'bg-green-800/50 border-green-600 text-green-300' : 'bg-red-800/50 border-red-600 text-red-300';
    return <div className={`mt-4 p-3 border rounded-lg ${colors}`}>{message}</div>;
}


const AnimeForm: React.FC<{ onAdd: (anime: Omit<Anime, 'id'>) => void }> = ({ onAdd }) => {
    const [formState, setFormState] = useState({ title: '', imageUrl: '', synopsis: '', episodes: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const { title, imageUrl, synopsis, episodes: episodesStr } = formState;
        if (!title || !imageUrl || !synopsis) {
            setError("Please fill in all fields.");
            return;
        }

        let episodes: Episode[] = [];
        if (episodesStr.trim()) {
            try {
                const parsedEpisodes = JSON.parse(episodesStr);
                if (Array.isArray(parsedEpisodes)) {
                    episodes = parsedEpisodes.map((ep, index) => ({
                        number: ep.number || index + 1,
                        title: ep.title || `Episode ${index + 1}`,
                        videoUrl: ep.videoUrl,
                        synopsis: ep.synopsis || ''
                    }));
                } else {
                    throw new Error("JSON is not an array.");
                }
            } catch (err) {
                setError("Invalid JSON format for episodes. Please provide an array of objects like [{ \"title\": \"Ep 1\", \"videoUrl\": \"...\" }].");
                return;
            }
        }
        
        onAdd({ title, imageUrl, synopsis, episodes });
        setMessage(`Successfully added "${title}"!`);
        setFormState({ title: '', imageUrl: '', synopsis: '', episodes: '' });
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4 text-white">Add New Anime</h3>
            <FormInput label="Title" id="title" name="title" value={formState.title} onChange={handleChange} required />
            <FormInput label="Image URL" id="imageUrl" name="imageUrl" type="url" value={formState.imageUrl} onChange={handleChange} required />
            <FormTextarea label="Synopsis" id="synopsis" name="synopsis" rows={4} value={formState.synopsis} onChange={handleChange} required />
            <FormTextarea label="Episodes (JSON format)" id="episodes" name="episodes" rows={5} value={formState.episodes} onChange={handleChange} placeholder='[&#10;  { "title": "Episode 1", "videoUrl": "https://.../embed-1.html" },&#10;  { "title": "Episode 2", "videoUrl": "https://.../embed-2.html" }&#10;]' />
            <SubmitButton>Add Anime</SubmitButton>
            <FormMessage message={message} type="success" />
            <FormMessage message={error} type="error" />
        </form>
    );
};

const QuranForm: React.FC<{ onAdd: (surah: Omit<Surah, 'number'>) => void }> = ({ onAdd }) => {
     const [formState, setFormState] = useState({ name: '', englishName: '', englishNameTranslation: '', revelationType: 'Meccan', numberOfAyahs: '', audioUrl: '' });
     const [message, setMessage] = useState('');
     const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const { name, englishName, audioUrl, numberOfAyahs } = formState;
        if (!name || !englishName || !audioUrl || !numberOfAyahs) {
            setError("Please fill in all required fields.");
            return;
        }

        onAdd({ ...formState, numberOfAyahs: parseInt(numberOfAyahs) });
        setMessage(`Successfully added "${englishName}"!`);
        setFormState({ name: '', englishName: '', englishNameTranslation: '', revelationType: 'Meccan', numberOfAyahs: '', audioUrl: '' });
    };

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4 text-white">Add New Surah</h3>
            <FormInput label="Arabic Name" id="name" name="name" value={formState.name} onChange={handleChange} required />
            <FormInput label="English Name" id="englishName" name="englishName" value={formState.englishName} onChange={handleChange} required />
            <FormInput label="English Translation" id="englishNameTranslation" name="englishNameTranslation" value={formState.englishNameTranslation} onChange={handleChange} />
            <FormInput label="Audio URL" id="audioUrl" name="audioUrl" type="url" value={formState.audioUrl} onChange={handleChange} required />
            <FormInput label="Number of Ayahs" id="numberOfAyahs" name="numberOfAyahs" type="number" value={formState.numberOfAyahs} onChange={handleChange} required />
            <FormSelect label="Revelation Type" id="revelationType" name="revelationType" value={formState.revelationType} onChange={handleChange}>
                <option>Meccan</option>
                <option>Medinan</option>
            </FormSelect>
            <SubmitButton>Add Surah</SubmitButton>
            <FormMessage message={message} type="success" />
            <FormMessage message={error} type="error" />
        </form>
    );
};

const RadioForm: React.FC<{ onAdd: (station: Omit<RadioStation, 'id'>) => void }> = ({ onAdd }) => {
    const [formState, setFormState] = useState({ name: '', genre: '', streamUrl: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const { name, genre, streamUrl } = formState;
        if (!name || !genre || !streamUrl) {
            setError("Please fill in all fields.");
            return;
        }
        
        onAdd({ name, genre, tracks: [{ title: name, artist: genre, audioUrl: streamUrl }] });
        setMessage(`Successfully added "${name}"!`);
        setFormState({ name: '', genre: '', streamUrl: '' });
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4 text-white">Add New Radio Station</h3>
            <FormInput label="Station Name" id="name" name="name" value={formState.name} onChange={handleChange} required />
            <FormInput label="Genre / Country" id="genre" name="genre" value={formState.genre} onChange={handleChange} required />
            <FormInput label="Stream URL" id="streamUrl" name="streamUrl" type="url" value={formState.streamUrl} onChange={handleChange} required />
            <SubmitButton>Add Radio Station</SubmitButton>
            <FormMessage message={message} type="success" />
            <FormMessage message={error} type="error" />
        </form>
    );
};

const TvForm: React.FC<{ onAdd: (channel: Omit<LiveTvChannel, 'id'>) => void }> = ({ onAdd }) => {
    const [formState, setFormState] = useState({ name: '', logoUrl: '', streamUrl: '', category: '', type: 'embed' as 'embed' | 'hls' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const { name, logoUrl, streamUrl, category } = formState;
        if (!name || !logoUrl || !streamUrl || !category) {
            setError("Please fill in all fields.");
            return;
        }
        
        onAdd(formState);
        setMessage(`Successfully added "${name}"!`);
        setFormState({ name: '', logoUrl: '', streamUrl: '', category: '', type: 'embed' });
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: name === 'type' ? value as 'embed' | 'hls' : value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4 text-white">Add New TV Channel</h3>
            <FormInput label="Channel Name" id="name" name="name" value={formState.name} onChange={handleChange} required />
            <FormInput label="Logo URL" id="logoUrl" name="logoUrl" type="url" value={formState.logoUrl} onChange={handleChange} required />
            <FormInput label="Stream URL" id="streamUrl" name="streamUrl" type="url" value={formState.streamUrl} onChange={handleChange} required />
            <FormInput label="Category" id="category" name="category" value={formState.category} onChange={handleChange} required />
            <FormSelect label="Stream Type" id="type" name="type" value={formState.type} onChange={handleChange}>
                <option value="embed">Embed (e.g., YouTube)</option>
                <option value="hls">HLS (.m3u8)</option>
            </FormSelect>
            <SubmitButton>Add TV Channel</SubmitButton>
            <FormMessage message={message} type="success" />
            <FormMessage message={error} type="error" />
        </form>
    );
};


export default AdminPage;