import RoleGuard from "@/components/auth/RoleGuard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { createIA, deleteIA, updateIA } from "@/data/crud";

export default function IAPage() {
  return (
    <RoleGuard allowed={["central", "state"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ iaId: "", registrationNumber: "", organizationName: "", legalStatus: "Government", stateUT: "", districts: [] as string[], isActive: true, createdAt: Date.now() });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const u = onSnapshot(collection(db, "implementing_agencies"), (s) => setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => u();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) { await updateIA(editingId, form as any); setEditingId(null); }
    else { await createIA(form as any); }
    setForm({ ...form, iaId: "", registrationNumber: "", organizationName: "", stateUT: "" });
  }

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Implementing Agencies</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <form onSubmit={onSubmit} className="rounded-xl border p-4 bg-white/70 dark:bg-black/30 space-y-3">
          <h2 className="font-semibold">{editingId ? "Update IA" : "Register IA"}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm">IA ID</label><input className="mt-1 w-full rounded-md border px-3 py-2" value={form.iaId} onChange={(e)=>setForm({ ...form, iaId: e.target.value })} required /></div>
            <div><label className="text-sm">Registration #</label><input className="mt-1 w-full rounded-md border px-3 py-2" value={form.registrationNumber} onChange={(e)=>setForm({ ...form, registrationNumber: e.target.value })} required /></div>
            <div className="col-span-2"><label className="text-sm">Organization</label><input className="mt-1 w-full rounded-md border px-3 py-2" value={form.organizationName} onChange={(e)=>setForm({ ...form, organizationName: e.target.value })} required /></div>
            <div><label className="text-sm">Legal Status</label><select className="mt-1 w-full rounded-md border px-3 py-2" value={form.legalStatus} onChange={(e)=>setForm({ ...form, legalStatus: e.target.value })}><option>Government</option><option>Corporation</option><option>NGO</option></select></div>
            <div><label className="text-sm">State/UT</label><input className="mt-1 w-full rounded-md border px-3 py-2" value={form.stateUT} onChange={(e)=>setForm({ ...form, stateUT: e.target.value })} required /></div>
          </div>
          <Button type="submit">{editingId ? "Update" : "Create"}</Button>
        </form>
        <div className="rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">Registry</h2>
          <div className="mt-3 space-y-2 max-h-[420px] overflow-auto">
            {items.map((it) => (
              <div key={it.id} className="rounded-lg border p-3 text-sm flex items-center justify-between">
                <div>
                  <p className="font-medium">{it.organizationName}</p>
                  <p className="text-muted-foreground">Reg: {it.registrationNumber} • {it.legalStatus} • {it.stateUT}</p>
                </div>
                <div className="text-right">
                  <div className="mt-1 flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={()=>{ setEditingId(it.id); setForm({ ...form, ...it }); }}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={()=>deleteIA(it.id)}>Delete</Button>
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
