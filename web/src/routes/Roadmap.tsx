import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "gsap";
import { ChevronRight, Target, Brain, Award, FileText, CheckCircle2, ChevronDown, Sparkles, Loader2, ArrowRight, Download, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Page from "../components/Page";
import { generateMockRoadmap, RoadmapItemData } from "../lib/mockRoadmapData";

type Step = "input" | "generating" | "roadmap";

const LOADER_TEXTS = [
  "Analyzing student profile...",
  "Extracting high-signal extracurriculars...",
  "Generating strategic roadmap..."
];

export default function Roadmap() {
  const [step, setStep] = useState<Step>("input");
  const [profileData, setProfileData] = useState({
    grade: "",
    targetCountry: "",
    targetUniversities: "",
    gpa: "",
    tests: "",
    ecs: "",
    major: "",
    essays: "",
    strengths: "",
  });
  const [roadmapData, setRoadmapData] = useState<RoadmapItemData[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [questStatus, setQuestStatus] = useState<Record<string, boolean>>({});
  const [loaderIdx, setLoaderIdx] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === "generating") {
      const interval = setInterval(() => {
        setLoaderIdx((prev) => (prev + 1) % LOADER_TEXTS.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stagger-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [step]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("generating");
    
    // Simulate AI generation time: 2.5 - 3 seconds
    setTimeout(() => {
      setRoadmapData(generateMockRoadmap(profileData));
      setStep("roadmap");
    }, 2800);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleQuest = (questId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuestStatus((prev) => ({ ...prev, [questId]: !prev[questId] }));
  };

  // Progress calculations
  const totalQuests = roadmapData.reduce((acc, item) => acc + item.quests.length, 0);
  const completedQuests = Object.values(questStatus).filter(Boolean).length;
  const progressPercentage = totalQuests === 0 ? 0 : Math.round((completedQuests / totalQuests) * 100);

  const renderInputForm = () => (
    <Card className="stagger-item mx-auto max-w-3xl overflow-hidden border-white/10 bg-[#0a0a0a]/80 shadow-2xl backdrop-blur-xl text-zinc-100">
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"></div>
      <CardHeader className="space-y-1 bg-white/5 pb-8 pt-8 text-center backdrop-blur-sm border-b border-white/5">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Target className="h-7 w-7" />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight text-white">Admissions Strategy</CardTitle>
        <CardDescription className="text-base text-zinc-400">
          Provide your baseline metrics. We'll generate a high-leverage architectural roadmap.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleGenerate} className="space-y-8">
          
          <div className="space-y-4 rounded-2xl bg-white/5 p-6 border border-white/10">
            <h3 className="flex items-center text-lg font-semibold text-white">
              <Brain className="mr-2 h-5 w-5 text-indigo-400" /> Core Profile
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="grade" className="text-zinc-300">Current Grade / Level</Label>
                <Select onValueChange={(val) => handleInputChange("grade", val)}>
                  <SelectTrigger className="bg-black/50 border-white/10 text-zinc-100 focus:ring-indigo-500">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-zinc-100">
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                    <SelectItem value="gap">Gap Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="major" className="text-zinc-300">Intended Major</Label>
                <Input id="major" placeholder="e.g. Computer Science, Business" className="bg-black/50 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500" value={profileData.major} onChange={(e) => handleInputChange("major", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetCountry" className="text-zinc-300">Target Country</Label>
                <Input id="targetCountry" placeholder="e.g. USA, UK, Canada" className="bg-black/50 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500" value={profileData.targetCountry} onChange={(e) => handleInputChange("targetCountry", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetUniversities" className="text-zinc-300">Target Universities</Label>
                <Input id="targetUniversities" placeholder="e.g. MIT, Stanford, Oxford" className="bg-black/50 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500" value={profileData.targetUniversities} onChange={(e) => handleInputChange("targetUniversities", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-white/5 p-6 border border-white/10">
             <h3 className="flex items-center text-lg font-semibold text-white">
              <Award className="mr-2 h-5 w-5 text-cyan-400" /> Academics & Scores
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gpa" className="text-zinc-300">Current GPA / Grades</Label>
                <Input id="gpa" placeholder="e.g. 3.8/4.0 or 4.5/5.0" className="bg-black/50 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500" value={profileData.gpa} onChange={(e) => handleInputChange("gpa", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tests" className="text-zinc-300">SAT / IELTS Status</Label>
                <Input id="tests" placeholder="e.g. SAT 1450, IELTS 7.5" className="bg-black/50 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500" value={profileData.tests} onChange={(e) => handleInputChange("tests", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-white/5 p-6 border border-white/10">
            <h3 className="flex items-center text-lg font-semibold text-white">
              <FileText className="mr-2 h-5 w-5 text-purple-400" /> Activities & Narrative
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ecs" className="text-zinc-300">Top Extracurriculars (Brief)</Label>
                <Textarea id="ecs" placeholder="Debate club president, coding projects..." className="bg-black/50 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500 min-h-[80px]" value={profileData.ecs} onChange={(e) => handleInputChange("ecs", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strengths" className="text-zinc-300">Current Strengths / Weaknesses</Label>
                <Textarea id="strengths" placeholder="Strong math skills, weak writing, not much leadership..." className="bg-black/50 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500 min-h-[80px]" value={profileData.strengths} onChange={(e) => handleInputChange("strengths", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="essays" className="text-zinc-300">Essays Status</Label>
                <Textarea id="essays" placeholder="Haven't started, have a draft, stuck on personal statement..." className="bg-black/50 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500 min-h-[80px]" value={profileData.essays} onChange={(e) => handleInputChange("essays", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all h-14 text-lg border border-indigo-400/30">
              <Sparkles className="mr-2 h-5 w-5" /> Generate Actionable Roadmap
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderGenerating = () => (
    <div className="stagger-item flex min-h-[60vh] flex-col items-center justify-center space-y-8 text-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-32 w-32 animate-ping rounded-full bg-indigo-500/10"></div>
        <div className="absolute h-24 w-24 animate-pulse rounded-full bg-purple-500/20"></div>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-white/10 text-indigo-400 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-white">Synthesizing Strategy</h2>
        <p className="text-indigo-400 font-mono text-sm tracking-widest animate-pulse h-6">
          {LOADER_TEXTS[loaderIdx]}
        </p>
      </div>
    </div>
  );

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Hard": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Medium": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Easy": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-zinc-800 text-zinc-400 border-white/10";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "Medium": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Low": return "bg-zinc-800 text-zinc-400 border-white/10";
      default: return "bg-zinc-800 text-zinc-400 border-white/10";
    }
  };

  const renderRoadmap = () => (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="stagger-item text-center space-y-4 mb-8">
        <Badge variant="outline" className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-mono">
          <Sparkles className="mr-1 h-3 w-3 inline" /> STRATEGY_GENERATED
        </Badge>
        <h2 className="text-4xl font-bold tracking-tight text-white">Architectural Roadmap</h2>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          We've broken down your trajectory into high-leverage nodes. Expand any component to view the execution protocol.
        </p>
      </div>

      {/* Progress Tracker */}
      <div className="stagger-item sticky top-20 z-30 mb-12 p-4 rounded-xl bg-zinc-900/80 backdrop-blur border border-white/10 shadow-2xl">
        <div className="flex justify-between items-end mb-2">
          <div className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Overall Execution</div>
          <div className="text-xl font-bold text-white">{progressPercentage}%</div>
        </div>
        <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-purple-500/30 before:to-transparent">
        {roadmapData.map((item, index) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} className="stagger-item relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              
              {/* Timeline Marker */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#050505] bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                <span className="text-sm font-bold font-mono">{index + 1}</span>
              </div>

              {/* Card Content */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-16 md:ml-0 p-4">
                <Card 
                  className={`border border-white/10 bg-zinc-900/60 shadow-xl backdrop-blur-md transition-all duration-300 cursor-pointer ${isExpanded ? 'ring-1 ring-indigo-500/50 bg-zinc-900/90' : 'hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] hover:border-white/20'}`}
                  onClick={() => toggleExpand(item.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="font-semibold text-indigo-300 bg-indigo-500/10 border-indigo-500/20">{item.category}</Badge>
                      <span className="text-xs font-mono text-zinc-500 flex items-center"><Target className="w-3 h-3 mr-1" /> {item.targetDate}</span>
                    </div>
                    <CardTitle className="text-xl font-bold text-white">{item.title}</CardTitle>
                    <CardDescription className="text-sm text-zinc-400 mt-2 line-clamp-2">{item.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getImpactColor(item.impact)}>Impact: {item.impact}</Badge>
                      <Badge className={getDifficultyColor(item.difficulty)}>Difficulty: {item.difficulty}</Badge>
                      <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">{item.effort}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                      {isExpanded ? 'Hide analytical breakdown' : 'Show analytical breakdown'}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Expandable Breakdown */}
                    <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden space-y-6">
                        
                        <div className="space-y-4 border-t border-white/10 pt-6">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Why this matters</h4>
                            <p className="text-zinc-300 text-sm leading-relaxed">{item.whyItMatters}</p>
                          </div>
                          <div className="bg-red-500/5 border-l-2 border-red-500/50 pl-4 py-2 rounded-r">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">What is currently weak</h4>
                            <p className="text-red-200/80 text-sm">{item.whatIsWeak}</p>
                          </div>
                          <div className="bg-emerald-500/5 border-l-2 border-emerald-500/50 pl-4 py-2 rounded-r">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">What good outcome looks like</h4>
                            <p className="text-emerald-200/80 text-sm">{item.goodOutcome}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center">
                            <ArrowRight className="w-4 h-4 mr-1"/> Actionable Quests
                          </h4>
                          <div className="space-y-3">
                            {item.quests.map((quest) => {
                              const isCompleted = questStatus[quest.id];
                              return (
                                <div 
                                  key={quest.id} 
                                  onClick={(e) => toggleQuest(quest.id, e)}
                                  className={`group/quest flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-300 ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-black/30 border-white/10 hover:bg-black/50 hover:border-indigo-500/50 hover:shadow-sm'}`}
                                >
                                  <CheckCircle2 className={`w-5 h-5 mr-3 mt-0.5 transition-colors duration-300 ${isCompleted ? 'text-emerald-400' : 'text-zinc-600 group-hover/quest:text-indigo-400'}`} />
                                  <div>
                                    <div className={`font-semibold text-sm transition-all duration-300 ${isCompleted ? 'text-emerald-300 line-through opacity-70' : 'text-zinc-200'}`}>{quest.title}</div>
                                    <div className={`text-xs mt-1 transition-all duration-300 ${isCompleted ? 'text-emerald-400/50' : 'text-zinc-400'}`}>{quest.description}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>

                  </CardContent>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Ghost Features Action Bar */}
      <div className="stagger-item flex flex-wrap justify-center gap-4 pt-12 pb-4">
        <div className="group relative">
          <Button disabled variant="outline" className="border-white/10 text-zinc-500 bg-black/50 cursor-not-allowed">
            <Download className="w-4 h-4 mr-2" /> Export to PDF
          </Button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-3 py-1.5 bg-indigo-600 text-xs rounded text-white whitespace-nowrap shadow-xl">
            Unlocks in Premium
          </div>
        </div>
        <div className="group relative">
          <Button disabled variant="outline" className="border-white/10 text-zinc-500 bg-black/50 cursor-not-allowed">
            <Share2 className="w-4 h-4 mr-2" /> Share with Mentor
          </Button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-3 py-1.5 bg-indigo-600 text-xs rounded text-white whitespace-nowrap shadow-xl">
            Unlocks in Phase 2
          </div>
        </div>
      </div>

      <div className="stagger-item text-center pt-4">
        <Button variant="ghost" onClick={() => setStep("input")} className="text-zinc-400 hover:text-white hover:bg-white/5">
          Reset Strategy
        </Button>
      </div>
    </div>
  );

  return (
    <Page className="py-6 pb-20 bg-[#050505] min-h-screen">
      <div ref={containerRef} className="dark">
        {step === "input" && renderInputForm()}
        {step === "generating" && renderGenerating()}
        {step === "roadmap" && renderRoadmap()}
      </div>
    </Page>
  );
}
