import RoleGuard from "@/components/auth/RoleGuard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { createEA, deleteEA, updateEA } from "@/data/crud";

export default function EAPage() {
  return (
    <RoleGuard allowed={["central", "state", "ia"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ eaId: "", contractorName: "", contractorType: "Construction", parentIA: "", licenseNumber: "", isActive: true, createdAt: Date.now() });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const u = onSnapshot(collection(db, "executing_agencies"), (s) => setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => u();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) { await updateEA(editingId, form as any); setEditingId(null); }
    else { await createEA(form as any); }
    setForm({ ...form, eaId: "", contractorName: "", parentIA: "" });
  }

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Executing Agencies</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <form onSubmit={onSubmit} className="rounded-xl border p-4 bg-white/70 dark:bg-black/30 space-y-3">
          <h2 className="font-semibold">{editingId ? "Update EA" : "Register EA"}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm">EA ID</label><input className="mt-1 w-full rounded-md border px-3 py-2" value={form.eaId} onChange={(e)=>setForm({ ...form, eaId: e.target.value })} required /></div>
            <div><label className="text-sm">Contractor</label><input className="mt-1 w-full rounded-md border px-3 py-2" value={form.contractorName} onChange={(e)=>setForm({ ...form, contractorName: e.target.value })} required /></div>
            <div><label className="text-sm">Type</label><select className="mt-1 w-full rounded-md border px-3 py-2" value={form.contractorType} onChange={(e)=>setForm({ ...form, contractorType: e.target.value })}><option>Construction</option><option>Service</option><option>Technical</option></select></div>
            <div><label className="text-sm">Parent IA</label><input className="mt-1 w-full rounded-md border px-3 py-2" value={form.parentIA} onChange={(e)=>setForm({ ...form, parentIA: e.target.value })} /></div>
          </div>
          <Button type="submit">{editingId ? "Update" : "Create"}</Button>
        </form>
        <div className="rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">Registry</h2>
          <div className="mt-3 space-y-2 max-h-[420px] overflow-auto">
            {items.map((it) => (
              <div key={it.id} className="rounded-lg border p-3 text-sm flex items-center justify-between">
                <div>
                  <p className="font-medium">{it.contractorName}</p>
                  <p className="text-muted-foreground">{it.contractorType} • IA: {it.parentIA || "—"}</p>
                </div>
                <div className="text-right">
                  <div className="mt-1 flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={()=>{ setEditingId(it.id); setForm({ ...form, ...it }); }}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={()=>deleteEA(it.id)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-sm text-muted-foreground">No agencies yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
