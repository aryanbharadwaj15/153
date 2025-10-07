import RoleGuard from "@/components/auth/RoleGuard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function RealTimeTracking() {
  return (
    <RoleGuard allowed={["central", "state", "monitor", "ia", "ea"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [tracks, setTracks] = useState<any[]>([]);
  useEffect(() => {
    const u = onSnapshot(collection(db, "geo_tracking"), (s) => setTracks(s.docs.map((d)=>d.data())));
    return () => u();
  }, []);

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Real-time Tracking</h1>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {tracks.map((t) => (
          <div key={t.trackingId} className="rounded-xl border p-4 bg-white/70 dark:bg-black/30">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Project: {t.projectId}</p>
              <a
                href={`https://www.openstreetmap.org/?mlat=${t.location?.latitude}&mlon=${t.location?.longitude}#map=14/${t.location?.latitude}/${t.location?.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary hover:underline"
              >Open map</a>
            </div>
            <p className="text-sm text-muted-foreground">Lat {t.location?.latitude}, Lng {t.location?.longitude} (±{t.location?.accuracy}m)</p>
            <div className="mt-3 space-y-2 max-h-56 overflow-auto">
              {t.progressUpdates?.map((u: any) => (
                <div key={u.updateId} className="rounded-lg border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{u.updateType}</p>
                    <span className="text-muted-foreground">{new Date(u.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-muted-foreground">{u.description}</p>
                </div>
              ))}
              {(!t.progressUpdates || t.progressUpdates.length===0) && (
                <p className="text-sm text-muted-foreground">No updates yet.</p>
              )}
            </div>
          </div>
        ))}
        {tracks.length === 0 && <p className="text-sm text-muted-foreground">No geo-tracking entries yet.</p>}
      </div>
    </section>
  );
}
