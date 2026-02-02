
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
          title: "Domain Restricted",
          msg: `The domain "${window.location.hostname}" isn't authorized for this Firebase project. Add it in Authentication > Settings > Authorized domains.`,
          code: "auth/unauthorized-domain"
        });
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError({
          title: "Popup Blocked",
          msg: "Your browser prevented the login window. Allow popups or enter as a Guest.",
          code: "auth/popup-blocked"
        });
      } else {
        setAuthError({
          title: "Auth Issue",
          msg: err.message || "Something went wrong. Try Guest Mode to skip setup.",
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
      // Smooth scroll to top of jokes area
      const jokesAnchor = document.getElementById('jokes-stage');
      if (jokesAnchor) {
        jokesAnchor.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJokes(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-500">
        <div className="flex flex-col items-center gap-8">
          <div className="relative group cursor-default">
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse group-hover:bg-orange-500/30 transition-colors"></div>
            <Logo size="lg" />
          </div>
          <div className="flex items-center gap-4 px-8 py-3 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping"></div>
            <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.5em]">Tuning the mic</span>
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
          {/* Dynamic Background Highlights */}
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-orange-400/10 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-pink-400/10 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10 text-center max-w-3xl w-full py-12">
            <div className="inline-block mb-16 transform hover:scale-110 transition-transform duration-700 cursor-pointer">
              <Logo size="lg" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.85] uppercase">
              Laughter Is <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-rose-600 animate-gradient-x">UNSTOPPABLE.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-16 font-medium leading-relaxed max-w-2xl mx-auto px-4">
              Step into the world's most advanced AI comedy club. 20 exclusive bangers delivered by our legendary resident AI comedian.
            </p>

            {authError && (
              <div className="mb-12 p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-red-500/20 dark:border-red-500/10 rounded-[3rem] text-left animate-in zoom-in-95 duration-500 shadow-2xl shadow-red-500/5 max-w-xl mx-auto">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                    <i className="fa-solid fa-lock text-red-500 text-2xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-red-900 dark:text-red-300 uppercase tracking-tight text-xl leading-tight">{authError.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed font-semibold">
                      {authError.msg}
                    </p>
                    {authError.code === "auth/unauthorized-domain" && (
                      <div className="mt-5 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl text-[11px] font-mono break-all text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                        Authorized Domain: {window.location.hostname}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
              <button
                onClick={handleSignIn}
                className="group relative overflow-hidden flex items-center justify-center gap-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-7 rounded-[2.5rem] shadow-2xl transition-all transform hover:-translate-y-2 active:scale-95 ring-offset-4 ring-orange-500/20 hover:ring-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-7 h-7" alt="Google" />
                <span className="text-2xl font-black uppercase tracking-tight">Login with Google</span>
              </button>
              
              <button
                onClick={() => setGuestMode(true)}
                className="group flex items-center justify-center gap-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 px-10 py-7 rounded-[2.5rem] shadow-xl hover:border-orange-500 transition-all transform hover:-translate-y-2 active:scale-95"
              >
                <i className="fa-solid fa-bolt text-orange-500 text-2xl group-hover:scale-125 transition-transform"></i>
                <span className="text-2xl font-black uppercase tracking-tight">Guest Mode</span>
              </button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-12 text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">
              <span className="flex items-center gap-3 transition-colors hover:text-orange-500"><i className="fa-solid fa-brain text-orange-500"></i> Gemini 3 AI</span>
              <span className="flex items-center gap-3 transition-colors hover:text-pink-500"><i className="fa-solid fa-volume-high text-pink-500"></i> Puck Voice</span>
              <span className="flex items-center gap-3 transition-colors hover:text-yellow-500"><i className="fa-solid fa-fire text-yellow-500"></i> 100% Original</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Logo size="sm" />
          
          <div className="flex items-center gap-8">
            <ThemeSwitcher />
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-2 rounded-full pl-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
              <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest hidden sm:inline">
                {user?.displayName || "Comedy Guest"}
              </span>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-orange-500 shadow-sm" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center text-white shadow-lg">
                  <i className="fa-solid fa-user-ninja text-lg"></i>
                </div>
              )}
              <button
                onClick={() => { logout(); setGuestMode(false); }}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 transition-all"
                title="Logout"
              >
                <i className="fa-solid fa-power-off"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-24 flex-grow w-full">
        <div className="text-center mb-32 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-20 w-[600px] h-[400px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
          
          <h2 className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white mb-10 tracking-[ -0.05em] leading-[0.75] uppercase">
            THE LAUGHTER <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-rose-600 animate-gradient-x">ENGINE</span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-slate-500 dark:text-slate-400 mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
            Witness 20 fresh routines generated in seconds. <br className="hidden md:block"/> 
            Press play to hear Puck perform the punchlines!
          </p>
          
          <div className="flex justify-center" id="jokes-stage">
            <button
              onClick={handleFetchJokes}
              disabled={loadingJokes}
              className={`relative group flex items-center gap-8 px-20 py-10 rounded-[4rem] font-black text-4xl tracking-tighter transition-all transform hover:scale-[1.03] active:scale-95 shadow-3xl overflow-hidden border-2 ${
                loadingJokes 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-transparent cursor-wait' 
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-orange-500/10'
              }`}
            >
              {!loadingJokes && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              )}
              
              <div className="relative z-10 flex items-center gap-6">
                {loadingJokes ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin text-orange-500"></i>
                    <span>CRAFTING...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-microphone-lines group-hover:rotate-12 transition-transform duration-300"></i>
                    <span>GET 20 BANGER JOKES</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32">
          {jokes.map((joke, idx) => (
            <div key={joke.id} className="animate-in fade-in slide-in-from-bottom-20 duration-1000 fill-mode-both" style={{ animationDelay: `${idx * 60}ms` }}>
              <JokeCard joke={joke} />
            </div>
          ))}
          
          {jokes.length === 0 && !loadingJokes && (
            <div className="col-span-full py-52 text-center flex flex-col items-center group">
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-orange-500/10 blur-[100px] rounded-full animate-pulse"></div>
                <div className="relative w-48 h-48 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform duration-500">
                   <i className="fa-solid fa-masks-theater text-7xl text-slate-200 dark:text-slate-700"></i>
                   <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl animate-bounce">
                     <i className="fa-solid fa-question"></i>
                   </div>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-300 dark:text-slate-800 uppercase tracking-tighter mb-4">Stage is dark</p>
              <p className="text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.5em] text-xs">Awaiting Command to Start the Show</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
