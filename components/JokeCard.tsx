
import React, { useState } from 'react';
import { Joke } from '../types';
import { speakJoke } from '../geminiService';

interface JokeCardProps {
  joke: Joke;
}

const JokeCard: React.FC<JokeCardProps> = ({ joke }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPunchline, setShowPunchline] = useState(false);

  const handlePlay = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setShowPunchline(true);
    try {
      await speakJoke(`${joke.setup}... ${joke.punchline}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-700 transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-orange-200 dark:hover:border-orange-500/30 overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-snug">
            {joke.setup}
          </p>
          
          <div className={`transition-all duration-500 transform ${showPunchline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <p className="text-lg font-medium text-orange-600 dark:text-orange-400 italic">
              — {joke.punchline}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setShowPunchline(!showPunchline)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors uppercase tracking-widest"
          >
            {showPunchline ? 'Hide Punchline' : 'Reveal Punchline'}
          </button>

          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isPlaying 
              ? 'bg-orange-100 text-orange-400 cursor-not-allowed' 
              : 'bg-gradient-to-br from-orange-400 to-pink-500 text-white hover:scale-110 shadow-lg shadow-orange-500/30 active:scale-95'
            }`}
          >
            {isPlaying ? (
              <div className="flex gap-1">
                <span className="w-1 h-3 bg-orange-400 animate-pulse"></span>
                <span className="w-1 h-4 bg-orange-400 animate-pulse [animation-delay:0.2s]"></span>
                <span className="w-1 h-3 bg-orange-400 animate-pulse [animation-delay:0.4s]"></span>
              </div>
            ) : (
              <i className="fa-solid fa-play ml-1"></i>
            )}
          </button>
        </div>
      </div>
      
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
    </div>
  );
};

export default JokeCard;
