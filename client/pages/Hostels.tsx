import RoleGuard from "@/components/auth/RoleGuard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { createHostel, deleteHostel, updateHostel } from "@/data/crud";

export default function HostelsPage() {
  return (
    <RoleGuard allowed={["central", "state", "ia", "monitor"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({
    hostelId: "",
    hostelName: "",
    location: {
      state: "",
      district: "",
      institutionName: "",
      institutionType: "Central University",
    },
    infrastructure: {
      capacity: 0,
      currentOccupancy: 0,
      facilities: [],
      constructionStatus: "proposed",
    },
    beneficiaries: {},
    funding: {},
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const u = onSnapshot(collection(db, "hostels"), (s) =>
      setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    return () => u();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await updateHostel(editingId, form as any);
      setEditingId(null);
    } else {
      await createHostel(form as any);
    }
    setForm({
      ...form,
      hostelId: "",
      hostelName: "",
      location: {
        ...form.location,
        state: "",
        district: "",
        institutionName: "",
      },
    });
  }

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Hostels</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <form
          onSubmit={onSubmit}
          className="rounded-xl border p-4 bg-white/70 dark:bg-black/30 space-y-3"
        >
          <h2 className="font-semibold">
            {editingId ? "Update Hostel" : "Add Hostel"}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Hostel ID</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.hostelId}
                onChange={(e) => setForm({ ...form, hostelId: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm">Hostel Name</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.hostelName}
                onChange={(e) =>
                  setForm({ ...form, hostelName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm">State</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.location.state}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: { ...form.location, state: e.target.value },
                  })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm">District</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.location.district}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: { ...form.location, district: e.target.value },
                  })
                }
                required
              />
            </div>
          </div>
          <Button type="submit">{editingId ? "Update" : "Create"}</Button>
        </form>

        <div className="rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">Hostels</h2>
          <div className="mt-3 space-y-2 max-h-[420px] overflow-auto">
            {items.map((h) => (
              <div
                key={h.id}
                className="rounded-lg border p-3 text-sm flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{h.hostelName}</p>
                  <p className="text-muted-foreground">
                    {h.location?.state}, {h.location?.district}
                  </p>
                </div>
                <div className="text-right">
                  <div className="mt-1 flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(h.id);
                        setForm({ ...form, ...h });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteHostel(h.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">No hostels yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
