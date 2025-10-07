import RoleGuard from "@/components/auth/RoleGuard";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { createProject } from "@/data/crud";
import { useNavigate } from "react-router-dom";

export default function ProjectCreatePage() {
  return (
    <RoleGuard allowed={["central", "state", "ia"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [form, setForm] = useState({ projectId: "", projectName: "", component: "adarsh_gram", projectType: "infrastructure", stateUT: "", district: "", stakeholders: { assignedIA: "", assignedEAs: [] as string[] }, financials: { totalBudget: 0, centralShare: 0, stateShare: 0 }, status: "proposed", createdAt: Date.now() });
  const nav = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await createProject(form as any);
    nav("/projects");
  }

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Create Project</h1>
      <form onSubmit={onSubmit} className="mt-6 rounded-xl border p-4 bg-white/70 dark:bg-black/30 grid grid-cols-2 gap-3">
        <div><label className="text-sm">Project ID</label><input className="mt-1 w-full rounded-md border px-3 py-2" value={form.projectId} onChange={(e)=>setForm({ ...form, projectId: e.target.value })} required /></div>
        <div><label className="text-sm">Project Name</label><input className="mt-1 w-full rounded-md border px-3 py-2" value={form.projectName} onChange={(e)=>setForm({ ...form, projectName: e.target.value })} required /></div>
        <div><label className="text-sm">Component</label><select className="mt-1 w-full rounded-md border px-3 py-2" value={form.component} onChange={(e)=>setForm({ ...form, component: e.target.value })}><option>adarsh_gram</option><option>gia</option><option>hostel</option></select></div>
        <div><label className="text-sm">Type</label><select className="mt-1 w-full rounded-md border px-3 py-2" value={form.projectType} onChange={(e)=>setForm({ ...form, projectType: e.target.value })}><option>infrastructure</option><option>service</option><option>construction</option></select></div>
        <div><label className="text-sm">State/UT</label><input className="mt-1 w-full rounded-md border px-3 py-2" value={form.stateUT} onChange={(e)=>setForm({ ...form, stateUT: e.target.value })} required /></div>
        <div><label className="text-sm">District</label><input className="mt-1 w-full rounded-md border px-3 py-2" value={form.district} onChange={(e)=>setForm({ ...form, district: e.target.value })} required /></div>
        <div className="col-span-2"><label className="text-sm">Total Budget (₹)</label><input type="number" className="mt-1 w-full rounded-md border px-3 py-2" value={form.financials.totalBudget} onChange={(e)=>setForm({ ...form, financials: { ...form.financials, totalBudget: Number(e.target.value) } })} required /></div>
        <div className="col-span-2">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </section>
  );
}
