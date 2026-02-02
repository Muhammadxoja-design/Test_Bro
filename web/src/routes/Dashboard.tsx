import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../lib/auth";

export default function Dashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Track SAT progress and your US admissions plan.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>SAT Snapshot</CardTitle>
            <CardDescription>Your latest SAT subscores</CardDescription>
          </CardHeader>
          <CardContent>
            {profile?.satTotal ? (
              <div className="space-y-2 text-sm">
                <div>Math: {profile.satMath}</div>
                <div>Reading & Writing: {profile.satReadingWriting}</div>
                <div className="text-lg font-semibold">Total: {profile.satTotal}</div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Add a diagnostic score to unlock recommendations.</p>
            )}
            <Button asChild className="mt-4" variant="secondary">
              <Link to="/profile">Update profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admissions</CardTitle>
            <CardDescription>See safety, target, and reach schools</CardDescription>
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
            <CardDescription>Text-only guidance for SAT and admissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Ask questions and get structured guidance.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/tutor">Open tutor</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
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
    </div>
  );
}
