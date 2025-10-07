import RoleGuard from "@/components/auth/RoleGuard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { addAlert } from "@/data/firestore";

export default function AlertsPage() {
  return (
    <RoleGuard allowed={["central", "state", "monitor", "ia"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [form, setForm] = useState({
    alertId: "",
    alertType: "milestone_delay",
    severity: "low",
    projectId: "",
    triggeredBy: "user",
    alertDetails: { message: "" },
    recipients: [],
    status: "active",
    createdAt: Date.now(),
  });

  useEffect(() => {
    const u = onSnapshot(collection(db, "alerts"), (s) => setAlerts(s.docs.map((d) => d.data())));
    return () => u();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await addAlert({ ...form } as any);
    setForm({ ...form, alertId: "", projectId: "", alertDetails: { message: "" } });
  }

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Alert Management</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <form onSubmit={onSubmit} className="rounded-xl border p-4 bg-white/70 dark:bg-black/30 space-y-3">
          <h2 className="font-semibold">Create alert</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Alert ID</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.alertId} onChange={(e)=>setForm({ ...form, alertId: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm">Project ID</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.projectId} onChange={(e)=>setForm({ ...form, projectId: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm">Type</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.alertType} onChange={(e)=>setForm({ ...form, alertType: e.target.value })}>
                <option>milestone_delay</option>
                <option>budget_overrun</option>
                <option>uc_pending</option>
                <option>quality_issue</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Severity</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.severity} onChange={(e)=>setForm({ ...form, severity: e.target.value })}>
                <option>low</option>
                <option>medium</option>
                <option>high</option>
                <option>critical</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-sm">Message</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.alertDetails.message} onChange={(e)=>setForm({ ...form, alertDetails: { message: e.target.value } })} required />
            </div>
          </div>
          <Button type="submit">Save</Button>
        </form>

        <div className="rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">Alerts</h2>
          <div className="mt-3 space-y-2 max-h-[420px] overflow-auto">
            {alerts.map((a) => (
              <div key={a.alertId} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{a.alertType.replace(/_/g, " ")}</p>
                  <span className="text-muted-foreground">{a.severity}</span>
                </div>
                <p className="text-muted-foreground">{a.alertDetails?.message}</p>
              </div>
            ))}
            {alerts.length === 0 && <p className="text-sm text-muted-foreground">No alerts yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
