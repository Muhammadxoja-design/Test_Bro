import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { useAuth } from "../lib/auth";
import Page from "../components/Page";

export default function Login() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      await refresh();
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-4" data-animate="fade">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Welcome back</p>
        <h1 className="text-4xl font-semibold leading-tight">Log in and keep your plan on track.</h1>
        <p className="text-muted-foreground">
          Access your dashboard, SAT study plan, and the admissions shortlist in one place.
        </p>
      </div>
      <Card className="w-full max-w-md justify-self-center" data-animate="card">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use your email and password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
            <p className="text-sm text-muted-foreground">
              New here?{" "}
              <Link className="text-primary" to="/register">
                Create an account
              </Link>
              .
            </p>
          </form>
        </CardContent>
      </Card>
    </Page>
  );
}
