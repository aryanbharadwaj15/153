import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAThoWtGnhma9fUHGwEWyhyyGXO6A0iO8A",
  authDomain: "sih153.firebaseapp.com",
  databaseURL: "https://sih153-default-rtdb.firebaseio.com",
  projectId: "sih153",
  storageBucket: "sih153.firebasestorage.app",
  messagingSenderId: "324923717973",
  appId: "1:324923717973:web:69bc85eb6458fae8d497dc",
  measurementId: "G-TWS9WB3WWG",
};

const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

void (async () => {
  try {
    await enableIndexedDbPersistence(db);
  } catch (_) {
    // ignore
  }
  try {
    if (await isSupported()) getAnalytics(app);
  } catch {
    // ignore
  }
})();

export default app;
