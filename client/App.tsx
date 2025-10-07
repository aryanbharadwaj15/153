import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainLayout from "@/components/layout/MainLayout";
import { AuthProvider } from "@/context/AuthContext";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import Placeholder from "@/components/Placeholder";
import CentralDashboard from "@/pages/dashboard/Central";
import FinanceDashboard from "@/pages/finance/FinanceDashboard";
import FundFlowPage from "@/pages/finance/FundFlow";
import BudgetsPage from "@/pages/finance/Budgets";
import UCPage from "@/pages/finance/UC";
import RealTimeTracking from "@/pages/monitoring/RealTime";
import AlertsPage from "@/pages/monitoring/Alerts";
import IAPage from "@/pages/agencies/IA";
import EAPage from "@/pages/agencies/EA";
import ProjectsPage from "@/pages/projects/Projects";
import ProjectCreatePage from "@/pages/projects/Create";
import AdarshGramPage from "@/pages/AdarshGram";
import GIAPage from "@/pages/GIA";
import HostelsPage from "@/pages/Hostels";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Dashboards */}
              <Route path="/dashboard/central" element={<CentralDashboard />} />
              <Route path="/dashboard/state" element={<Placeholder title="State/UT Dashboard" />} />
              <Route path="/dashboard/ia" element={<Placeholder title="Implementing Agency (IA) Portal" />} />
              <Route path="/dashboard/ea" element={<Placeholder title="Executing Agency (EA) Interface" />} />
              <Route path="/dashboard/monitor" element={<Placeholder title="Monitoring Officer Dashboard" />} />

              {/* Agencies */}
              <Route path="/agencies/ia" element={<IAPage />} />
              <Route path="/agencies/ea" element={<EAPage />} />

              {/* Projects */}
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/create" element={<ProjectCreatePage />} />
              <Route path="/projects/:id" element={<Placeholder title="Project Details" />} />

              {/* Components */}
              <Route path="/adarsh-gram" element={<AdarshGramPage />} />
              <Route path="/gia" element={<GIAPage />} />
              <Route path="/hostels" element={<HostelsPage />} />

              {/* Finance */}
              <Route path="/finance/dashboard" element={<FinanceDashboard />} />
              <Route path="/finance/fund-flow" element={<FundFlowPage />} />
              <Route path="/finance/budgets" element={<BudgetsPage />} />
              <Route path="/finance/uc" element={<UCPage />} />

              {/* Monitoring & Reports */}
              <Route path="/monitoring/real-time" element={<RealTimeTracking />} />
              <Route path="/monitoring/alerts" element={<AlertsPage />} />
              <Route path="/reports" element={<Placeholder title="Report Generation" />} />
              <Route path="/analytics" element={<Placeholder title="Performance Analytics" />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
