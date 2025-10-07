import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  addDoc,
  setDoc,
  serverTimestamp,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { z } from "zod";
import type {
  UserDoc,
  UserDocSchema,
  FundFlow,
  FundFlowSchema,
  Budget,
  BudgetSchema,
  Alert,
  AlertSchema,
  GeoTracking,
  GeoTrackingSchema,
} from "@shared/pmajay";

export const col = {
  users: collection(db, "users"),
  fund_flows: collection(db, "fund_flows"),
  budgets: collection(db, "budgets"),
  alerts: collection(db, "alerts"),
  geo_tracking: collection(db, "geo_tracking"),
};

export function listenCollection<T>(
  q: Parameters<typeof onSnapshot>[0],
  schema: z.ZodTypeAny,
  cb: (items: T[]) => void,
) {
  return onSnapshot(q, (snap) => {
    const items: any[] = [];
    snap.forEach((d) => {
      const data = d.data();
      const parsed = schema.safeParse(data as any);
      if (parsed.success) items.push(parsed.data);
    });
    cb(items as T[]);
  });
}

export async function ensureUserDoc(uid: string, email: string, name?: string) {
  const ref = doc(getFirestore(), "users", uid);
  await setDoc(
    ref,
    {
      userId: uid,
      email,
      role: "ia",
      level: "State",
      assignedProjects: [],
      permissions: {
        canViewFinancials: true,
        canApproveProjects: false,
        canGenerateReports: true,
      },
      profile: {
        name: name || email,
        organization: "",
        contactDetails: {},
        createdAt: Date.now(),
      },
    },
    { merge: true },
  );
}

export async function addFundFlow(flow: FundFlow) {
  await addDoc(col.fund_flows, flow as any);
}

export async function addBudget(budget: Budget) {
  await addDoc(col.budgets, budget as any);
}

export async function addAlert(alert: Alert) {
  await addDoc(col.alerts, alert as any);
}
