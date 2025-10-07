import RoleGuard from "@/components/auth/RoleGuard";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { createUC, deleteUC } from "@/data/crud";
import { useAuth } from "@/context/AuthContext";

export default function UCPage() {
  return (
    <RoleGuard allowed={["central", "state", "ia"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const { userDoc } = useAuth();
  const [ucs, setUCs] = useState<any[]>([]);
  const [form, setForm] = useState({
    ucId: "",
    projectId: "",
    submittedBy: "",
    period: "quarterly",
    amount: 0,
    submissionDate: Date.now(),
    status: "pending",
    documents: [],
  });

  useEffect(() => {
    const u = onSnapshot(collection(db, "utilization_certificates"), (s) => setUCs(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => u();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = { ...form, submittedBy: userDoc?.userId } as any;
    await createUC(payload);
    setForm({ ...form, ucId: "", projectId: "", amount: 0 });
  }

  async function approve(id: string) {
    await updateDoc(doc(db, "utilization_certificates", id), { status: "approved" });
  }

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Utilization Certificates</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <form onSubmit={onSubmit} className="rounded-xl border p-4 bg-white/70 dark:bg-black/30 space-y-3">
          <h2 className="font-semibold">Submit UC</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">UC ID</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.ucId} onChange={(e)=>setForm({ ...form, ucId: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm">Project ID</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.projectId} onChange={(e)=>setForm({ ...form, projectId: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm">Period</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.period} onChange={(e)=>setForm({ ...form, period: e.target.value })}>
                <option>quarterly</option>
                <option>annual</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Amount (₹)</label>
              <input type="number" className="mt-1 w-full rounded-md border px-3 py-2" value={form.amount} onChange={(e)=>setForm({ ...form, amount: Number(e.target.value) })} required />
            </div>
          </div>
          <Button type="submit">Submit</Button>
        </form>

        <div className="rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">UCs</h2>
          <div className="mt-3 space-y-2 max-h-[420px] overflow-auto">
            {ucs.map((u) => (
              <div key={u.id} className="rounded-lg border p-3 text-sm grid grid-cols-3 gap-3">
                <div>
                  <p className="font-medium">{u.projectId}</p>
                  <p className="text-muted-foreground">{u.period}</p>
                </div>
                <div>
                  <p>Amount: ₹{Number(u.amount).toLocaleString("en-IN")}</p>
                  <p className="text-muted-foreground">By: {u.submittedBy}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{u.status}</p>
                  <div className="mt-1 flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={()=>approve(u.id)}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={()=>deleteUC(u.id)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
            {ucs.length === 0 && <p className="text-sm text-muted-foreground">No UCs yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
