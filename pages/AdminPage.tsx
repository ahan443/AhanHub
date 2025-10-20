
import React, { useState } from 'react';
import type { Anime } from '../types';

interface AdminPageProps {
    onAddAnime: (anime: Anime) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onAddAnime }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setMessage('Please enter an anime title.');
            return;
        }

        const synopsis = `A thrilling adventure awaits in the world of "${title}". More details coming soon!`;
        const newAnime: Anime = {
            id: Date.now(),
            title: title,
            imageUrl: `https://picsum.photos/seed/${Date.now()}/500/700`,
            synopsis: synopsis,
            episodes: [],
        };
        onAddAnime(newAnime);
        setMessage(`Successfully added "${title}"! The new anime is now at the top of the Anime page. (Note: This is temporary and will be lost on page refresh).`);
        setTitle('');
    };

    return (
        <div className="max-w-2xl mx-auto bg-slate-800/50 p-4 sm:p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">Add New Anime</h2>
            <p className="mb-6 text-gray-400">
                Enter a fictional anime title to add it to the Anime page. A default synopsis will be used.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-300 text-sm font-bold mb-2">
                        Anime Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., 'Chronos Wanderers'"
                        className="w-full px-3 py-2 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Add Anime
                </button>
            </form>
            {message && (
                <div className="mt-6 p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-300">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
};

export default AdminPage;