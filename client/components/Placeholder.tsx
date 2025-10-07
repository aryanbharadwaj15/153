import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Placeholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-[hsl(var(--sidebar-ring))] bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {description || "This page is ready to be built. Tell me what you want here and I will implement it with live Firebase data, responsive layouts, and dashboards."}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild><Link to="/login">Log in</Link></Button>
          <Button asChild variant="outline"><Link to="/">Back to Home</Link></Button>
        </div>
      </div>
    </section>
  );
}
