import { db } from "@/lib/firebase";
import { collection, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import type {
  ImplementingAgency,
  ExecutingAgency,
  Project,
  Budget,
  UtilizationCertificate,
} from "@shared/pmajay";

export const cols = {
  ia: collection(db, "implementing_agencies"),
  ea: collection(db, "executing_agencies"),
  projects: collection(db, "projects"),
  budgets: collection(db, "budgets"),
  ucs: collection(db, "utilization_certificates"),
  villages: collection(db, "adarsh_gram_villages"),
  institutions: collection(db, "gia_institutions"),
  hostels: collection(db, "hostels"),
};

export async function createIA(data: ImplementingAgency) { return addDoc(cols.ia, data as any); }
export async function updateIA(id: string, data: Partial<ImplementingAgency>) { return updateDoc(doc(db, "implementing_agencies", id), data as any); }
export async function deleteIA(id: string) { return deleteDoc(doc(db, "implementing_agencies", id)); }

export async function createEA(data: ExecutingAgency) { return addDoc(cols.ea, data as any); }
export async function updateEA(id: string, data: Partial<ExecutingAgency>) { return updateDoc(doc(db, "executing_agencies", id), data as any); }
export async function deleteEA(id: string) { return deleteDoc(doc(db, "executing_agencies", id)); }

export async function createProject(data: Project) { return addDoc(cols.projects, data as any); }
export async function updateProject(id: string, data: Partial<Project>) { return updateDoc(doc(db, "projects", id), data as any); }
export async function deleteProject(id: string) { return deleteDoc(doc(db, "projects", id)); }

export async function createBudget(data: Budget) { return addDoc(cols.budgets, data as any); }
export async function updateBudget(id: string, data: Partial<Budget>) { return updateDoc(doc(db, "budgets", id), data as any); }
export async function deleteBudget(id: string) { return deleteDoc(doc(db, "budgets", id)); }

export async function createUC(data: UtilizationCertificate) { return addDoc(cols.ucs, data as any); }
export async function updateUC(id: string, data: Partial<UtilizationCertificate>) { return updateDoc(doc(db, "utilization_certificates", id), data as any); }
export async function deleteUC(id: string) { return deleteDoc(doc(db, "utilization_certificates", id)); }

// Component-specific CRUD
export async function createVillage(data: any) { return addDoc(cols.villages, data as any); }
export async function updateVillage(id: string, data: any) { return updateDoc(doc(db, "adarsh_gram_villages", id), data as any); }
export async function deleteVillage(id: string) { return deleteDoc(doc(db, "adarsh_gram_villages", id)); }

export async function createInstitution(data: any) { return addDoc(cols.institutions, data as any); }
export async function updateInstitution(id: string, data: any) { return updateDoc(doc(db, "gia_institutions", id), data as any); }
export async function deleteInstitution(id: string) { return deleteDoc(doc(db, "gia_institutions", id)); }

export async function createHostel(data: any) { return addDoc(cols.hostels, data as any); }
export async function updateHostel(id: string, data: any) { return updateDoc(doc(db, "hostels", id), data as any); }
export async function deleteHostel(id: string) { return deleteDoc(doc(db, "hostels", id)); }
