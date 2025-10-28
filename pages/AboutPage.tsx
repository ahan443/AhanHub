
import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="animate-fade-in max-w-4xl mx-auto text-gray-300">
            <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-800 p-8 rounded-2xl shadow-2xl shadow-cyan-900/10">
                <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">About AhanHub</h2>
                <p className="mb-4 leading-relaxed">
                    AhanHub is a personal project designed to be an all-in-one entertainment platform. It brings together Quran recitations, a curated collection of anime series, and a selection of online FM radio stations from around the world.
                </p>
                <p className="mb-6 leading-relaxed">
                    The goal of AhanHub is to provide a seamless and enjoyable media experience within a clean, modern, and user-friendly interface. Whether you're looking for spiritual listening, exciting anime adventures, or global music, AhanHub aims to have something for you.
                </p>

                <div className="border-t border-slate-700 pt-6 mt-6">
                    <p className="text-center text-gray-400">
                        Built by <a href="https://www.facebook.com/Ahnaf.Muttaki.Ahan/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-semibold underline transition-colors">Ahnaf Muttaki</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;