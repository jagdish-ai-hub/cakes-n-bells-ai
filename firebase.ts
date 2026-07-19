import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging, isSupported, getToken } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDJ8FKA_PTLtlqdMPw7J88wt_js9diBzMs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cakesnbells.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cakesnbells",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cakesnbells.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "683519090253",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:683519090253:web:d394d289ac9c4c71b74604"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);


export let messaging: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

export const requestForToken = async () => {
  if (!messaging) return null;
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: 'BC6KR7hY0bdb_gWjAkcwBvocKYgSlTQMu0sGduuPYkbJR63Cu6pGIt2aN7hkkKnF2jzZwf5m5yDr_RZUhc-8Fd0'
    });
    if (currentToken) {
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
};

