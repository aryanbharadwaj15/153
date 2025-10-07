import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

const utilizationData = [
  { month: "Apr", budget: 40, spent: 22 },
  { month: "May", budget: 45, spent: 28 },
  { month: "Jun", budget: 50, spent: 31 },
  { month: "Jul", budget: 55, spent: 37 },
  { month: "Aug", budget: 60, spent: 43 },
  { month: "Sep", budget: 65, spent: 48 },
];

const componentSplit = [
  { name: "Adarsh Gram", value: 56 },
  { name: "GIA", value: 28 },
  { name: "Hostels", value: 16 },
];

export default function Index() {
  return (
    <div className="">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,hsl(var(--sidebar-ring)/0.15),transparent)]" />
        <div className="container relative py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Integrated Digital Project Management System
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                A unified, real-time governance platform for PM-AJAY across Adarsh Gram, Grant-in-Aid, and Hostel components—powered by Firebase.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg"><Link to="/login">Get started</Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/dashboard/central">View dashboards</Link></Button>
              </div>
              <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-sm">
                <li className="rounded-md border bg-white/60 dark:bg-black/30 p-3">
                  <span className="font-semibold">Role-based access</span>
                  <p className="text-muted-foreground">Central, State, IA, EA, District, Monitor</p>
                </li>
                <li className="rounded-md border bg-white/60 dark:bg-black/30 p-3">
                  <span className="font-semibold">Live fund flow</span>
                  <p className="text-muted-foreground">Releases, UCs, reconciliation</p>
                </li>
                <li className="rounded-md border bg-white/60 dark:bg-black/30 p-3">
                  <span className="font-semibold">Geo-tagged evidence</span>
                  <p className="text-muted-foreground">Photos, videos, GPS</p>
                </li>
                <li className="rounded-md border bg-white/60 dark:bg-black/30 p-3">
                  <span className="font-semibold">Realtime alerts</span>
                  <p className="text-muted-foreground">Delays, overruns, compliance</p>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border bg-white/70 dark:bg-black/30 p-4 sm:p-6 shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Budget vs Expenditure (FY)</p>
                  <div className="h-40 mt-2">
                    <ResponsiveContainer>
                      <AreaChart data={utilizationData} margin={{ left: 0, right: 0 }}>
                        <defs>
                          <linearGradient id="spent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--sidebar-ring))" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="hsl(var(--sidebar-ring))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="budget" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.1)" />
                        <Area type="monotone" dataKey="spent" stroke="hsl(var(--sidebar-ring))" fill="url(#spent)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Component allocation</p>
                  <div className="h-40 mt-2">
                    <ResponsiveContainer>
                      <BarChart data={componentSplit}>
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
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Live Projects</p>
                  <p className="text-2xl font-bold">1,284</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Utilization Rate</p>
                  <p className="text-2xl font-bold">74%</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold text-amber-600">32</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Component Hubs</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <Card title="Adarsh Gram" to="/adarsh-gram" desc="Village Development Plans, socio-economic indicators, and declaration status." />
          <Card title="Grant-in-Aid (GIA)" to="/gia" desc="Institution monitoring with CCTV, service delivery tracking, and compliance." />
          <Card title="Hostels" to="/hostels" desc="Capacity, occupancy, facilities, and funding for student hostels." />
        </div>
      </section>

      <section className="container py-14 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">End-to-end accountability</h3>
            <ul className="mt-4 space-y-3 text-muted-foreground">
              <li>• PFMS-style fund flow tracking with tranche releases and UCs</li>
              <li>• Milestones with geo-tagged evidence and GPS accuracy</li>
              <li>• Automated alerts for delays, budget overruns, and compliance</li>
              <li>• Role-based dashboards for Central, State, IA, EA, and Monitoring</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Button asChild><Link to="/projects">Manage Projects</Link></Button>
              <Button asChild variant="outline"><Link to="/finance/dashboard">Finance Overview</Link></Button>
            </div>
          </div>
          <div className="rounded-xl border bg-white/70 dark:bg-black/30 p-6 shadow">
            <h4 className="text-sm font-semibold">Recent Alerts</h4>
            <div className="mt-3 space-y-3">
              <AlertItem type="Milestone Delay" severity="high" msg="Road construction milestone M3 is delayed by 12 days in District X" />
              <AlertItem type="Budget Overrun" severity="medium" msg="Expenditure crossed 90% for Project P-4312 without UC submission" />
              <AlertItem type="UC Pending" severity="low" msg="Q2 utilization certificate pending for IA-102" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Card({ title, desc, to }: { title: string; desc: string; to: string }) {
  return (
    <Link to={to} className="group block rounded-xl border bg-white/70 dark:bg-black/30 p-6 hover:shadow-lg transition-shadow">
      <div className="h-10 w-10 rounded-md bg-gradient-to-tr from-primary to-[hsl(var(--sidebar-ring))]" />
      <h3 className="mt-4 text-lg font-semibold group-hover:underline">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <span className="mt-4 inline-flex items-center text-sm text-primary">Explore →</span>
    </Link>
  );
}

function AlertItem({ type, severity, msg }: { type: string; severity: "low"|"medium"|"high"|"critical"; msg: string }) {
  const color = {
    low: "text-emerald-600",
    medium: "text-amber-600",
    high: "text-red-600",
    critical: "text-red-700",
  }[severity];
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{type}</p>
        <span className={color + " text-xs font-semibold"}>{severity.toUpperCase()}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{msg}</p>
    </div>
  );
}
