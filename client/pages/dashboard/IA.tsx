import RoleGuard from "@/components/auth/RoleGuard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function IADashboard() {
  return (
    <RoleGuard allowed={["ia"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const { userDoc } = useAuth();
  return (
    <section className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Implementing Agency (IA) Dashboard
        </h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/projects">My Projects</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/finance/uc">Submit UC</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Assigned Projects</p>
          <p className="text-2xl font-bold">
            {userDoc?.assignedProjects?.length ?? 0}
          </p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Pending UCs</p>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Open Alerts</p>
          <p className="text-2xl font-bold text-amber-600">2</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border p-4 bg-white/70 dark:bg-black/30">
        <h2 className="font-semibold">IA actions</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Button asChild>
            <Link to="/projects">Projects</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/finance/fund-flow">Request Funds</Link>
          </Button>
          <Button asChild>
            <Link to="/monitoring/submit">Submit Field Update</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/monitoring/real-time">View Monitoring</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
