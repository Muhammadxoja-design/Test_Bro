import React from "react";
import { admissionsRecommend } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function Admissions() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{
    safety: any[];
    target: any[];
    reach: any[];
    disclaimer: string;
    message?: string;
  } | null>(null);

  React.useEffect(() => {
    admissionsRecommend()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-muted-foreground">Loading recommendations...</div>;
  }

  if (!data) {
    return <div className="text-muted-foreground">Unable to load recommendations.</div>;
  }

  if (data.message) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admissions recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{data.message}</p>
          <p className="mt-3 text-xs text-muted-foreground">{data.disclaimer}</p>
        </CardContent>
      </Card>
    );
  }

  const renderList = (label: string, items: any[]) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {label}
          <Badge variant="outline">{items.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No schools in this tier yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {items.map((uni) => (
              <li key={uni.id} className="rounded-md border p-3">
                <div className="font-medium">{uni.name}</div>
                <div className="text-xs text-muted-foreground">SAT range: {uni.satRangeMin ?? "N/A"}-{uni.satRangeMax ?? "N/A"}</div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Admissions recommendations</h1>
        <p className="text-muted-foreground">Safety, target, and reach schools based on your SAT total.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {renderList("Safety", data.safety)}
        {renderList("Target", data.target)}
        {renderList("Reach", data.reach)}
      </div>
      <p className="text-xs text-muted-foreground">{data.disclaimer}</p>
    </div>
  );
}
