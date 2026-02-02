import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Dashboard from "./routes/Dashboard";
import Profile from "./routes/Profile";
import StudySat from "./routes/StudySat";
import Admissions from "./routes/Admissions";
import UniversityDetail from "./routes/UniversityDetail";
import Tutor from "./routes/Tutor";
import Universities from "./routes/Universities";
import { Button } from "./components/ui/button";

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="p-10 text-muted-foreground">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="text-xl font-semibold tracking-tight">
            Sypev
          </Link>
          {user ? (
            <nav className="flex items-center gap-4 text-sm">
              <Link to="/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
              <Link to="/study/sat" className="hover:text-primary">
                SAT Study
              </Link>
              <Link to="/admissions" className="hover:text-primary">
                Admissions
              </Link>
              <Link to="/universities" className="hover:text-primary">
                Universities
              </Link>
              <Link to="/tutor" className="hover:text-primary">
                AI Tutor
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Log out
              </Button>
            </nav>
          ) : (
            <nav className="flex items-center gap-3">
              <Link to="/login" className="text-sm hover:text-primary">
                Log in
              </Link>
              <Link to="/register" className="text-sm hover:text-primary">
                Register
              </Link>
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study/sat"
            element={
              <ProtectedRoute>
                <StudySat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissions"
            element={
              <ProtectedRoute>
                <Admissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/universities"
            element={
              <ProtectedRoute>
                <Universities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/universities/:id"
            element={
              <ProtectedRoute>
                <UniversityDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor"
            element={
              <ProtectedRoute>
                <Tutor />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}
