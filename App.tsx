
import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, signInWithGoogle, logout } from './firebase';
import { Joke } from './types';
import { generateJokes } from './geminiService';
import Logo from './components/Logo';
import ThemeSwitcher from './components/ThemeSwitcher';
import JokeCard from './components/JokeCard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [guestMode, setGuestMode] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [loadingJokes, setLoadingJokes] = useState(false);
  const [authError, setAuthError] = useState<{title: string, msg: string, code?: string} | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        setAuthError({
          title: "Domain Not Authorized",
          msg: `The domain "${window.location.hostname}" is not authorized in your Firebase project. Please go to the Firebase Console > Authentication > Settings > Authorized domains and add this domain to the list.`,
          code: "auth/unauthorized-domain"
        });
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError({
          title: "Popup Blocked!",
          msg: "Your browser blocked the sign-in window. Please allow popups for this site in your browser settings or enter as a Guest.",
          code: "auth/popup-blocked"
        });
      } else if (err.message.includes("identity-toolkit-api-has-not-been-used") || err.code === 'auth/operation-not-allowed') {
        setAuthError({
          title: "API Not Enabled",
          msg: "The 'Identity Toolkit API' needs to be enabled in your Google Cloud Console for this project. Also ensure Google is enabled as a sign-in provider in Firebase.",
          code: "api-disabled"
        });
      } else {
        setAuthError({
          title: "Sign-in Failed",
          msg: err.message || "An unexpected error occurred during sign-in. Try Guest Mode.",
          code: err.code
        });
      }
    }
  };

  const handleFetchJokes = async () => {
    setLoadingJokes(true);
    try {
      const newJokes = await generateJokes();
      setJokes(newJokes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJokes(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-bounce text-center">
          <Logo size="lg" />
          <p className="mt-4 text-slate-400 font-bold animate-pulse">WARMING UP THE STAGE...</p>
        </div>
      </div>
    );
  }

  const isAuthorized = user || guestMode;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 text-center max-w-lg w-full">
          <Logo size="lg" />
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mt-8 mb-4">
            Unstoppable Laughter.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-medium">
            The world's first AI comedy club delivering 20 punchy jokes in a funny voice.
          </p>

          {authError && (
            <div className="mb-8 p-6 bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-900/60 rounded-3xl text-left animate-in slide-in-from-top-4 duration-300 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full flex-shrink-0">
                  <i className="fa-solid fa-shield-halved text-red-600 dark:text-red-400 text-lg"></i>
                </div>
                <div>
                  <h3 className="font-black text-red-800 dark:text-red-300 uppercase tracking-tight text-base">{authError.title}</h3>
                  <p className="text-red-700 dark:text-red-400 mt-2 leading-relaxed text-sm font-medium">
                    {authError.msg}
                  </p>
                  {authError.code === "auth/unauthorized-domain" && (
                    <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-xl text-xs font-mono break-all text-slate-600 dark:text-slate-300 border border-red-200/50">
                      Add to Authorized Domains: {window.location.hostname}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5">
            <button
              onClick={handleSignIn}
              className="group flex items-center justify-center gap-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-8 py-5 rounded-3xl shadow-2xl hover:border-orange-400 dark:hover:border-orange-500 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
              <span className="text-xl font-bold text-slate-700 dark:text-slate-200">Sign in with Google</span>
            </button>
            
            <button
              onClick={() => setGuestMode(true)}
              className="group text-base font-black text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 uppercase tracking-widest py-3 transition-all flex items-center justify-center gap-2"
            >
              Skip Login (Guest Mode)
              <i className="fa-solid fa-ghost text-slate-400 group-hover:scale-125 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Logo size="sm" />
          
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-orange-400" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  <i className="fa-solid fa-user-ninja text-slate-400"></i>
                </div>
              )}
              <button
                onClick={() => {
                  logout();
                  setGuestMode(false);
                }}
                className="hidden md:block text-xs font-black text-slate-400 hover:text-red-500 dark:hover:text-red-400 uppercase tracking-tighter transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase">
            The Laughter <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Engine</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
            20 high-energy jokes generated in real-time. Turn up your volume for the Puck voice experience!
          </p>
          
          <button
            onClick={handleFetchJokes}
            disabled={loadingJokes}
            className={`relative group px-12 py-6 rounded-full font-black text-2xl tracking-tighter transition-all transform hover:scale-105 active:scale-95 shadow-2xl ${
              loadingJokes 
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-wait' 
              : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-white shadow-orange-500/40 hover:shadow-orange-600/60'
            }`}
          >
            {loadingJokes ? (
              <span className="flex items-center gap-4">
                <i className="fa-solid fa-spinner animate-spin"></i>
                WRITING COMEDY...
              </span>
            ) : (
              <span className="flex items-center gap-4">
                <i className="fa-solid fa-bolt text-yellow-300 group-hover:animate-pulse transition-transform"></i>
                LOAD 20 BANGER JOKES
              </span>
            )}
            
            {loadingJokes && (
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-400 to-pink-600 opacity-20 animate-ping"></div>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jokes.map((joke, idx) => (
            <div key={joke.id} className="animate-in fade-in slide-in-from-bottom-8 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              <JokeCard joke={joke} />
            </div>
          ))}
          
          {jokes.length === 0 && !loadingJokes && (
            <div className="col-span-full py-32 text-center">
              <div className="inline-block p-10 bg-slate-100 dark:bg-slate-900/50 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800">
                <i className="fa-solid fa-microphone-lines text-8xl mb-6 text-slate-300 dark:text-slate-700 animate-pulse"></i>
                <p className="text-2xl font-black text-slate-400 dark:text-slate-600 uppercase">Stage is clear</p>
                <p className="text-slate-400 dark:text-slate-600 font-medium">Click generate to start the marathon.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-20 text-center">
        <Logo size="sm" />
        <p className="mt-8 text-sm font-bold text-slate-400 uppercase tracking-widest">Unstoppable Laughter Engine • 2024</p>
      </footer>
    </div>
  );
};

export default App;
