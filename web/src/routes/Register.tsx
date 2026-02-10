import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { useAuth } from "../lib/auth";
import Page from "../components/Page";

export default function Register() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ email, password, name: name || undefined });
      await refresh();
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-4" data-animate="fade">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Get started</p>
        <h1 className="text-4xl font-semibold leading-tight">Create your Sypev account.</h1>
        <p className="text-muted-foreground">
          Build a personalized SAT plan and map the universities that fit your goals.
        </p>
      </div>
      <Card className="w-full max-w-md justify-self-center" data-animate="card">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Start tracking SAT prep and US admissions today.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Already registered?{" "}
              <Link className="text-primary" to="/login">
                Log in
              </Link>
              .
            </p>
          </form>
        </CardContent>
      </Card>
    </Page>
  );
}
