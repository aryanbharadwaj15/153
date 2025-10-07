import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
        )
      }
    >
      {children}
    </NavLink>
  );
}

export default function MainLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-[hsl(var(--muted))]">
      <header className="sticky top-0 z-40 border-b bg-white/70 dark:bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-primary to-[hsl(var(--sidebar-ring))] shadow" />
            <span className="text-base font-extrabold tracking-tight">PM-AJAY IDPMS</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/dashboard/central">Dashboard</NavItem>
            <NavItem to="/projects">Projects</NavItem>
            <NavItem to="/agencies/ia">Agencies</NavItem>
            <NavItem to="/finance/dashboard">Finance</NavItem>
            <NavItem to="/monitoring/real-time">Monitoring</NavItem>
            <NavItem to="/reports">Reports</NavItem>
            <NavItem to="/analytics">Analytics</NavItem>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden sm:block text-sm text-foreground/70">{user.displayName || user.email}</span>
                <Button variant="outline" size="sm" onClick={logout}>Sign out</Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm"><Link to="/login">Log in</Link></Button>
                <Button asChild size="sm"><Link to="/signup">Sign up</Link></Button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PM-AJAY IDPMS</p>
          <div className="flex items-center gap-4">
            <Link to="/adarsh-gram" className="hover:underline">Adarsh Gram</Link>
            <Link to="/gia" className="hover:underline">GIA</Link>
            <Link to="/hostels" className="hover:underline">Hostels</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
