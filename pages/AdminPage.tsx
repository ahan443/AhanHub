import React, { useState, useEffect } from 'react';
import type { Surah, Anime, RadioStation, LiveTvChannel, Episode, RadioTrack } from '../types';

type AdminPageProps = {
    quran: Surah[];
    onAddSurah: (surah: Surah) => Promise<void>;
    onUpdateSurah: (number: number, surah: Omit<Surah, 'number'>) => Promise<void>;
    onDeleteSurah: (number: number) => Promise<void>;

    animes: Anime[];
    onAddAnime: (anime: Omit<Anime, 'id'>) => Promise<void>;
    onUpdateAnime: (id: string, anime: Omit<Anime, 'id'>) => Promise<void>;
    onDeleteAnime: (id: string) => Promise<void>;

    radioStations: RadioStation[];
    onAddRadioStation: (station: Omit<RadioStation, 'id'>) => Promise<void>;
    onUpdateRadioStation: (id: string, station: Omit<RadioStation, 'id'>) => Promise<void>;
    onDeleteRadioStation: (id: string) => Promise<void>;

    tvChannels: LiveTvChannel[];
    onAddLiveTvChannel: (channel: Omit<LiveTvChannel, 'id'>) => Promise<void>;
    onUpdateLiveTvChannel: (id: string, channel: Omit<LiveTvChannel, 'id'>) => Promise<void>;
    onDeleteLiveTvChannel: (id: string) => Promise<void>;
    
    onLogout: () => void;
}

type Tab = 'quran' | 'anime' | 'radio' | 'tv';
type Mode = 'list' | 'add' | 'edit';
type Item = Surah | Anime | RadioStation | LiveTvChannel;

const AdminPage: React.FC<AdminPageProps> = (props) => {
    const [activeTab, setActiveTab] = useState<Tab>('anime');
    const [mode, setMode] = useState<Mode>('list');
    const [currentItem, setCurrentItem] = useState<Item | null>(null);

    const handleSetMode = (newMode: Mode, item: Item | null = null) => {
        setMode(newMode);
        setCurrentItem(item);
    }

    const handleCancel = () => {
        handleSetMode('list');
    }

    const handleDelete = async (item: Item) => {
        const title = (item as any).name || (item as any).title;
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            switch (activeTab) {
                case 'quran': await props.onDeleteSurah((item as Surah).number); break;
                case 'anime': await props.onDeleteAnime((item as Anime).id); break;
                case 'radio': await props.onDeleteRadioStation((item as RadioStation).id); break;
                case 'tv': await props.onDeleteLiveTvChannel((item as LiveTvChannel).id); break;
            }
        } catch (e) {
            console.error("Deletion failed", e);
            alert("Could not delete item. See console for details.");
        }
    }

    const renderContent = () => {
        if (mode === 'add' || mode === 'edit') {
            switch (activeTab) {
                case 'anime': return <AnimeForm onAdd={props.onAddAnime} onUpdate={props.onUpdateAnime} initialData={currentItem as Anime | null} onCancel={handleCancel} />;
                case 'quran': return <QuranForm onAdd={props.onAddSurah} onUpdate={props.onUpdateSurah} initialData={currentItem as Surah | null} onCancel={handleCancel} />;
                case 'radio': return <RadioForm onAdd={props.onAddRadioStation} onUpdate={props.onUpdateRadioStation} initialData={currentItem as RadioStation | null} onCancel={handleCancel} />;
                case 'tv': return <TvForm onAdd={props.onAddLiveTvChannel} onUpdate={props.onUpdateLiveTvChannel} initialData={currentItem as LiveTvChannel | null} onCancel={handleCancel} />;
                default: return null;
            }
        }

        // List View
        let data: Item[] = [];
        let columns: { header: string, accessor: (item: any) => React.ReactNode }[] = [];

        switch (activeTab) {
            case 'anime':
                data = props.animes;
                columns = [
                    { header: 'Title', accessor: item => item.title },
                    { header: 'Episodes', accessor: item => item.episodes.length },
                ];
                break;
            case 'quran':
                data = props.quran;
                columns = [
                    { header: '#', accessor: item => item.number },
                    { header: 'English Name', accessor: item => item.englishName },
                    { header: 'Arabic Name', accessor: item => item.name },
                ];
                break;
            case 'radio':
                data = props.radioStations;
                columns = [
                    { header: 'Name', accessor: item => item.name },
                    { header: 'Genre/Country', accessor: item => item.genre },
                ];
                break;
            case 'tv':
                data = props.tvChannels;
                columns = [
                    { header: 'Name', accessor: item => item.name },
                    { header: 'Category', accessor: item => item.category },
                ];
                break;
        }

        return (
            <div>
                 <button onClick={() => handleSetMode('add')} className="mb-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add New
                </button>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-slate-700/30 rounded-lg">
                        <thead>
                            <tr className="border-b border-slate-600">
                                {columns.map(col => <th key={col.header} className="px-5 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">{col.header}</th>)}
                                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/50">
                                    {columns.map(col => <td key={col.header} className="px-5 py-4 whitespace-nowrap text-sm text-gray-200">{col.accessor(item)}</td>)}
                                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                                        <button onClick={() => handleSetMode('edit', item)} className="text-cyan-400 hover:text-cyan-300">Edit</button>
                                        <button onClick={() => handleDelete(item)} className="text-red-500 hover:text-red-400">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-white">Manage Content</h2>
                 <button onClick={props.onLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                </button>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg">
                <div className="flex border-b border-slate-700">
                    <TabButton name="Anime" tab="anime" activeTab={activeTab} setActiveTab={setActiveTab} onSelect={() => handleSetMode('list')}/>
                    <TabButton name="Quran" tab="quran" activeTab={activeTab} setActiveTab={setActiveTab} onSelect={() => handleSetMode('list')}/>
                    <TabButton name="FM Radio" tab="radio" activeTab={activeTab} setActiveTab={setActiveTab} onSelect={() => handleSetMode('list')}/>
                    <TabButton name="Live TV" tab="tv" activeTab={activeTab} setActiveTab={setActiveTab} onSelect={() => handleSetMode('list')}/>
                </div>
                <div className="p-4 sm:p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

// --- Child Components for Forms ---

const TabButton: React.FC<{ name: string; tab: Tab; activeTab: Tab; setActiveTab: (tab: Tab) => void; onSelect: () => void; }> = ({ name, tab, activeTab, setActiveTab, onSelect }) => {
    const isActive = activeTab === tab;
    return (
        <button
            onClick={() => { setActiveTab(tab); onSelect(); }}
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

const FormActions: React.FC<{ onCancel: () => void; submitText: string; }> = ({ onCancel, submitText }) => (
    <div className="flex items-center gap-4 mt-6">
        <button type="button" onClick={onCancel} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Cancel
        </button>
        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            {submitText}
        </button>
    </div>
);

const FormMessage: React.FC<{ message: string; type: 'success' | 'error'}> = ({ message, type }) => {
    if (!message) return null;
    const colors = type === 'success' ? 'bg-green-800/50 border-green-600 text-green-300' : 'bg-red-800/50 border-red-600 text-red-300';
    return <div className={`mt-4 p-3 border rounded-lg ${colors}`}>{message}</div>;
}

// --- Specific Forms ---

interface FormProps<T> {
    onAdd: (data: any) => Promise<void>;
    onUpdate: (id: any, data: any) => Promise<void>;
    initialData: T | null;
    onCancel: () => void;
}

const AnimeForm: React.FC<FormProps<Anime>> = ({ onAdd, onUpdate, initialData, onCancel }) => {
    const [formState, setFormState] = useState({ title: '', imageUrl: '', synopsis: '' });
    const [episodes, setEpisodes] = useState<string>('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            const { title, imageUrl, synopsis, episodes } = initialData;
            setFormState({ title, imageUrl, synopsis });
            setEpisodes(JSON.stringify(episodes, null, 2));
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        let parsedEpisodes: Episode[] = [];
        if (episodes.trim()) {
            try {
                parsedEpisodes = JSON.parse(episodes);
            } catch (err) {
                setError("Invalid JSON format for episodes.");
                return;
            }
        }
        
        const animeData = { ...formState, episodes: parsedEpisodes };

        try {
            if (initialData) {
                await onUpdate(initialData.id, animeData);
                setMessage(`Successfully updated "${animeData.title}"!`);
            } else {
                await onAdd(animeData);
                setMessage(`Successfully added "${animeData.title}"!`);
            }
            setTimeout(onCancel, 1000);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isEditing = !!initialData;

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4 text-white">{isEditing ? 'Edit' : 'Add New'} Anime</h3>
            <FormInput label="Title" id="title" name="title" value={formState.title} onChange={handleChange} required />
            <FormInput label="Image URL" id="imageUrl" name="imageUrl" type="url" value={formState.imageUrl} onChange={handleChange} required />
            <FormTextarea label="Synopsis" id="synopsis" name="synopsis" rows={4} value={formState.synopsis} onChange={handleChange} required />
            <FormTextarea label="Episodes (JSON format)" id="episodes" name="episodes" rows={5} value={episodes} onChange={(e) => setEpisodes(e.target.value)} placeholder='[&#10;  { "number": 1, "title": "Episode 1", "videoUrl": "https://.../embed-1.html" },&#10;  { "number": 2, "title": "Episode 2", "videoUrl": "https://.../embed-2.html" }&#10;]' />
            <FormActions onCancel={onCancel} submitText={isEditing ? 'Update Anime' : 'Add Anime'} />
            <FormMessage message={message} type="success" />
            <FormMessage message={error} type="error" />
        </form>
    );
};

const QuranForm: React.FC<FormProps<Surah>> = ({ onAdd, onUpdate, initialData, onCancel }) => {
     const [formState, setFormState] = useState({ number: '', name: '', englishName: '', englishNameTranslation: '', revelationType: 'Meccan', numberOfAyahs: '', audioUrl: '' });
     const [message, setMessage] = useState('');
     const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormState({
                number: String(initialData.number),
                name: initialData.name,
                englishName: initialData.englishName,
                englishNameTranslation: initialData.englishNameTranslation || '',
                revelationType: initialData.revelationType || 'Meccan',
                numberOfAyahs: String(initialData.numberOfAyahs || ''),
                audioUrl: initialData.audioUrl,
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        const surahData = {
            ...formState,
            number: parseInt(formState.number),
            numberOfAyahs: parseInt(formState.numberOfAyahs),
        };
        const { number, name, englishName, audioUrl, numberOfAyahs } = surahData;
        if (!number || !name || !englishName || !audioUrl || !numberOfAyahs) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            if (initialData) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { number: _num, ...updateData } = surahData;
                await onUpdate(initialData.number, updateData);
                setMessage(`Successfully updated "${surahData.englishName}"!`);
            } else {
                await onAdd(surahData);
                setMessage(`Successfully added "${surahData.englishName}"!`);
            }
            setTimeout(onCancel, 1000);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        }
    };

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isEditing = !!initialData;

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4 text-white">{isEditing ? 'Edit' : 'Add New'} Surah</h3>
            <FormInput label="Surah Number" id="number" name="number" type="number" value={formState.number} onChange={handleChange} required disabled={isEditing} />
            <FormInput label="Arabic Name" id="name" name="name" value={formState.name} onChange={handleChange} required />
            <FormInput label="English Name" id="englishName" name="englishName" value={formState.englishName} onChange={handleChange} required />
            <FormInput label="English Translation" id="englishNameTranslation" name="englishNameTranslation" value={formState.englishNameTranslation} onChange={handleChange} />
            <FormInput label="Audio URL" id="audioUrl" name="audioUrl" type="url" value={formState.audioUrl} onChange={handleChange} required />
            <FormInput label="Number of Ayahs" id="numberOfAyahs" name="numberOfAyahs" type="number" value={formState.numberOfAyahs} onChange={handleChange} required />
            <FormSelect label="Revelation Type" id="revelationType" name="revelationType" value={formState.revelationType} onChange={handleChange}>
                <option>Meccan</option>
                <option>Medinan</option>
            </FormSelect>
            <FormActions onCancel={onCancel} submitText={isEditing ? 'Update Surah' : 'Add Surah'} />
            <FormMessage message={message} type="success" />
            <FormMessage message={error} type="error" />
        </form>
    );
};

const RadioForm: React.FC<FormProps<RadioStation>> = ({ onAdd, onUpdate, initialData, onCancel }) => {
    const [formState, setFormState] = useState({ name: '', genre: '', streamUrl: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

     useEffect(() => {
        if (initialData) {
            setFormState({
                name: initialData.name,
                genre: initialData.genre,
                streamUrl: initialData.tracks[0]?.audioUrl || '',
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const { name, genre, streamUrl } = formState;
        
        const stationData = { name, genre, tracks: [{ title: name, artist: genre, audioUrl: streamUrl } as RadioTrack] };
        
        try {
             if (initialData) {
                await onUpdate(initialData.id, stationData);
                setMessage(`Successfully updated "${stationData.name}"!`);
            } else {
                await onAdd(stationData);
                setMessage(`Successfully added "${stationData.name}"!`);
            }
            setTimeout(onCancel, 1000);
        } catch (err: any) {
             setError(err.message || "An unknown error occurred.");
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isEditing = !!initialData;

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4 text-white">{isEditing ? 'Edit' : 'Add New'} Radio Station</h3>
            <FormInput label="Station Name" id="name" name="name" value={formState.name} onChange={handleChange} required />
            <FormInput label="Genre / Country" id="genre" name="genre" value={formState.genre} onChange={handleChange} required />
            <FormInput label="Stream URL" id="streamUrl" name="streamUrl" type="url" value={formState.streamUrl} onChange={handleChange} required />
            <FormActions onCancel={onCancel} submitText={isEditing ? 'Update Station' : 'Add Station'} />
            <FormMessage message={message} type="success" />
            <FormMessage message={error} type="error" />
        </form>
    );
};

const TvForm: React.FC<FormProps<LiveTvChannel>> = ({ onAdd, onUpdate, initialData, onCancel }) => {
    const [formState, setFormState] = useState({ name: '', logoUrl: '', streamUrl: '', category: '', type: 'embed' as 'embed' | 'hls' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            // FIX: Explicitly map properties from initialData to the form state.
            // This ensures the state shape is correct, provides a default for the optional `type` property,
            // and avoids incorrectly including the `id` in the form state.
            setFormState({
                name: initialData.name,
                logoUrl: initialData.logoUrl,
                streamUrl: initialData.streamUrl,
                category: initialData.category,
                type: initialData.type || 'embed',
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            if (initialData) {
                await onUpdate(initialData.id, formState);
                setMessage(`Successfully updated "${formState.name}"!`);
            } else {
                await onAdd(formState);
                setMessage(`Successfully added "${formState.name}"!`);
            }
            setTimeout(onCancel, 1000);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: name === 'type' ? value as 'embed' | 'hls' : value }));
    };

    const isEditing = !!initialData;

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4 text-white">{isEditing ? 'Edit' : 'Add New'} TV Channel</h3>
            <FormInput label="Channel Name" id="name" name="name" value={formState.name} onChange={handleChange} required />
            <FormInput label="Logo URL" id="logoUrl" name="logoUrl" type="url" value={formState.logoUrl} onChange={handleChange} required />
            <FormInput label="Stream URL" id="streamUrl" name="streamUrl" type="url" value={formState.streamUrl} onChange={handleChange} required />
            <FormInput label="Category" id="category" name="category" value={formState.category} onChange={handleChange} required />
            <FormSelect label="Stream Type" id="type" name="type" value={formState.type} onChange={handleChange}>
                <option value="embed">Embed (e.g., YouTube)</option>
                <option value="hls">HLS (.m3u8)</option>
            </FormSelect>
            <FormActions onCancel={onCancel} submitText={isEditing ? 'Update Channel' : 'Add Channel'} />
            <FormMessage message={message} type="success" />
            <FormMessage message={error} type="error" />
        </form>
    );
};

export default AdminPage;