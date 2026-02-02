import React from "react";
import { Link } from "react-router-dom";
import { listUniversities } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Universities() {
  const [search, setSearch] = React.useState("");
  const [state, setState] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [universities, setUniversities] = React.useState<any[]>([]);

  const fetchList = React.useCallback(() => {
    setLoading(true);
    listUniversities({ search: search || undefined, state: state || undefined })
      .then(setUniversities)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, state]);

  React.useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Universities</h1>
        <p className="text-muted-foreground">Search and explore US universities.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row">
          <Input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Input placeholder="State (e.g. CA)" value={state} onChange={(e) => setState(e.target.value.toUpperCase())} />
          <Button onClick={fetchList}>Apply</Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-muted-foreground">Loading universities...</div>
      ) : universities.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">No universities found.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {universities.map((uni) => (
            <Card key={uni.id}>
              <CardHeader>
                <CardTitle>{uni.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{uni.state} ? SAT {uni.satRangeMin ?? "N/A"}-{uni.satRangeMax ?? "N/A"}</p>
                <Button asChild className="mt-4" variant="secondary">
                  <Link to={`/universities/${uni.id}`}>View details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
