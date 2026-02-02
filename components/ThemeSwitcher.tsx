
import React, { useState, useEffect } from 'react';
import { Theme } from '../types';

const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || Theme.SYSTEM;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
    const effectiveTheme = theme === Theme.SYSTEM ? systemTheme : theme;

    if (effectiveTheme === Theme.DARK) {
      root.classList.add('dark');
      document.body.className = 'bg-slate-900 text-slate-100 transition-colors duration-300';
    } else {
      root.classList.remove('dark');
      document.body.className = 'bg-slate-50 text-slate-900 transition-colors duration-300';
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === Theme.LIGHT) setTheme(Theme.DARK);
    else if (theme === Theme.DARK) setTheme(Theme.SYSTEM);
    else setTheme(Theme.LIGHT);
  };

  const getIcon = () => {
    switch (theme) {
      case Theme.LIGHT: return 'fa-sun text-yellow-500';
      case Theme.DARK: return 'fa-moon text-indigo-400';
      case Theme.SYSTEM: return 'fa-desktop text-slate-500';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:scale-110 transition-transform active:scale-95 flex items-center gap-2 border border-slate-300 dark:border-slate-700"
      title={`Theme: ${theme}`}
    >
      <i className={`fa-solid ${getIcon()} text-lg`}></i>
      <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">{theme}</span>
    </button>
  );
};

export default ThemeSwitcher;
