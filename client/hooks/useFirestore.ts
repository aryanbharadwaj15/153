import { useEffect, useState } from "react";
import { onSnapshot, query, where, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useDoc<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!path);
  useEffect(() => {
    if (!path) return;
    const ref = doc(db, path);
    const unsub = onSnapshot(ref, (snap) => {
      setData((snap.data() as T) || null);
      setLoading(false);
    });
    return () => unsub();
  }, [path]);
  return { data, loading } as const;
}

export function useQuery<T>(q: any) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(q, (snap: any) => {
      const items = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
      setData(items as T[]);
      setLoading(false);
    });
    return () => unsub();
  }, [q]);
  return { data, loading } as const;
}
