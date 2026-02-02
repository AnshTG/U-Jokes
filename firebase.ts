
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Configuration for project u-jokes (Updated with user's provided config)
const firebaseConfig = {
  apiKey: "AIzaSyCeG-ZtJ51yXuJieeKA0SNoVICUkOyWa70",
  authDomain: "u-jokes.firebaseapp.com",
  projectId: "u-jokes",
  storageBucket: "u-jokes.firebasestorage.app",
  messagingSenderId: "82695618833",
  appId: "1:82695618833:web:6d3d186f53850ece9a8cb0",
  measurementId: "G-QVEMXWQCQ1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    // Note: If this fails with auth/popup-blocked, the user should enable popups in their browser.
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Firebase Auth Error:", error.code, error.message);
    throw error;
  }
};

export const logout = () => signOut(auth);
