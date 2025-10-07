import RoleGuard from "@/components/auth/RoleGuard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { createBudget, updateBudget, deleteBudget } from "@/data/crud";

export default function BudgetsPage() {
  return (
    <RoleGuard allowed={["central", "state", "ia"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [form, setForm] = useState({
    budgetId: "",
    fiscalYear: "2024-25",
    component: "adarsh_gram",
    stateUT: "",
    allocations: { totalAllocated: 0, revisedEstimate: 0, utilized: 0, committed: 0, available: 0 },
    breakdown: { centralShare: 0, stateShare: 0, administrativeExpenses: 0, directBeneficiary: 0 },
    utilizationRate: 0,
    lastUpdated: Date.now(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const u = onSnapshot(collection(db, "budgets"), (s) => setBudgets(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => u();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await updateBudget(editingId, { ...form } as any);
      setEditingId(null);
    } else {
      await createBudget({ ...form } as any);
    }
    setForm({ ...form, budgetId: "", stateUT: "", allocations: { totalAllocated: 0, revisedEstimate: 0, utilized: 0, committed: 0, available: 0 } });
  }

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Budget Management</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <form onSubmit={onSubmit} className="rounded-xl border p-4 bg-white/70 dark:bg-black/30 space-y-3">
          <h2 className="font-semibold">{editingId ? "Update budget" : "Create budget"}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Budget ID</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.budgetId} onChange={(e)=>setForm({ ...form, budgetId: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm">State/UT</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.stateUT} onChange={(e)=>setForm({ ...form, stateUT: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm">Component</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.component} onChange={(e)=>setForm({ ...form, component: e.target.value })}>
                <option>adarsh_gram</option>
                <option>gia</option>
                <option>hostel</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Total Allocated (₹)</label>
              <input type="number" className="mt-1 w-full rounded-md border px-3 py-2" value={form.allocations.totalAllocated} onChange={(e)=>setForm({ ...form, allocations: { ...form.allocations, totalAllocated: Number(e.target.value) } })} required />
            </div>
            <div>
              <label className="text-sm">Utilized (₹)</label>
              <input type="number" className="mt-1 w-full rounded-md border px-3 py-2" value={form.allocations.utilized} onChange={(e)=>setForm({ ...form, allocations: { ...form.allocations, utilized: Number(e.target.value) } })} />
            </div>
          </div>
          <Button type="submit">{editingId ? "Update" : "Create"}</Button>
        </form>

        <div className="rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">Budgets</h2>
          <div className="mt-3 space-y-2 max-h-[420px] overflow-auto">
            {budgets.map((b) => (
              <div key={b.id} className="rounded-lg border p-3 text-sm flex items-center justify-between">
                <div>
                  <p className="font-medium">{b.stateUT} — {b.component}</p>
                  <p className="text-muted-foreground">FY {b.fiscalYear}</p>
                </div>
                <div className="text-right">
                  <p>Allocated: ₹{Number(b.allocations?.totalAllocated || 0).toLocaleString("en-IN")}</p>
                  <p className="text-muted-foreground">Utilized: ₹{Number(b.allocations?.utilized || 0).toLocaleString("en-IN")}</p>
                  <div className="mt-1 flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={()=>{ setEditingId(b.id); setForm({ ...form, ...b }); }}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={()=>deleteBudget(b.id)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
            {budgets.length === 0 && <p className="text-sm text-muted-foreground">No budgets yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
