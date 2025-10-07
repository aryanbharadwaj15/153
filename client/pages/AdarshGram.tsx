import RoleGuard from "@/components/auth/RoleGuard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { createVillage, deleteVillage, updateVillage } from "@/data/crud";

export default function AdarshGramPage() {
  return (
    <RoleGuard allowed={["central", "state", "ia", "monitor"]}>
      <Content />
    </RoleGuard>
  );
}

function Content() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({
    villageId: "",
    villageName: "",
    state: "",
    district: "",
    block: "",
    demographics: {},
    vdpStatus: {},
    socioEconomicIndicators: {},
    gapFillingWorks: [],
    adarshGramStatus: "selected",
    declarationDate: Date.now(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const u = onSnapshot(collection(db, "adarsh_gram_villages"), (s) =>
      setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    return () => u();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await updateVillage(editingId, form as any);
      setEditingId(null);
    } else {
      await createVillage(form as any);
    }
    setForm({
      ...form,
      villageId: "",
      villageName: "",
      state: "",
      district: "",
      block: "",
    });
  }

  return (
    <section className="container py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Adarsh Gram</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <form
          onSubmit={onSubmit}
          className="rounded-xl border p-4 bg-white/70 dark:bg-black/30 space-y-3"
        >
          <h2 className="font-semibold">
            {editingId ? "Update Village" : "Add Village"}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Village ID</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.villageId}
                onChange={(e) =>
                  setForm({ ...form, villageId: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm">Village Name</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.villageName}
                onChange={(e) =>
                  setForm({ ...form, villageName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm">State</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm">District</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm">Block</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.block}
                onChange={(e) => setForm({ ...form, block: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit">{editingId ? "Update" : "Create"}</Button>
        </form>

        <div className="rounded-xl border p-4 bg-white/70 dark:bg-black/30">
          <h2 className="font-semibold">Villages</h2>
          <div className="mt-3 space-y-2 max-h-[420px] overflow-auto">
            {items.map((v) => (
              <div
                key={v.id}
                className="rounded-lg border p-3 text-sm flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{v.villageName}</p>
                  <p className="text-muted-foreground">
                    {v.state}, {v.district} • {v.block}
                  </p>
                </div>
                <div className="text-right">
                  <div className="mt-1 flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(v.id);
                        setForm({ ...form, ...v });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteVillage(v.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">No villages yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
