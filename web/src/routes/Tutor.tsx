import React from "react";
import { aiTutor, listUniversities } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function Tutor() {
  const [message, setMessage] = React.useState("");
  const [context, setContext] = React.useState<"SAT" | "Admissions">("SAT");
  const [loading, setLoading] = React.useState(false);
  const [history, setHistory] = React.useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [disclaimer, setDisclaimer] = React.useState("");
  const [universityId, setUniversityId] = React.useState<string | undefined>(undefined);
  const [universities, setUniversities] = React.useState<{ id: string; name: string }[]>([]);

  React.useEffect(() => {
    listUniversities({ limit: 50 })
      .then((data) => setUniversities(data.map((u) => ({ id: u.id, name: u.name }))))
      .catch(() => {});
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    const current = message;
    setHistory((prev) => [...prev, { role: "user", text: current }]);
    setMessage("");

    try {
      const res = await aiTutor({ message: current, context, university_id: universityId });
      setHistory((prev) => [...prev, { role: "assistant", text: res.reply }]);
      setDisclaimer(res.disclaimer);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">AI Tutor</h1>
        <p className="text-muted-foreground">Text-only guidance for SAT prep and admissions planning.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 text-sm">
            {history.length === 0 ? (
              <div className="text-muted-foreground">Ask a question to get started.</div>
            ) : (
              history.map((item, idx) => (
                <div key={idx} className={`rounded-md border p-3 ${item.role === "assistant" ? "bg-muted" : "bg-white"}`}>
                  <div className="text-xs uppercase text-muted-foreground">{item.role}</div>
                  <div>{item.text}</div>
                </div>
              ))
            )}
          </div>

          <form className="space-y-3" onSubmit={send}>
            <div className="flex flex-wrap gap-3">
              <Select value={context} onValueChange={(value) => setContext(value as "SAT" | "Admissions")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Context" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAT">SAT</SelectItem>
                  <SelectItem value="Admissions">Admissions</SelectItem>
                </SelectContent>
              </Select>
              <Select value={universityId ?? ""} onValueChange={(value) => setUniversityId(value || undefined)}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Attach a university (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No university</SelectItem>
                  {universities.map((uni) => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask a question..." required />
            <Button disabled={loading}>{loading ? "Thinking..." : "Send"}</Button>
          </form>

          <p className="text-xs text-muted-foreground">{disclaimer || "AI guidance only."}</p>
        </CardContent>
      </Card>
    </div>
  );
}
