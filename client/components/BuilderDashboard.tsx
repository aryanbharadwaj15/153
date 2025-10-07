import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";

export default function BuilderDashboard() {
  const [sdkAvailable, setSdkAvailable] = useState(false);

  useEffect(() => {
    const hasBuilder = (window as any).Builder !== undefined;
    setSdkAvailable(hasBuilder);
  }, []);

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

  return (
    <section className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Builder.io Dashboards</h1>
        <div className="text-sm text-muted-foreground">{sdkAvailable ? "Connected" : "Not connected"}</div>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white/70 dark:bg-black/30 p-4">
          <p className="text-xs text-muted-foreground">Budget vs Expenditure (FY)</p>
          <div className="h-56 mt-2">
            <ResponsiveContainer>
              <AreaChart data={utilizationData}>
                <defs>
                  <linearGradient id="bd_spent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--sidebar-ring))" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="hsl(var(--sidebar-ring))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="budget" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.1)" />
                <Area type="monotone" dataKey="spent" stroke="hsl(var(--sidebar-ring))" fill="url(#bd_spent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white/70 dark:bg-black/30 p-4">
          <p className="text-xs text-muted-foreground">Component allocation</p>
          <div className="h-56 mt-2">
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

      <div className="mt-6 rounded-xl border p-4 bg-white/70 dark:bg-black/30">
        <h2 className="text-lg font-semibold">Builder.io integration</h2>
        <div className="mt-3 text-sm text-muted-foreground">
          {sdkAvailable ? (
            <p>Builder SDK detected. Visual dashboards authored in Builder.io will render here when published and mounted.</p>
          ) : (
            <div>
              <p>No Builder.io integration detected. To enable visual dashboards:</p>
              <ol className="list-decimal pl-5 mt-2">
                <li>Open the MCP popover and connect Builder.io to this project.</li>
                <li>Install the @builder.io/react SDK and follow Builder.io docs to mount content inside this route.</li>
                <li>Use Builder.io editor to create dashboards and publish them.</li>
              </ol>
              <div className="mt-4 flex gap-2">
                <a href="#open-mcp-popover" className="inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">Open MCP popover</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
