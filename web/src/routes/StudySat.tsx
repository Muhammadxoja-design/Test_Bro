import React from "react";
import { getSatTopics } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function StudySat() {
  const [topics, setTopics] = React.useState<{ id: string; name: string; description: string | null }[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getSatTopics()
      .then(setTopics)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">SAT Study</h1>
      {loading ? (
        <div className="text-muted-foreground">Loading topics...</div>
      ) : topics.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No topics yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Topics will appear here once the question bank is added.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((topic) => (
            <Card key={topic.id}>
              <CardHeader>
                <CardTitle>{topic.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{topic.description || "No description yet."}</p>
                <Button className="mt-4" variant="secondary">
                  Start quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
