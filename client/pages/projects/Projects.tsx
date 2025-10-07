import RoleGuard from "@/components/auth/RoleGuard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ProjectsPage() {
  return (
    <RoleGuard allowed={["central", "state", "ia", "ea"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const u = onSnapshot(collection(db, "projects"), (s) => setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => u();
  }, []);

  return (
    <section className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Projects</h1>
        <Button asChild><Link to="/projects/create">New Project</Link></Button>
      </div>

      <div className="mt-6 space-y-2">
        {items.map((p) => (
          <div key={p.id} className="rounded-lg border p-3 text-sm flex items-center justify-between">
            <div>
              <p className="font-medium">{p.projectName}</p>
              <p className="text-muted-foreground">{p.component} • {p.stateUT}, {p.district}</p>
            </div>
            <Link to={`/projects/${p.id}`} className="text-primary hover:underline">View</Link>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
      </div>
    </section>
  );
}
