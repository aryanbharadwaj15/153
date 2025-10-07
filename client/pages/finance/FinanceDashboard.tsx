import RoleGuard from "@/components/auth/RoleGuard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function FinanceDashboard() {
  return (
    <RoleGuard allowed={["central", "state", "ia"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [flows, setFlows] = useState<any[]>([]);

  useEffect(() => {
    const u1 = onSnapshot(collection(db, "budgets"), (s) => setBudgets(s.docs.map((d) => d.data())));
    const u2 = onSnapshot(collection(db, "fund_flows"), (s) => setFlows(s.docs.map((d) => d.data())));
    return () => { u1(); u2(); };
  }, []);

  const totals = {
    allocated: budgets.reduce((a, b) => a + (b.allocations?.totalAllocated || 0), 0),
    utilized: budgets.reduce((a, b) => a + (b.allocations?.utilized || 0), 0),
    released: flows.reduce((a, f) => a + (f.amount || 0), 0),
  };

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Financial Overview</h1>
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <Tile label="Total Allocated" value={totals.allocated} />
        <Tile label="Total Utilized" value={totals.utilized} />
        <Tile label="Total Released" value={totals.released} />
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">Budgets</h2>
          <div className="mt-3 space-y-2 max-h-[340px] overflow-auto">
            {budgets.map((b) => (
              <div key={b.budgetId} className="rounded-lg border p-3 text-sm flex items-center justify-between">
                <div>
                  <p className="font-medium">{b.stateUT} — {b.component}</p>
                  <p className="text-muted-foreground">FY {b.fiscalYear}</p>
                </div>
                <div className="text-right">
                  <p>Allocated: ₹{b.allocations?.totalAllocated?.toLocaleString("en-IN")}</p>
                  <p className="text-muted-foreground">Utilized: ₹{b.allocations?.utilized?.toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
            {budgets.length === 0 && <p className="text-sm text-muted-foreground">No budgets yet.</p>}
          </div>
        </div>
        <div className="rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">Fund Flows</h2>
          <div className="mt-3 space-y-2 max-h-[340px] overflow-auto">
            {flows.map((f) => (
              <div key={f.flowId} className="rounded-lg border p-3 text-sm grid grid-cols-3 gap-3">
                <div>
                  <p className="font-medium">{f.fromEntity} → {f.toEntity}</p>
                  <p className="text-muted-foreground">{new Date(f.transferDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p>Project: {f.projectId}</p>
                  <p className="text-muted-foreground">PFMS: {f.pfmsReferenceId}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{f.amount?.toLocaleString("en-IN")}</p>
                  <p className="text-muted-foreground">{f.status}</p>
                </div>
              </div>
            ))}
            {flows.length === 0 && <p className="text-sm text-muted-foreground">No fund flows yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function Tile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">₹{value.toLocaleString("en-IN")}</p>
    </div>
  );
}
