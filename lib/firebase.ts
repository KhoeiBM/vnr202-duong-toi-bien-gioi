import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Cấu hình Firebase công khai (khóa client — không phải bí mật).
 * Ưu tiên biến môi trường NEXT_PUBLIC_FIREBASE_*, fallback về cấu hình dự án.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyBaZAhsTGuNRN7dK9w7Dfj82AyZG3o-UA0',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'vnr202-50e1e.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'vnr202-50e1e',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'vnr202-50e1e.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '644458891745',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:644458891745:web:66e1528e3da9b99b42eaa0',
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
