import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@shared/pmajay";

export default function RoleGuard({ allowed, children }: { allowed: Role[]; children: ReactNode }) {
  const { user, userDoc, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div className="container py-10">Loading...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;
  if (!userDoc) return <div className="container py-10">No user profile found.</div>;
  if (!allowed.includes(userDoc.role)) return <div className="container py-10">Access denied for role: {userDoc.role}</div>;
  return <>{children}</>;
}
