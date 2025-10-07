import { z } from "zod";

export type Role = "central" | "state" | "ia" | "ea" | "district" | "monitor";
export type Level = "MoSJE" | "State" | "District" | "Local";

export const PermissionsSchema = z.object({
  canViewFinancials: z.boolean().default(false),
  canApproveProjects: z.boolean().default(false),
  canGenerateReports: z.boolean().default(false),
});
export type Permissions = z.infer<typeof PermissionsSchema>;

export const UserProfileSchema = z.object({
  name: z.string().min(1),
  organization: z.string().optional().default(""),
  contactDetails: z.record(z.any()).optional().default({}),
  createdAt: z.number(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UserDocSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  role: z.custom<Role>(),
  level: z.custom<Level>(),
  assignedProjects: z.array(z.string()).default([]),
  permissions: PermissionsSchema,
  profile: UserProfileSchema,
});
export type UserDoc = z.infer<typeof UserDocSchema>;

export const FundFlowSchema = z.object({
  flowId: z.string(),
  projectId: z.string(),
  fromEntity: z.union([
    z.literal("MoSJE"),
    z.literal("State"),
    z.literal("IA"),
  ]),
  toEntity: z.union([z.literal("State"), z.literal("IA"), z.literal("EA")]),
  amount: z.number(),
  transferDate: z.number(),
  pfmsReferenceId: z.string(),
  purpose: z.union([
    z.literal("project-funding"),
    z.literal("operational"),
    z.literal("emergency"),
  ]),
  status: z.union([
    z.literal("initiated"),
    z.literal("in_transit"),
    z.literal("completed"),
    z.literal("failed"),
  ]),
  reconciliationStatus: z.union([
    z.literal("pending"),
    z.literal("matched"),
    z.literal("discrepancy"),
  ]),
  supportingDocuments: z.array(z.string()).default([]),
});
export type FundFlow = z.infer<typeof FundFlowSchema>;

export const BudgetSchema = z.object({
  budgetId: z.string(),
  fiscalYear: z.string(),
  component: z.union([
    z.literal("adarsh_gram"),
    z.literal("gia"),
    z.literal("hostel"),
  ]),
  stateUT: z.string(),
  allocations: z.object({
    totalAllocated: z.number(),
    revisedEstimate: z.number().default(0),
    utilized: z.number().default(0),
    committed: z.number().default(0),
    available: z.number().default(0),
  }),
  breakdown: z.object({
    centralShare: z.number().default(0),
    stateShare: z.number().default(0),
    administrativeExpenses: z.number().default(0),
    directBeneficiary: z.number().default(0),
  }),
  utilizationRate: z.number().default(0),
  lastUpdated: z.number(),
});
export type Budget = z.infer<typeof BudgetSchema>;

export const AlertSchema = z.object({
  alertId: z.string(),
  alertType: z.union([
    z.literal("milestone_delay"),
    z.literal("budget_overrun"),
    z.literal("uc_pending"),
    z.literal("quality_issue"),
  ]),
  severity: z.union([
    z.literal("low"),
    z.literal("medium"),
    z.literal("high"),
    z.literal("critical"),
  ]),
  projectId: z.string(),
  triggeredBy: z.union([z.literal("system"), z.literal("user")]),
  alertDetails: z.object({
    message: z.string(),
    threshold: z.union([z.string(), z.number()]).optional(),
    currentValue: z.union([z.string(), z.number()]).optional(),
    affectedEntity: z.string().optional(),
  }),
  recipients: z.array(z.string()).default([]),
  status: z.union([
    z.literal("active"),
    z.literal("acknowledged"),
    z.literal("resolved"),
  ]),
  createdAt: z.number(),
  resolvedAt: z.number().optional(),
});
export type Alert = z.infer<typeof AlertSchema>;

export const GeoUpdateSchema = z.object({
  updateId: z.string(),
  updatedBy: z.string(),
  updateType: z.union([
    z.literal("milestone"),
    z.literal("inspection"),
    z.literal("issue"),
  ]),
  description: z.string(),
  mediaFiles: z.array(
    z.object({
      type: z.union([z.literal("photo"), z.literal("video"), z.literal("document")]),
      url: z.string(),
      geoTagged: z.boolean().default(true),
      timestamp: z.number(),
    }),
  ),
  timestamp: z.number(),
});

export const GeoTrackingSchema = z.object({
  trackingId: z.string(),
  projectId: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number().optional(),
    address: z.string().optional(),
  }),
  progressUpdates: z.array(GeoUpdateSchema).default([]),
  verificationStatus: z.union([
    z.literal("unverified"),
    z.literal("verified"),
    z.literal("disputed"),
  ]),
  lastVerified: z.number().optional(),
});
export type GeoTracking = z.infer<typeof GeoTrackingSchema>;

// Implementing Agency (IA)
export const ImplementingAgencySchema = z.object({
  iaId: z.string(),
  registrationNumber: z.string(),
  organizationName: z.string(),
  legalStatus: z.union([z.literal("Government"), z.literal("Corporation"), z.literal("NGO")]),
  contactDetails: z.object({
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    officialWebsite: z.string().optional(),
  }).default({}),
  operationalCapacity: z.object({
    totalProjects: z.number().default(0),
    activeProjects: z.number().default(0),
    completedProjects: z.number().default(0),
    avgCompletionTime: z.union([z.string(), z.number()]).optional(),
  }).default({ totalProjects: 0, activeProjects: 0, completedProjects: 0 }),
  performanceMetrics: z.object({
    onTimeDeliveryRate: z.union([z.string(), z.number()]).optional(),
    budgetAdherenceRate: z.union([z.string(), z.number()]).optional(),
    qualityScore: z.union([z.string(), z.number()]).optional(),
    lastAuditScore: z.union([z.string(), z.number()]).optional(),
  }).default({}),
  assignedComponents: z.array(z.union([z.literal("adarsh_gram"), z.literal("gia"), z.literal("hostel")])).default([]),
  stateUT: z.string(),
  districts: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  createdAt: z.number(),
  lastUpdated: z.number().optional(),
});
export type ImplementingAgency = z.infer<typeof ImplementingAgencySchema>;

// Executing Agency (EA)
export const ExecutingAgencySchema = z.object({
  eaId: z.string(),
  contractorName: z.string(),
  contractorType: z.union([z.literal("Construction"), z.literal("Service"), z.literal("Technical")]),
  licenseNumber: z.string().optional(),
  parentIA: z.string().optional(),
  contactDetails: z.object({ address: z.string().optional(), phone: z.string().optional(), email: z.string().optional() }).default({}),
  specialization: z.array(z.string()).default([]),
  workOrders: z.array(z.any()).default([]),
  performanceHistory: z.object({ completedWorks: z.number().default(0), avgQualityRating: z.union([z.string(), z.number()]).optional(), timelinessScore: z.union([z.string(), z.number()]).optional() }).default({ completedWorks: 0 }),
  geoLocation: z.object({ latitude: z.union([z.string(), z.number()]).optional(), longitude: z.union([z.string(), z.number()]).optional(), operatingRadius: z.union([z.string(), z.number()]).optional() }).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.number(),
});
export type ExecutingAgency = z.infer<typeof ExecutingAgencySchema>;

// Projects
export const ProjectSchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  component: z.union([z.literal("adarsh_gram"), z.literal("gia"), z.literal("hostel")]),
  projectType: z.union([z.literal("infrastructure"), z.literal("service"), z.literal("construction")]),
  stateUT: z.string(),
  district: z.string(),
  stakeholders: z.object({
    assignedIA: z.string().optional(),
    assignedEAs: z.array(z.string()).default([]),
    monitoringOfficer: z.string().optional(),
    approvalAuthority: z.string().optional(),
  }),
  financials: z.object({
    totalBudget: z.number().default(0),
    centralShare: z.number().default(0),
    stateShare: z.number().default(0),
  }),
  timeline: z.object({
    projectStartDate: z.number().optional(),
    expectedCompletionDate: z.number().optional(),
    actualCompletionDate: z.number().optional(),
    currentPhase: z.union([z.literal("planning"), z.literal("execution"), z.literal("completion"), z.literal("maintenance")]).optional(),
  }).default({}),
  status: z.union([z.literal("proposed"), z.literal("approved"), z.literal("in_progress"), z.literal("completed"), z.literal("suspended")]).default("proposed"),
  createdAt: z.number(),
  lastUpdated: z.number().optional(),
});
export type Project = z.infer<typeof ProjectSchema>;

// Utilization Certificates (top-level collection)
export const UtilizationCertificateSchema = z.object({
  ucId: z.string(),
  projectId: z.string(),
  submittedBy: z.string(),
  period: z.union([z.literal("quarterly"), z.literal("annual")]),
  amount: z.number(),
  submissionDate: z.number(),
  status: z.union([z.literal("pending"), z.literal("approved"), z.literal("rejected")]).default("pending"),
  documents: z.array(z.string()).default([]),
});
export type UtilizationCertificate = z.infer<typeof UtilizationCertificateSchema>;
