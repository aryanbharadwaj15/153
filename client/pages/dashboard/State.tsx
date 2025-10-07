import RoleGuard from "@/components/auth/RoleGuard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function StateDashboard() {
  return (
    <RoleGuard allowed={["central", "state"]}>
      <section className="container py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            State / UT Dashboard
          </h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/projects">Projects</Link>
            </Button>
            <Button asChild>
              <Link to="/finance/dashboard">Finance</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Active Projects</p>
            <p className="text-2xl font-bold">312</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Pending UCs</p>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Open Alerts</p>
            <p className="text-2xl font-bold text-amber-600">7</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">State actions</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button asChild>
              <Link to="/agencies/ia">Manage IAs</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/agencies/ea">Manage EAs</Link>
            </Button>
            <Button asChild>
              <Link to="/finance/budgets">Budgets</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/monitoring/real-time">Monitoring</Link>
            </Button>
          </div>
        </div>
      </section>
    </RoleGuard>
  );
}
