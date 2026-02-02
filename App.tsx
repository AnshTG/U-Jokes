
import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, signInWithGoogle, logout } from './firebase';
import { Joke } from './types';
import { generateJokes } from './geminiService';
import Logo from './components/Logo';
import ThemeSwitcher from './components/ThemeSwitcher';
import JokeCard from './components/JokeCard';
import Footer from './components/Footer';

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
          title: "Domain Unrecognized",
          msg: `The domain "${window.location.hostname}" isn't in your Firebase allowlist. Add it under Auth > Settings > Authorized Domains in your Firebase Console.`,
          code: "auth/unauthorized-domain"
        });
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError({
          title: "Popup Blocked!",
          msg: "Your browser stopped the sign-in window. Enable popups or use Guest Mode to bypass login.",
          code: "auth/popup-blocked"
        });
      } else if (err.message.includes("identity-toolkit-api-has-not-been-used") || err.code === 'auth/operation-not-allowed') {
        setAuthError({
          title: "Identity API Disabled",
          msg: "You must enable the 'Identity Toolkit API' in Google Cloud Console and set up Google Sign-in in Firebase.",
          code: "api-disabled"
        });
      } else {
        setAuthError({
          title: "Login Glitch",
          msg: err.message || "Something went wrong. Feel free to use Guest Mode for now!",
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
      // Smooth scroll to top of jokes
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJokes(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full animate-pulse"></div>
            <Logo size="lg" />
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em]">Setting the stage</span>
          </div>
        </div>
      </div>
    );
  }

  const isAuthorized = user || guestMode;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <main className="flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-400/20 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10 text-center max-w-2xl w-full">
            <div className="inline-block mb-12 transform hover:scale-105 transition-transform duration-500 cursor-default">
              <Logo size="lg" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[0.9] uppercase">
              LAUGHTER IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500">UNSTOPPABLE.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 font-medium leading-relaxed max-w-xl mx-auto">
              Welcome to the elite AI comedy club. 20 high-octane jokes delivered in a legendary performance.
            </p>

            {authError && (
              <div className="mb-10 p-6 bg-white dark:bg-slate-900 border-2 border-red-500/20 dark:border-red-500/10 rounded-[2.5rem] text-left animate-in slide-in-from-top-4 duration-500 shadow-2xl shadow-red-500/5">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-triangle-exclamation text-red-500 text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-red-900 dark:text-red-400 uppercase tracking-tight text-lg leading-tight">{authError.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed font-medium">
                      {authError.msg}
                    </p>
                    {authError.code === "auth/unauthorized-domain" && (
                      <div className="mt-4 p-3 bg-slate-50 dark:bg-black/20 rounded-xl text-[10px] font-mono break-all text-slate-500 border border-slate-200 dark:border-slate-800">
                        Whitelist: {window.location.hostname}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleSignIn}
                className="group relative overflow-hidden flex items-center justify-center gap-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-6 rounded-[2rem] shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6 filter brightness-110" alt="Google" />
                <span className="text-xl font-black uppercase tracking-tight">Login with Google</span>
              </button>
              
              <button
                onClick={() => setGuestMode(true)}
                className="group flex items-center justify-center gap-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 px-8 py-6 rounded-[2rem] shadow-xl hover:border-orange-500 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                <i className="fa-solid fa-bolt text-orange-500 group-hover:scale-125 transition-transform"></i>
                <span className="text-xl font-black uppercase tracking-tight">Guest Mode</span>
              </button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">
              <span className="flex items-center gap-2"><i className="fa-solid fa-check text-green-500"></i> AI Powered</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-check text-green-500"></i> Voice synthesis</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-check text-green-500"></i> Instant Laughter</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="sm" />
          
          <div className="flex items-center gap-6">
            <ThemeSwitcher />
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-full pl-4 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight hidden sm:inline">
                {user?.displayName || "Guest"}
              </span>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border-2 border-orange-500" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <i className="fa-solid fa-user-ninja text-sm"></i>
                </div>
              )}
              <button
                onClick={() => { logout(); setGuestMode(false); }}
                className="p-2 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 flex-grow w-full">
        <div className="text-center mb-24 relative">
          {/* Subtle decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -z-10"></div>
          
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.8] uppercase">
            THE LAUGHTER <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-rose-600">ENGINE</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Click once to generate 20 stadium-ready jokes. <br className="hidden md:block"/> 
            Turn up the volume for the full comedic performance!
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={handleFetchJokes}
              disabled={loadingJokes}
              className={`relative group flex items-center gap-6 px-16 py-8 rounded-[3rem] font-black text-3xl tracking-tighter transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-orange-500/20 overflow-hidden ${
                loadingJokes 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-wait' 
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              }`}
            >
              {/* Button inner gradient light effect */}
              {!loadingJokes && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              )}
              
              <div className="relative z-10 flex items-center gap-5">
                {loadingJokes ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin text-orange-500"></i>
                    <span>WRITING COMEDY...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-masks-theater text-white dark:text-slate-900 group-hover:scale-110 transition-transform"></i>
                    <span>LOAD 20 BANGER JOKES</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {jokes.map((joke, idx) => (
            <div key={joke.id} className="animate-in fade-in slide-in-from-bottom-12 duration-700 fill-mode-both" style={{ animationDelay: `${idx * 75}ms` }}>
              <JokeCard joke={joke} />
            </div>
          ))}
          
          {jokes.length === 0 && !loadingJokes && (
            <div className="col-span-full py-40 text-center flex flex-col items-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 blur-3xl opacity-50 rounded-full animate-pulse"></div>
                <div className="relative w-40 h-40 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800">
                   <i className="fa-solid fa-microphone-slash text-6xl text-slate-300 dark:text-slate-700"></i>
                </div>
              </div>
              <p className="text-3xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-tighter mb-2">Stage is currently empty</p>
              <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">Ready for your command</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
