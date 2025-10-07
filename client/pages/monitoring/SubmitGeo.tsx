import RoleGuard from "@/components/auth/RoleGuard";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { addGeoTracking } from "@/data/firestore";
import { useAuth } from "@/context/AuthContext";

export default function SubmitGeo() {
  return (
    <RoleGuard allowed={["ia", "ea"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const { userDoc } = useAuth();
  const [form, setForm] = useState({
    trackingId: "",
    projectId: "",
    latitude: "",
    longitude: "",
    accuracy: "",
    description: "",
    mediaUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload: any = {
        trackingId: form.trackingId || `t_${Date.now()}`,
        projectId: form.projectId,
        location: {
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          accuracy: form.accuracy ? Number(form.accuracy) : undefined,
        },
        progressUpdates: [
          {
            updateId: `u_${Date.now()}`,
            updatedBy: userDoc?.userId || "",
            updateType: "milestone",
            description: form.description,
            mediaFiles: form.mediaUrl ? [{ type: "photo", url: form.mediaUrl, geoTagged: true, timestamp: Date.now() }] : [],
            timestamp: Date.now(),
          },
        ],
        verificationStatus: "unverified",
        lastVerified: undefined,
      };
      await addGeoTracking(payload);
      setForm({ trackingId: "", projectId: "", latitude: "", longitude: "", accuracy: "", description: "", mediaUrl: "" });
    } catch (err: any) {
      setError(err?.message || "Failed to submit");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Submit Field / Geo Update</h1>
      <form onSubmit={onSubmit} className="mt-6 rounded-xl border p-4 bg-white/70 dark:bg-black/30 space-y-3 max-w-2xl">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Tracking ID</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.trackingId} onChange={(e)=>setForm({ ...form, trackingId: e.target.value })} />
          </div>
          <div>
            <label className="text-sm">Project ID</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.projectId} onChange={(e)=>setForm({ ...form, projectId: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm">Latitude</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.latitude} onChange={(e)=>setForm({ ...form, latitude: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm">Longitude</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.longitude} onChange={(e)=>setForm({ ...form, longitude: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm">Accuracy (meters)</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.accuracy} onChange={(e)=>setForm({ ...form, accuracy: e.target.value })} />
          </div>
          <div>
            <label className="text-sm">Media URL (optional)</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.mediaUrl} onChange={(e)=>setForm({ ...form, mediaUrl: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="text-sm">Description</label>
          <textarea className="mt-1 w-full rounded-md border px-3 py-2" value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={saving}>{saving ? "Submitting..." : "Submit"}</Button>
      </form>
    </section>
  );
}
