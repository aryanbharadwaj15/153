import { useEffect, useState } from "react";

export default function BuilderDashboard() {
  const [sdkAvailable, setSdkAvailable] = useState(false);

  useEffect(() => {
    // Try to detect Builder SDK (dynamically loaded by user or MCP integration)
    // This avoids hard dependency on @builder.io/react in the starter template.
    // When Builder.io MCP is connected, the SDK or an iframe embed will be available.
    // We simply check for a global that integrators commonly add.
    // If you want full SDK usage, connect Builder.io MCP and install @builder.io/react.
    const hasBuilder = (window as any).Builder !== undefined;
    setSdkAvailable(hasBuilder);
  }, []);

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Builder.io Dashboards</h1>
      <div className="mt-6 rounded-xl border p-6 bg-white/70 dark:bg-black/30">
        {sdkAvailable ? (
          <div>
            <p className="text-sm text-muted-foreground">Builder SDK detected — render dashboard content here.</p>
            {/* When Builder.io is connected, replace this with SDK-driven content or an iframe. */}
            <div className="mt-4">{/* Placeholder for Builder content */}</div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground">No Builder.io integration detected.</p>
            <ul className="mt-3 list-disc pl-5 text-sm">
              <li>Connect Builder.io via the Open MCP popover to enable visual dashboards.</li>
              <li>Install the @builder.io/react SDK and follow the Builder.io docs to mount pages/components.</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <a href="#open-mcp-popover" className="inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">Connect Builder.io</a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
