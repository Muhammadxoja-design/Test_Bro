import React from "react";
import { useParams } from "react-router-dom";
import { addFact, getUniversity } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";

export default function UniversityDetail() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [university, setUniversity] = React.useState<any | null>(null);
  const [factText, setFactText] = React.useState("");
  const [sourceUrl, setSourceUrl] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [year, setYear] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const fetchUniversity = React.useCallback(() => {
    if (!id) return;
    setLoading(true);
    getUniversity(id)
      .then(setUniversity)
      .catch(() => setUniversity(null))
      .finally(() => setLoading(false));
  }, [id]);

  React.useEffect(() => {
    fetchUniversity();
  }, [fetchUniversity]);

  const submitFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await addFact(id, {
        fact_text: factText,
        source_url: sourceUrl,
        tag: tag || undefined,
        year: year ? Number(year) : undefined
      });
      setFactText("");
      setSourceUrl("");
      setTag("");
      setYear("");
      fetchUniversity();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading university...</div>;
  }

  if (!university) {
    return <div className="text-muted-foreground">University not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">{university.name}</h1>
        <p className="text-muted-foreground">{university.state} ? SAT {university.satRangeMin ?? "N/A"}-{university.satRangeMax ?? "N/A"}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{university.description || "No description yet."}</p>
          <div>Tuition: {university.tuitionUsd ? `$${university.tuitionUsd}` : "N/A"}</div>
          <div>Aid policy: {university.aidPolicy || "N/A"}</div>
          <div>English requirement: {university.englishReq || "N/A"}</div>
          <div>Application deadline: {university.applicationDeadline || "N/A"}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Did you know?</CardTitle>
        </CardHeader>
        <CardContent>
          {university.facts?.length ? (
            <div className="space-y-3">
              {university.facts
                .filter((fact: any) => fact.sourceUrl)
                .map((fact: any) => (
                  <div key={fact.id} className="rounded-md border p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      {fact.tag && <Badge variant="outline">{fact.tag}</Badge>}
                      {fact.year && <Badge variant="outline">{fact.year}</Badge>}
                    </div>
                    <p className="mt-2">{fact.factText}</p>
                    <a className="mt-2 inline-block text-xs text-primary underline" href={fact.sourceUrl} target="_blank" rel="noreferrer">
                      Source
                    </a>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No facts yet. Add one below.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add a fact</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submitFact}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fact text</label>
              <Textarea value={factText} onChange={(e) => setFactText(e.target.value)} maxLength={280} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Source URL</label>
              <Input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tag</label>
                <Input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="ED, RD, Policy" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" />
              </div>
            </div>
            <Button disabled={saving}>{saving ? "Saving..." : "Add fact"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
