import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminLoginPageProps {
    onLogin: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const passwordInputRef = useRef<HTMLInputElement>(null);

    // Hardcoded password for this example
    const ADMIN_PASSWORD = 'admin443';

    useEffect(() => {
        passwordInputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setError('');
            onLogin();
            navigate('/admin');
        } else {
            setError('Invalid password. Please try again.');
            setPassword('');
        }
    };

    return (
        <div className="animate-fade-in flex items-center justify-center w-full h-full">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-wider text-white">
                        Ahan<span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Hub</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Admin Panel Login</p>
                </div>
                <form 
                    onSubmit={handleSubmit}
                    className="bg-slate-900/60 backdrop-blur-lg border border-slate-800 shadow-2xl shadow-cyan-900/10 rounded-lg px-8 pt-6 pb-8 mb-4"
                >
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            ref={passwordInputRef}
                            className="w-full px-3 py-2 text-white bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button 
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:shadow-outline" 
                            type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;2024 AhanHub. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;