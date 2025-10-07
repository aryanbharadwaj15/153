import { useEffect, useMemo, useState } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

export default function CentralDashboard() {
  return (
    <RoleGuard allowed={["central"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [fundFlows, setFundFlows] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "fund_flows"), (snap) => setFundFlows(snap.docs.map((d) => d.data())));
    const unsub2 = onSnapshot(collection(db, "budgets"), (snap) => setBudgets(snap.docs.map((d) => d.data())));
    const unsub3 = onSnapshot(collection(db, "alerts"), (snap) => setAlerts(snap.docs.map((d) => d.data())));
    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  const totals = useMemo(() => {
    const totalReleased = fundFlows.reduce((a, f) => a + (f.amount || 0), 0);
    const totalUtilized = budgets.reduce((a, b) => a + (b.allocations?.utilized || 0), 0);
    const utilizationRate = (() => {
      const totalAllocated = budgets.reduce((a, b) => a + (b.allocations?.totalAllocated || 0), 0);
      if (!totalAllocated) return 0;
      return Math.round((totalUtilized / totalAllocated) * 100);
    })();
    return { totalReleased, totalUtilized, utilizationRate };
  }, [fundFlows, budgets]);

  const months = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
  const series = months.map((m, i) => ({ month: m, budget: budgets[i]?.allocations?.totalAllocated || (i+1)*50, spent: budgets[i]?.allocations?.utilized || (i+1)*32 }));
  const split = [
    { name: "Adarsh Gram", value: budgets.filter((b)=>b.component==="adarsh_gram").reduce((a,b)=>a+(b.allocations?.totalAllocated||0),0) },
    { name: "GIA", value: budgets.filter((b)=>b.component==="gia").reduce((a,b)=>a+(b.allocations?.totalAllocated||0),0) },
    { name: "Hostels", value: budgets.filter((b)=>b.component==="hostel").reduce((a,b)=>a+(b.allocations?.totalAllocated||0),0) },
  ];

  return (
    <section className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold">MoSJE Executive Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/finance/budgets">Manage Budgets</Link></Button>
          <Button asChild><Link to="/finance/fund-flow">Record Fund Flow</Link></Button>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white/70 dark:bg-black/30 p-4">
          <p className="text-xs text-muted-foreground">Budget vs Expenditure (FY)</p>
          <div className="h-56 mt-2">
            <ResponsiveContainer>
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="spent2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--sidebar-ring))" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="hsl(var(--sidebar-ring))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="budget" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.1)" />
                <Area type="monotone" dataKey="spent" stroke="hsl(var(--sidebar-ring))" fill="url(#spent2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border bg-white/70 dark:bg-black/30 p-4">
          <p className="text-xs text-muted-foreground">Component allocation</p>
          <div className="h-56 mt-2">
            <ResponsiveContainer>
              <BarChart data={split}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <KPI label="Total Released" value={totals.totalReleased.toLocaleString("en-IN", { style: "currency", currency: "INR" })} />
        <KPI label="Total Utilized" value={totals.totalUtilized.toLocaleString("en-IN", { style: "currency", currency: "INR" })} />
        <KPI label="Utilization Rate" value={`${totals.utilizationRate}%`} />
      </div>

      <div className="mt-8 rounded-xl border bg-white/70 dark:bg-black/30 p-4">
        <h2 className="text-lg font-semibold">Active Alerts</h2>
        <div className="mt-3 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No alerts yet.</p>
          ) : (
            alerts.map((a) => (
              <div key={a.alertId} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{a.alertType.replace(/_/g, " ")}</p>
                  <span className="text-xs font-semibold">{a.severity}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{a.alertDetails?.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
