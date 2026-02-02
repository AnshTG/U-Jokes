
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/60 py-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
          <div className="flex flex-col items-center md:items-start group">
            <Logo size="sm" />
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-2 group-hover:text-orange-500 transition-colors">
              The Unstoppable Comedy Engine
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">
              Crafted with <i className="fa-solid fa-heart text-rose-500 animate-pulse mx-1"></i> by 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500 ml-1">Ansh Yadav</span>
            </p>
            
            <div className="flex items-center gap-8">
              <a 
                href="https://instagram.com/anshtgyadav" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1 text-slate-400 hover:text-pink-500 transition-all"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:rotate-12 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-all">
                  <i className="fa-brands fa-instagram text-xl"></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">@anshtgyadav</span>
              </a>
              
              <a 
                href="mailto:anshyadavtg@gmail.com" 
                className="group flex flex-col items-center gap-1 text-slate-400 hover:text-orange-500 transition-all"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:-rotate-12 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-all">
                  <i className="fa-solid fa-envelope text-xl"></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">Email Me</span>
              </a>
            </div>
          </div>

          <div className="text-right hidden md:block">
            <div className="text-xs font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest mb-1">Status</div>
            <div className="flex items-center gap-2 justify-end">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Stage Ready</span>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
        
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em]">
          © 2024 U JOKES • ALL SYSTEMS LAUGHING
        </p>
      </div>
    </footer>
  );
};

export default Footer;
