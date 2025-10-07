import RoleGuard from "@/components/auth/RoleGuard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function EADashboard() {
  return (
    <RoleGuard allowed={["ea"]}>
      <section className="container py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold">Executing Agency (EA) Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild><Link to="/monitoring/real-time">Monitoring</Link></Button>
            <Button asChild variant="outline"><Link to="/monitoring/submit">Submit Update</Link></Button>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Assigned Work Orders</p>
            <p className="text-2xl font-bold">14</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Pending Issues</p>
            <p className="text-2xl font-bold">1</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Recent Updates</p>
            <p className="text-2xl font-bold">6</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">EA actions</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button asChild><Link to="/monitoring/submit">Submit Geo Update</Link></Button>
            <Button asChild variant="outline"><Link to="/projects">My Projects</Link></Button>
            <Button asChild><Link to="/monitoring/real-time">View Monitoring</Link></Button>
            <Button asChild variant="outline"><Link to="/reports">Reports</Link></Button>
          </div>
        </div>
      </section>
    </RoleGuard>
  );
}
