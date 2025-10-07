import RoleGuard from "@/components/auth/RoleGuard";
import { useEffect, useState, FormEvent } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { addFundFlow } from "@/data/firestore";

export default function FundFlowPage() {
  return (
    <RoleGuard allowed={["central", "state", "ia"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [flows, setFlows] = useState<any[]>([]);
  const [form, setForm] = useState({
    flowId: "",
    projectId: "",
    fromEntity: "MoSJE",
    toEntity: "State",
    amount: 0,
    transferDate: Date.now(),
    pfmsReferenceId: "",
    purpose: "project-funding",
    status: "initiated",
    reconciliationStatus: "pending",
  });

  useEffect(() => {
    const u = onSnapshot(collection(db, "fund_flows"), (s) => setFlows(s.docs.map((d) => d.data())));
    return () => u();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) } as any;
    await addFundFlow({ ...payload } as any);
    setForm({ ...form, flowId: "", projectId: "", pfmsReferenceId: "", amount: 0 });
  }

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Fund Flow Tracking</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <form onSubmit={onSubmit} className="rounded-xl border p-4 bg-white/70 dark:bg-black/30 space-y-3">
          <h2 className="font-semibold">Record transfer</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Flow ID</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.flowId} onChange={(e)=>setForm({ ...form, flowId: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm">Project ID</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.projectId} onChange={(e)=>setForm({ ...form, projectId: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm">From</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.fromEntity} onChange={(e)=>setForm({ ...form, fromEntity: e.target.value })}>
                <option>MoSJE</option>
                <option>State</option>
                <option>IA</option>
              </select>
            </div>
            <div>
              <label className="text-sm">To</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.toEntity} onChange={(e)=>setForm({ ...form, toEntity: e.target.value })}>
                <option>State</option>
                <option>IA</option>
                <option>EA</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Amount (₹)</label>
              <input type="number" className="mt-1 w-full rounded-md border px-3 py-2" value={form.amount} onChange={(e)=>setForm({ ...form, amount: Number(e.target.value) })} required />
            </div>
            <div>
              <label className="text-sm">PFMS Ref</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.pfmsReferenceId} onChange={(e)=>setForm({ ...form, pfmsReferenceId: e.target.value })} required />
            </div>
            <div className="col-span-2">
              <label className="text-sm">Purpose</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.purpose} onChange={(e)=>setForm({ ...form, purpose: e.target.value })}>
                <option>project-funding</option>
                <option>operational</option>
                <option>emergency</option>
              </select>
            </div>
          </div>
          <Button type="submit">Save</Button>
        </form>

        <div className="rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">Transfers</h2>
          <div className="mt-3 space-y-2 max-h-[420px] overflow-auto">
            {flows.map((f) => (
              <div key={f.flowId} className="rounded-lg border p-3 text-sm grid grid-cols-3 gap-3">
                <div>
                  <p className="font-medium">{f.fromEntity} → {f.toEntity}</p>
                  <p className="text-muted-foreground">PFMS: {f.pfmsReferenceId}</p>
                </div>
                <div>
                  <p>Project: {f.projectId}</p>
                  <p className="text-muted-foreground">{new Date(f.transferDate).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{Number(f.amount).toLocaleString("en-IN")}</p>
                  <p className="text-muted-foreground">{f.status}</p>
                </div>
              </div>
            ))}
            {flows.length === 0 && <p className="text-sm text-muted-foreground">No transfers yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
