
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
  };

  return (
    <div className="flex items-center gap-2 select-none">
      <div className={`logo-font ${sizes[size]} font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 drop-shadow-sm`}>
        U <span className="italic">JOKES</span>
      </div>
      <div className={`${size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-8 h-8' : 'w-6 h-6'} bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-yellow-400/20`}>
        <i className={`fa-solid fa-face-grin-tears text-slate-900 ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}></i>
      </div>
    </div>
  );
};

export default Logo;
