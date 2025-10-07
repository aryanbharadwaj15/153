import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  User,
  updateProfile,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserDoc, Role, Permissions } from "@shared/pmajay";
import { ensureUserDoc } from "@/data/firestore";

interface AuthContextValue {
  user: User | null;
  userDoc: UserDoc | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u?.uid) {
        const ref = doc(db, "users", u.uid);
        return onSnapshot(ref, (snap) => setUserDoc((snap.data() as UserDoc) || null));
      } else {
        setUserDoc(null);
      }
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      userDoc,
      loading,
      async signIn(email, password) {
        await signInWithEmailAndPassword(auth, email, password);
      },
      async signUp(email, password, name) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
        await ensureUserDoc(cred.user.uid, email, name);
      },
      async resetPassword(email) {
        await sendPasswordResetEmail(auth, email);
      },
      async logout() {
        await signOut(auth);
      },
    }),
    [user, userDoc, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
