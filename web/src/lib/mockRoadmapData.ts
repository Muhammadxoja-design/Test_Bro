export interface RoadmapQuest {
  id: string;
  title: string;
  description: string;
}

export interface RoadmapItemData {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  difficulty: "Hard" | "Medium" | "Easy";
  effort: string;
  targetDate: string;
  
  // Deep breakdown
  whyItMatters: string;
  whatIsWeak: string;
  whatToDoNow: string;
  goodOutcome: string;
  quests: RoadmapQuest[];
}

export const generateMockRoadmap = (profileData: any): RoadmapItemData[] => {
  return [
    {
      id: "academics",
      category: "Academics",
      title: "Algorithmic Course Selection",
      description: "Audit your transcript for rigor density and ensure your trajectory aligns with tier-1 institutional expectations.",
      impact: "High",
      difficulty: "Hard",
      effort: "10-15 hrs/wk",
      targetDate: "End of Semester",
      whyItMatters: "Your transcript functions as the primary academic filter. Sub-optimal rigor density immediately flags an application as uncompetitive.",
      whatIsWeak: profileData?.gpa ? `Current GPA (${profileData.gpa}) indicates structural gaps in your academic portfolio.` : "Insufficient baseline metrics to calculate an accurate academic trajectory.",
      whatToDoNow: "Execute a rigorous syllabus audit. Identify 1-2 high-leverage AP/IB courses to integrate into your schedule immediately.",
      goodOutcome: "A verifiable upward trajectory in quantitative and major-aligned coursework, neutralizing academic red flags.",
      quests: [
        { id: "q_ac_1", title: "Syllabus Audit", description: "Cross-reference your current courses against the recommended rigor for Top-20 admits." },
        { id: "q_ac_2", title: "Establish Remediation Protocol", description: "Deploy a systematic study schedule for your highest-friction subjects." }
      ]
    },
    {
      id: "tests",
      category: "Tests",
      title: "Standardized Competency Verification",
      description: "Establish a mathematically sound testing baseline to clear the initial cognitive-ability filters.",
      impact: "High",
      difficulty: "Medium",
      effort: "5-8 hrs/wk",
      targetDate: "Next 2 Months",
      whyItMatters: "In a test-optional landscape, a 99th-percentile score acts as an asymmetric advantage, validating your regional grading scale.",
      whatIsWeak: profileData?.tests ? `Testing velocity (${profileData.tests}) suggests suboptimal pattern recognition strategies.` : "You lack a statistically significant baseline under proctored, high-stress conditions.",
      whatToDoNow: "Administer a strictly timed diagnostic. Perform a granular root-cause analysis on all deviations from the correct answer.",
      goodOutcome: "Consistent scoring in the 1500+ threshold, with variance minimized across testing modules.",
      quests: [
        { id: "q_t_1", title: "Proctored Diagnostic Execution", description: "Simulate test-day conditions to generate your initial quantitative baseline." },
        { id: "q_t_2", title: "Granular Error Analysis", description: "Log every failure point into a specialized matrix to identify knowledge gaps." },
        { id: "q_t_3", title: "Targeted Micro-Drills", description: "Execute 50-question sprints on identified high-frequency error nodes." }
      ]
    },
    {
      id: "essays",
      category: "Essays",
      title: "Strategic Narrative Architecture",
      description: "Structure your vulnerability moments into a 3-part arc. Avoid generic hero-stories.",
      impact: "High",
      difficulty: "Hard",
      effort: "3-5 hrs/wk",
      targetDate: "Next 4 Weeks",
      whyItMatters: "The qualitative components (essays) serve as the ultimate tie-breaker in highly compressed applicant pools.",
      whatIsWeak: "Most candidates rely on cliché narratives (e.g., sports injuries). Your current framework likely lacks structural tension and intellectual depth.",
      whatToDoNow: "Deconstruct your profile into 3 distinct micro-narratives. Focus on moments of cognitive dissonance and ideological shifts.",
      goodOutcome: "A highly differentiated, 'spiky' narrative that seamlessly integrates your background, intended major, and intellectual vitality.",
      quests: [
        { id: "q_e_1", title: "Values Distillation", description: "Isolate your top 3 core values and draft high-density paragraphs explaining their origins." },
        { id: "q_e_2", title: "The Vulnerability Draft", description: "Construct a 300-word analysis of a significant failure and your subsequent recalibration." },
        { id: "q_e_3", title: "Narrative Arc Synthesis", description: "Synthesize micro-narratives into a cohesive meta-story with your mentor." }
      ]
    },
    {
      id: "ecs",
      category: "Extracurriculars",
      title: "Asymmetric Leadership Scaling",
      description: "Cut low-signal activities. Focus on scaling your primary leadership role to a regional level.",
      impact: "Medium",
      difficulty: "Medium",
      effort: "8-10 hrs/wk",
      targetDate: "Ongoing",
      whyItMatters: "Admissions committees penalize 'well-roundedness'. They prioritize localized spikes of extreme competence and impact.",
      whatIsWeak: profileData?.ecs ? `Your activity matrix (${profileData.ecs}) exhibits high dispersion and low depth.` : "Your profile resembles a passive participant rather than an ecosystem architect.",
      whatToDoNow: "Liquidate the bottom 30% of your commitments. Reallocate that bandwidth to compounding your highest-leverage project.",
      goodOutcome: "Quantifiable, undeniable metrics of scale (e.g., $10k+ capital raised, state-level legislation impacted, published tier-1 research).",
      quests: [
        { id: "q_ec_1", title: "Activity Liquidation Audit", description: "Identify and gracefully exit your 2 lowest-signal extracurricular commitments." },
        { id: "q_ec_2", title: "Initiative Scaling Framework", description: "Draft a 3-month operational plan to 10x the impact of your primary project." }
      ]
    },
    {
      id: "positioning",
      category: "Positioning",
      title: "Strategic Archetype Alignment",
      description: "Formulate a highly differentiated applicant persona to dominate your specific admissions sub-category.",
      impact: "High",
      difficulty: "Hard",
      effort: "2 hrs/wk",
      targetDate: "Next 2 Weeks",
      whyItMatters: "Admissions readers allocate ~5 minutes per file. If your archetype isn't immediately recognizable, you become statistically invisible.",
      whatIsWeak: "Your current positioning is too broad. 'Smart, hard-working student' is an unviable strategy for elite admissions.",
      whatToDoNow: "Compress your entire 4-year high school trajectory into a 5-second 'Elevator Pitch'.",
      goodOutcome: "A razor-sharp, 3-word applicant persona (e.g., 'Computational Bio-Ethicist', 'Grassroots Policy Engineer').",
      quests: [
        { id: "q_p_1", title: "Archetype Generation", description: "Hypothesize 3 highly specialized personas derived from your core competencies." },
        { id: "q_p_2", title: "Cohesion Analysis", description: "Audit your essays and ECs to ensure they rigorously support your chosen archetype." }
      ]
    },
    {
      id: "networking",
      category: "Networking",
      title: "High-Value Mentorship Acquisition",
      description: "Deploy targeted outreach strategies to secure high-signal letters of recommendation and insider insights.",
      impact: "Medium",
      difficulty: "Medium",
      effort: "2-3 hrs/wk",
      targetDate: "Ongoing",
      whyItMatters: "Third-party validation from credible institutional figures can systematically de-risk your application.",
      whatIsWeak: "Over-reliance on standard classroom interactions yields generic, low-conviction recommendation letters.",
      whatToDoNow: "Identify 2 key faculty members. Initiate high-level academic discourse beyond the standardized curriculum parameters.",
      goodOutcome: "Exceptional letters of recommendation that explicitly validate your intellectual anomaly status and future potential.",
      quests: [
        { id: "q_n_1", title: "Strategic Office Hours", description: "Engage a targeted professor with an advanced inquiry relating to their specialized field." },
        { id: "q_n_2", title: "Alumni Network Infiltration", description: "Execute a cold-outreach campaign to secure a 15-minute intelligence-gathering interview." }
      ]
    }
  ];
};
