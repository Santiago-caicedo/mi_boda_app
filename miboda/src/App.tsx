import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OnboardingRoute } from "@/components/auth/OnboardingRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Budget from "./pages/Budget";
import Tasks from "./pages/Tasks";
import Providers from "./pages/Providers";
import MyDay from "./pages/MyDay";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <OnboardingRoute>
                    <AppLayout>
                      <Index />
                    </AppLayout>
                  </OnboardingRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/presupuesto"
              element={
                <ProtectedRoute>
                  <OnboardingRoute>
                    <AppLayout>
                      <Budget />
                    </AppLayout>
                  </OnboardingRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tareas"
              element={
                <ProtectedRoute>
                  <OnboardingRoute>
                    <AppLayout>
                      <Tasks />
                    </AppLayout>
                  </OnboardingRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/proveedores"
              element={
                <ProtectedRoute>
                  <OnboardingRoute>
                    <AppLayout>
                      <Providers />
                    </AppLayout>
                  </OnboardingRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mi-dia"
              element={
                <ProtectedRoute>
                  <OnboardingRoute>
                    <AppLayout>
                      <MyDay />
                    </AppLayout>
                  </OnboardingRoute>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;