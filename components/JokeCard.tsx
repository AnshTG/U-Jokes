
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
    <div className="group relative bg-white dark:bg-slate-900/40 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-orange-500/40 flex flex-col min-h-[320px] overflow-hidden">
      
      {/* Ticket Aesthetic Top Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Entry</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-orange-500/20"></div>
          <div className="w-2 h-2 rounded-full bg-pink-500/20"></div>
          <div className="w-2 h-2 rounded-full bg-rose-500/20"></div>
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight mb-6 tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
          {joke.setup}
        </h3>
        
        <div className={`transition-all duration-700 ease-out transform ${showPunchline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-orange-500 to-pink-500 rounded-full"></div>
            <p className="text-xl font-bold text-slate-600 dark:text-slate-400 pl-4 italic leading-relaxed">
              {joke.punchline}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/60 border-dashed">
        <button
          onClick={() => setShowPunchline(!showPunchline)}
          className="text-xs font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
        >
          {showPunchline ? (
            <>Hide Punch <i className="fa-solid fa-eye-slash"></i></>
          ) : (
            <>Reveal Punch <i className="fa-solid fa-eye text-orange-500"></i></>
          )}
        </button>

        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-2xl ${
            isPlaying 
            ? 'bg-orange-500/10 text-orange-500 cursor-not-allowed scale-105' 
            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-orange-600 dark:hover:bg-orange-500 hover:scale-110 active:scale-90'
          }`}
        >
          {isPlaying ? (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-4 bg-orange-500 rounded-full animate-bounce [animation-duration:0.6s]"></span>
              <span className="w-1.5 h-6 bg-orange-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-4 bg-orange-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]"></span>
            </div>
          ) : (
            <i className="fa-solid fa-volume-high text-xl"></i>
          )}
        </button>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-bl-[4rem] pointer-events-none group-hover:from-orange-500/10 transition-colors duration-500"></div>
    </div>
  );
};

export default JokeCard;
