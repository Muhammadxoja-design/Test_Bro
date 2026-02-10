import React from "react";
import { getSatTopics } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Page from "../components/Page";

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
    <Page className="space-y-8">
      <div className="space-y-2" data-animate="fade">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">SAT prep</p>
        <h1 className="text-4xl font-semibold">Choose a focus area.</h1>
        <p className="text-muted-foreground">Practice the topics that move your score fastest.</p>
      </div>
      {loading ? (
        <div className="text-muted-foreground">Loading topics...</div>
      ) : topics.length === 0 ? (
        <Card data-animate="card">
          <CardHeader>
            <CardTitle>No topics yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Topics will appear here once the question bank is added.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {topics.map((topic) => (
            <Card key={topic.id} data-animate="card">
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
    </Page>
  );
}
