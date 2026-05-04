import { gsap } from "gsap";
import React from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { Button } from "./components/ui/button";
import { AuthProvider, useAuth } from "./lib/auth";
import { adminMe } from "./api";
import Admissions from "./routes/Admissions";
import AdminPanel from "./routes/AdminPanel";
import Dashboard from "./routes/Dashboard";
import Login from "./routes/Login";
import Profile from "./routes/Profile";
import Register from "./routes/Register";
import StudySat from "./routes/StudySat";
import AiChat from "./routes/AiChat";
import Universities from "./routes/Universities";
import UniversityDetail from "./routes/UniversityDetail";
import AdminLogin from "./routes/AdminLogin";
import SetUsername from "./routes/SetUsername";
import Onboarding from "./routes/Onboarding";
import ForgotPassword from "./routes/ForgotPassword";
import ResetPassword from "./routes/ResetPassword";
import AccountSettings from "./routes/AccountSettings";
import ContentFeed from "./routes/ContentFeed";
import Roadmap from "./routes/Roadmap";
import ParentDashboard from "./pages/ParentDashboard";
import LimitForm from "./components/forms/LimitForm";
import DashboardLayout from "./components/layout/DashboardLayout";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ToastProvider } from "./components/ui/ToastProvider";
import { useGoogleAnalytics } from "./lib/analytics";

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, preferences, loading } = useAuth();
  if (loading) {
    return <div className="p-10 text-muted-foreground">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!user.username) {
    return <Navigate to="/set-username" replace />;
  }
  const isOnboarding = window.location.pathname === "/onboarding";
  if (preferences && preferences.onboardingDone === 0 && !isOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

function AdminRoute({ children }: { children: React.ReactElement }) {
  const [adminOk, setAdminOk] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    adminMe()
      .then((data) => setAdminOk(data.admin))
      .catch(() => setAdminOk(false));
  }, []);

  if (adminOk === null)
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center color-[#6366f1] font-['Space Grotesk'] text-[18px]">
        Authenticating…
      </div>
    );
  if (!adminOk) return <Navigate to="/admin/login" replace />;
  return children;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const shellRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (!shellRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-shell='nav']", {
        y: -18,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
    }, shellRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={shellRef} className="relative min-h-screen transition-colors duration-500 bg-background">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 dark:opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.15), transparent 70%)" }}
        aria-hidden
      />
      <header className="sticky top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur" data-shell="nav">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">S</span>
            Sypev
          </Link>
          {user ? (
            <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
              <Link to="/dashboard" className="rounded-full px-3 py-1 hover:bg-primary/10 hover:text-primary">Dashboard</Link>
              <Link to="/parent/dashboard" className="rounded-full px-3 py-1 hover:bg-indigo-600/10 text-indigo-500 font-bold border border-indigo-500/20">Parent Portal</Link>
              <Link to="/study/sat" className="rounded-full px-3 py-1 hover:bg-primary/10 hover:text-primary">SAT Study</Link>
              <Link to="/admissions" className="rounded-full px-3 py-1 hover:bg-primary/10 hover:text-primary">Admissions</Link>
              <Link to="/roadmap" className="rounded-full px-3 py-1 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-indigo-500">Roadmap</Link>
              <Link to="/universities" className="rounded-full px-3 py-1 hover:bg-primary/10 hover:text-primary">Universities</Link>
              <Link to="/account" className="rounded-full px-3 py-1 hover:bg-primary/10 hover:text-primary">Account</Link>
              <Button variant="outline" size="sm" onClick={logout}>Log out</Button>
            </nav>
          ) : (
            <nav className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium hover:text-primary">Log in</Link>
              <Button asChild size="sm"><Link to="/register">Register</Link></Button>
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}

export default function App() {
  useGoogleAnalytics();
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/set-username" element={<SetUsername />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/study/sat" element={<ProtectedRoute><StudySat /></ProtectedRoute>} />
                <Route path="/admissions" element={<ProtectedRoute><Admissions /></ProtectedRoute>} />
                <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
                <Route path="/universities" element={<ProtectedRoute><Universities /></ProtectedRoute>} />
                <Route path="/universities/:id" element={<ProtectedRoute><UniversityDetail /></ProtectedRoute>} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/tutor" element={<ProtectedRoute><AiChat /></ProtectedRoute>} />
                <Route path="/feed" element={<ProtectedRoute><ContentFeed /></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
                
                {/* ── Parental Control Routes ── */}
                <Route path="/parent/dashboard" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
                <Route path="/limits" element={<ProtectedRoute><DashboardLayout><div className="flex justify-center items-center py-10"><LimitForm /></div></DashboardLayout></ProtectedRoute>} />
                
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}
