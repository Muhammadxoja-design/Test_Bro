import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../lib/auth";
import Page from "../components/Page";

export default function Dashboard() {
  const { profile } = useAuth();

  return (
    <Page className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4" data-animate="fade">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Sypev roadmap</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Your SAT and admissions control room.
          </h1>
          <p className="text-muted-foreground">
            Track progress, get tailored recommendations, and move every week with clarity.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/profile">Update profile</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/study/sat">Open study plan</Link>
            </Button>
          </div>
        </div>
        <Card className="border border-white/60" data-animate="card">
          <CardHeader>
            <CardTitle>Snapshot</CardTitle>
            <CardDescription>Latest SAT subscores</CardDescription>
          </CardHeader>
          <CardContent>
            {profile?.satTotal ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                  <span>Math</span>
                  <span className="text-base font-semibold">{profile.satMath}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                  <span>Reading & Writing</span>
                  <span className="text-base font-semibold">{profile.satReadingWriting}</span>
                </div>
                <div className="rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-lg font-semibold">
                  Total: {profile.satTotal}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add a diagnostic score to unlock recommendations.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3" data-animate="card">
        <Card>
          <CardHeader>
            <CardTitle>SAT Study</CardTitle>
            <CardDescription>Personalized practice focus</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Choose topics and start a focused quiz session.</p>
            <Button asChild className="mt-4" variant="secondary">
              <Link to="/study/sat">Browse topics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admissions</CardTitle>
            <CardDescription>Safety, target, and reach list</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Generate recommendations based on your SAT total.</p>
            <Button asChild className="mt-4">
              <Link to="/admissions">View recommendations</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Tutor</CardTitle>
            <CardDescription>Guidance on prep and applications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Ask a question, get the next step.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/tutor">Open tutor</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <Card data-animate="card">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Move to your next step</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/study/sat">Browse SAT topics</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/universities">Explore universities</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/profile">Edit profile</Link>
          </Button>
        </CardContent>
      </Card>
    </Page>
  );
}
