import RoleGuard from "@/components/auth/RoleGuard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  createInstitution,
  deleteInstitution,
  updateInstitution,
} from "@/data/crud";

export default function GIAPage() {
  return (
    <RoleGuard allowed={["central", "state", "ia", "monitor"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({
    institutionId: "",
    institutionName: "",
    institutionType: "NGO",
    grantDetails: {},
    electronicMonitoring: {
      cctvInstalled: false,
      deviceDetails: {},
      loginCredentials: {},
      complianceStatus: "pending",
    },
    serviceDelivery: {},
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const u = onSnapshot(collection(db, "gia_institutions"), (s) =>
      setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    return () => u();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await updateInstitution(editingId, form as any);
      setEditingId(null);
    } else {
      await createInstitution(form as any);
    }
    setForm({ ...form, institutionId: "", institutionName: "" });
  }

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">
        Grant-in-Aid (GIA)
      </h1>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <form
          onSubmit={onSubmit}
          className="rounded-xl border p-4 bg-white/70 dark:bg-black/30 space-y-3"
        >
          <h2 className="font-semibold">
            {editingId ? "Update Institution" : "Add Institution"}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Institution ID</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.institutionId}
                onChange={(e) =>
                  setForm({ ...form, institutionId: e.target.value })
                }
                required
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm">Institution Name</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.institutionName}
                onChange={(e) =>
                  setForm({ ...form, institutionName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm">Type</label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.institutionType}
                onChange={(e) =>
                  setForm({ ...form, institutionType: e.target.value })
                }
              >
                <option>NGO</option>
                <option>Educational</option>
                <option>Technical</option>
                <option>Research</option>
              </select>
            </div>
          </div>
          <Button type="submit">{editingId ? "Update" : "Create"}</Button>
        </form>

        <div className="rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">Institutions</h2>
          <div className="mt-3 space-y-2 max-h-[420px] overflow-auto">
            {items.map((it) => (
              <div
                key={it.id}
                className="rounded-lg border p-3 text-sm flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{it.institutionName}</p>
                  <p className="text-muted-foreground">{it.institutionType}</p>
                </div>
                <div className="text-right">
                  <div className="mt-1 flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(it.id);
                        setForm({ ...form, ...it });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteInstitution(it.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No institutions yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
