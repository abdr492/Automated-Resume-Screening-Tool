import { useState, useMemo, useEffect } from "react";
import { Plus, Search, FileText, Filter, MoreHorizontal, Sparkles, AlertCircle, CheckCircle2, UserCheck, ShieldCheck, Briefcase, ChevronRight, Eye, Users, Calendar, Settings, BrainCircuit, RefreshCw, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StatsCard";
import CandidateModal from "./components/CandidateModal";
import ScoreDistributionChart from "./components/ScoreDistributionChart";
import { Job, Candidate, ScreeningResult, AuditLog } from "./types";
import { screenCandidate } from "./services/aiService";
import { cn } from "./lib/utils";
import { getAIInsights, AIInsight } from "./services/geminiService";

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', timestamp: '2024-03-25T14:30:00Z', userId: 'admin@resuscan.ai', action: 'AI SCREEN', details: 'Candidate Alex Rivera matched against Senior React Developer' },
  { id: 'l2', timestamp: '2024-03-25T14:35:00Z', userId: 'admin@resuscan.ai', action: 'STATUS CHANGE', details: 'Alex Rivera status updated to Shortlisted manually' },
];

const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior React Developer",
    department: "Engineering",
    description: "Looking for an expert-level React developer with 5+ years of experience in modern frontend architecture, performance optimization, and TypeScript. Experience with Framer Motion and Tailwind is a plus.",
    requirements: ["React 18+", "TypeScript", "Tailwind CSS", "Testing Library", "System Design"],
    createdAt: "2024-03-20"
  },
  {
    id: "job-2",
    title: "AI Product Manager",
    department: "Product",
    description: "Shape the future of AI-driven tools. Requires strong intuition for user experience and deep understanding of LLM capabilities. Must have experience with product lifecycle management.",
    requirements: ["Product Management", "AI/ML Basics", "Strategic Thinking", "Communication"],
    createdAt: "2024-03-18"
  },
  {
    id: "job-3",
    title: "Backend Systems Architect",
    department: "Core Engineering",
    description: "Design and implement scalable distributed systems using Go, Node.js, and PostgreSQL. Focus on reliability and low-latency performance.",
    requirements: ["Go/Node.js", "PostgreSQL", "Kafka", "Cloud Infrastructure"],
    createdAt: "2024-03-22"
  },
  {
    id: "job-4",
    title: "UX Design Lead",
    department: "Design",
    description: "Lead the design of complex enterprise dashboards. Deep understanding of accessibility and high-fidelity prototyping required.",
    requirements: ["Figma", "Design Systems", "Prototyping", "User Research"],
    createdAt: "2024-03-15"
  },
  {
    id: "job-5",
    title: "Lead Cybersecurity Analyst",
    department: "Security",
    description: "Orchestrate threat detection and incident response protocols. Experience with SIEM, penetration testing, and zero-trust architectures is paramount.",
    requirements: ["SIEM", "Penetration Testing", "Security Auditing", "Compliance"],
    createdAt: "2024-04-01"
  },
  {
    id: "job-6",
    title: "Senior DevOps Engineer",
    department: "Infrastructure",
    description: "Automate and scale our global cloud infrastructure. Deep expertise in Kubernetes, Terraform, and GitOps workflows required.",
    requirements: ["Kubernetes", "Terraform", "CI/CD", "AWS/Azure"],
    createdAt: "2024-04-02"
  },
  {
    id: "job-7",
    title: "AI Research Scientist",
    department: "Intelligence",
    description: "Drive innovations in natural language processing and multimodal models. Publication record in NeurIPS/ICML preferred.",
    requirements: ["PyTorch/TensorFlow", "NLP", "Mathematics", "Python"],
    createdAt: "2024-04-03"
  },
  {
    id: "job-8",
    title: "Mobile App Architect",
    department: "Product",
    description: "Define the technical direction for our cross-platform mobile ecosystem. Expert in Flutter or React Native performance optimization.",
    requirements: ["Flutter", "React Native", "Native iOS/Android", "Mobile Security"],
    createdAt: "2024-04-04"
  },
  {
    id: "job-9",
    title: "FinTech Compliance Lead",
    department: "Legal & Ethics",
    description: "Ensure our financial products meet global regulatory standards. Experience with KYC/AML systems and open banking APIs.",
    requirements: ["Regulatory Compliance", "Risk Assessment", "Financial Law", "Data Privacy"],
    createdAt: "2024-04-05"
  },
  {
    id: "job-10",
    title: "SRE Reliability Specialist",
    department: "Core Engineering",
    description: "Improve system availability and observability across microservices. Focus on error budgeting and incident post-mortems.",
    requirements: ["Prometheus/Grafana", "Linux Internals", "Scripting", "SLIs/SLOs"],
    createdAt: "2024-04-06"
  },
  {
    id: "job-11",
    title: "Growth Marketing Manager",
    department: "Growth",
    description: "Scale our user acquisition channels through data-driven campaigns. Expert in A/B testing and marketing attribution modeling.",
    requirements: ["Data Analytics", "Paid Media", "SEO/SEM", "Content Strategy"],
    createdAt: "2024-04-07"
  },
  {
    id: "job-12",
    title: "Blockchain Protocol Dev",
    department: "Strategic Labs",
    description: "Build secure and efficient smart contracts for our decentralized finance initiative. Deep understanding of EVM and Vyper/Solidity.",
    requirements: ["Solidity", "Cryptography", "Distributed Ledgers", "Smart Contracts"],
    createdAt: "2024-04-08"
  },
  {
    id: "job-13",
    title: "Customer Experience Director",
    department: "Operations",
    description: "Transform our user support into a proactive success engine. Lead global teams and define CX metrics and culture.",
    requirements: ["Leadership", "CRM Systems", "Strategic Planning", "Data Literacy"],
    createdAt: "2024-04-09"
  },
  {
    id: "job-14",
    title: "Cloud Native Developer",
    department: "Cloud Services",
    description: "Build highly distributed applications leveraging serverless and edge computing. Expert in Go and event-driven architecture.",
    requirements: ["Go", "Serverless", "Event-Driven Core", "GraphQL"],
    createdAt: "2024-04-10"
  }
];

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "c1",
    name: "Alex Rivera",
    email: "alex@example.com",
    resumeText: "Senior Frontend Engineer with 7 years experience. Advanced proficiency in React, TypeScript, and modern state management. Expert in performance profiling and building scalable component libraries using Tailwind CSS. Previously at TechFlow Inc leading a team of 4.",
    appliedAt: "2024-03-25"
  },
  {
    id: "c2",
    name: "Samantha Lee",
    email: "sam@example.com",
    resumeText: "Accomplished Product Leader with 4 years in AI startups. Skilled in defining product roadmaps for generative AI features. Strong collaborator with engineers and designers. BA in Computer Science.",
    appliedAt: "2024-03-24"
  },
  {
    id: "c3",
    name: "Jordan Smith",
    email: "jordan@example.com",
    resumeText: "Junior Web Developer. Familiar with React and CSS. Looking for my first major role in a tech company. Fast learner and hard worker.",
    appliedAt: "2024-03-26"
  },
  { id: "c4", name: "Elena Gilbert", email: "elena.g@mystic.com", resumeText: "Full stack developer with 5 years exp in Ruby on Rails and React. Focus on user-centric design.", appliedAt: "2024-03-27" },
  { id: "c5", name: "Stefan Salvatore", email: "stefan.s@mystic.com", resumeText: "Backend engineer specialized in Java and high-concurrency systems. Expert in DB optimization.", appliedAt: "2024-03-28" },
  { id: "c6", name: "Damon Salvatore", email: "damon.s@mystic.com", resumeText: "DevOps specialist with deep knowledge in Kubernetes, AWS, and CI/CD pipelines. Security enthusiast.", appliedAt: "2024-03-28" },
  { id: "c7", name: "Bonnie Bennett", email: "bonnie.b@mystic.com", resumeText: "Frontend lead expert in accessibility and modern CSS frameworks. 8 years architecture experience.", appliedAt: "2024-03-29" },
  { id: "c8", name: "Caroline Forbes", email: "caroline.f@mystic.com", resumeText: "Product manager with focus on B2B SaaS. Expert in user research and agile methodologies.", appliedAt: "2024-03-30" },
  { id: "c9", name: "Niklaus Mikaelson", email: "klaus.m@nola.com", resumeText: "Senior architect with 15 years experience in legacy system modernization and hybrid cloud.", appliedAt: "2024-03-31" },
  { id: "c10", name: "Elijah Mikaelson", email: "elijah.m@nola.com", resumeText: "Distinguished engineer with focus on security protocols and encryption standards. PH.D in CompSci.", appliedAt: "2024-04-01" },
  { id: "c11", name: "Rebekah Mikaelson", email: "rebekah.m@nola.com", resumeText: "UI/UX designer with portfolio of top-tier mobile apps. Focused on motion design and branding.", appliedAt: "2024-04-01" },
  { id: "c12", name: "Marcel Gerard", email: "marcel.g@nola.com", resumeText: "Engineering manager who built teams from 0 to 50. Strong focus on developer experience and culture.", appliedAt: "2024-04-02" },
  { id: "c13", name: "Hayley Marshall", email: "hayley.m@nola.com", resumeText: "QA automation lead. Expert in Selenium, Cypress, and end-to-end testing strategies for complex web apps.", appliedAt: "2024-04-03" },
  { id: "c14", name: "Tyler Lockwood", email: "tyler.l@mystic.com", resumeText: "Mobile developer expert in Flutter and React Native. Cross-platform performance specialist.", appliedAt: "2024-04-04" },
  { id: "c15", name: "Matt Donovan", email: "matt.d@mystic.com", resumeText: "Support engineer with great communication skills. Troubleshooting expert for large scale systems.", appliedAt: "2024-04-05" },
  { id: "c16", name: "Alaric Saltzman", email: "alaric.s@mystic.com", resumeText: "Information Security Analyst. Expert in penetration testing, vulnerability assessment, and compliance.", appliedAt: "2024-04-06" },
  { id: "c17", name: "Enzo St. John", email: "enzo.s@mystic.com", resumeText: "Embedded systems engineer with background in robotics and IoT sensor integration.", appliedAt: "2024-04-07" },
  { id: "c18", name: "Kai Parker", email: "kai.p@prison.com", resumeText: "Chaos engineer. Specialized in system stress testing and resiliency engineering.", appliedAt: "2024-04-08" },
  { id: "c19", name: "Jo Laughlin", email: "jo.l@mystic.com", resumeText: "Bioinformatics software dev. Bridges the gap between complex biological data and software tools.", appliedAt: "2024-04-09" },
  { id: "c20", name: "Katherine Pierce", email: "katherine.p@bulgaria.com", resumeText: "Growth hacker and technical marketer. Expert in SEO, data analytics, and performance marketing.", appliedAt: "2024-04-10" },
  { id: "c21", name: "Peter Parker", email: "peter.p@dailybugle.com", resumeText: "Mid-level dev with secret talent for high-stakes problem solving. Expert in sticky situations and web technologies.", appliedAt: "2024-04-11" },
  { id: "c22", name: "Gwen Stacy", email: "gwen.s@oscrop.com", resumeText: "Quantum physicist turned software engineer. Specialized in algorithm efficiency and multithreading.", appliedAt: "2024-04-12" },
  { id: "c23", name: "Tony Stark", email: "tony.s@stark.com", resumeText: "Visionary architect. Expert in AI integration, hardware-software handshakes, and innovative UI.", appliedAt: "2024-04-13" },
  { id: "c24", name: "Steve Rogers", email: "steve.r@shield.gov", resumeText: "Project coordinator with strong leadership values. Integrity-driven and highly reliable lead.", appliedAt: "2024-04-14" },
  { id: "c25", name: "Natasha Romanoff", email: "natasha.r@shield.gov", resumeText: "Cyber intelligence specialist. Expert in data extraction, encryption, and subtle system manipulation.", appliedAt: "2024-04-15" },
  { id: "c26", name: "Bruce Banner", email: "bruce.b@stark.com", resumeText: "Big data scientist. Expert in massive dataset analysis and high-performance computing clusters.", appliedAt: "2024-04-16" },
  { id: "c27", name: "Wanda Maximoff", email: "wanda.m@westview.gov", resumeText: "Reality-bending UI/UX. Specialized in immersive experiences and psychological trigger design.", appliedAt: "2024-04-17" },
  { id: "c28", name: "Vision", email: "vision@stark.com", resumeText: "Pure logic engine implementation specialist. Expert in formal verification and deterministic systems.", appliedAt: "2024-04-18" },
  { id: "c29", name: "Sam Wilson", email: "sam.w@shield.gov", resumeText: "Cloud architect with focus on airborne/mobile communications and infrastructure availability.", appliedAt: "2024-04-19" },
  { id: "c30", name: "Bucky Barnes", email: "bucky.b@wakanda.com", resumeText: "Systems recovery specialist. Expert in legacy code restoration and hardened infrastructure.", appliedAt: "2024-04-20" },
  { id: "c31", name: "T'Challa", email: "tchalla@wakanda.com", resumeText: "Executive technologist leading next-gen material science software integrations and security.", appliedAt: "2024-04-21" },
  { id: "c32", name: "Shuri", email: "shuri@wakanda.com", resumeText: "Genius level polyglot developer. Creating the impossible daily with tech-forward solutions.", appliedAt: "2024-04-22" },
  { id: "c33", name: "Peter Quill", email: "peter.q@milano.com", resumeText: "Freelance dev with focus on distributed network exploration and high-energy UI components.", appliedAt: "2024-04-23" },
  { id: "c34", name: "Gamora", email: "gamora@zen-whoberi.com", resumeText: "Precision-focused backend dev. Specialized in ultra-efficient data structures and lethal bug fixes.", appliedAt: "2024-04-24" },
  { id: "c35", name: "Rocket", email: "rocket@halfworld.com", resumeText: "Hardware hacker and low-level C developer. Can build a compiler out of a toaster and some spare parts.", appliedAt: "2024-04-25" },
  { id: "c36", name: "Groot", email: "groot@planet-x.com", resumeText: "Sustainable tech advocate. Focused on green hosting and carbon-neutral software development.", appliedAt: "2024-04-26" },
  { id: "c37", name: "Drax", email: "drax@kylos.com", resumeText: "Literal bug hunter. Expert at finding edge cases where others see none. Direct and honest feedback.", appliedAt: "2024-04-27" },
  { id: "c38", name: "Mantiz", email: "mantiz@ego.com", resumeText: "Empathetic designer. Highly attuned to user sentiment and emotional design patterns.", appliedAt: "2024-04-28" },
  { id: "c39", name: "Thor Odinson", email: "thor@asgard.gov", resumeText: "Power systems expert. Deep knowledge in electrical engineering and high-load distribution networks.", appliedAt: "2024-04-29" },
  { id: "c40", name: "Loki Laufeyson", email: "loki@asgard.gov", resumeText: "Creative director and master of illusion. Expert in high-end visuals and subtle brand manipulation.", appliedAt: "2024-04-30" },
  { id: "c41", name: "Jane Foster", email: "jane@thor.com", resumeText: "Astrophysical data analyst and software engineering lead for scientific discovery tools.", appliedAt: "2024-05-01" },
  { id: "c42", name: "Scott Lang", email: "scott.l@pym.com", resumeText: "Microservices specialist. Expert in scaling small components into massive, cohesive infrastructures.", appliedAt: "2024-05-02" },
  { id: "c43", name: "Hope van Dyne", email: "hope.v@pym.com", resumeText: "Operations lead. Expert in workflow optimization and streamlining technical processes.", appliedAt: "2024-05-03" },
  { id: "c44", name: "Henry Pym", email: "hank.p@pym.com", resumeText: "Scientific software pioneer. Founding father of several core algorithms in use today.", appliedAt: "2024-05-04" },
  { id: "c45", name: "Janet van Dyne", email: "janet.v@pym.com", resumeText: "High-fashion UI design and user experience pioneer for cutting-edge technologies.", appliedAt: "2024-05-05" },
  { id: "c46", name: "Stephen Strange", email: "stephen@sanctum.com", resumeText: "Master of multi-dimensional data arrays and complex topological algorithms. Precise and calculated.", appliedAt: "2024-05-06" },
  { id: "c47", name: "Wong", email: "wong@sanctum.com", resumeText: "Infrastructure librarian. Deep knowledge of legacy libraries and archive management systems.", appliedAt: "2024-05-07" },
  { id: "c48", name: "Carol Danvers", email: "carol@starforce.com", resumeText: "High-velocity engineer. Expert in ultra-low latency systems and extreme scale cloud computing.", appliedAt: "2024-05-08" },
  { id: "c49", name: "Nick Fury", email: "nick@shield.gov", resumeText: "Department lead. Expert in assembly of elite teams and strategic technological direction.", appliedAt: "2024-05-09" },
  { id: "c50", name: "Phil Coulson", email: "phil@shield.gov", resumeText: "The glue dev. Excellent at documentation, team cohesion, and bridging various tech stacks.", appliedAt: "2024-05-10" },
  { id: "c51", name: "Maria Hill", email: "maria@shield.gov", resumeText: "Core systems operator. Precise execution, no-nonsense approach to technical delivery and deadlines.", appliedAt: "2024-05-11" },
  { id: "c52", name: "Clint Barton", email: "clint@shield.gov", resumeText: "Single-target focus developer. Extraordinary accuracy in bug-fixing and precise code delivery.", appliedAt: "2024-05-12" },
  { id: "c53", name: "Heimdall", email: "heimdall@asgard.gov", resumeText: "Real-time monitoring expert. Can see and hear every bit and packet across the network.", appliedAt: "2024-05-13" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isScreening, setIsScreening] = useState(false);
  const [viewingCandidate, setViewingCandidate] = useState<{c: Candidate, r?: ScreeningResult} | null>(null);

  // Filtering states
  const [globalSearch, setGlobalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [skillFilter, setSkillFilter] = useState("");
  const [dateRange, setDateRange] = useState<string>("all");

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const result = results.find(r => r.candidateId === candidate.id && r.jobId === selectedJob?.id);
      
      // Global Search
      const matchesSearch = 
        candidate.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        candidate.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
        candidate.resumeText.toLowerCase().includes(globalSearch.toLowerCase());
      
      if (!matchesSearch) return false;

      // Status Filter
      if (statusFilter !== "all" && selectedJob) {
        if (!result) return false;
        if (statusFilter === "highly_qualified" && result.status !== "highly_qualified") return false;
        if (statusFilter === "qualified" && result.status !== "qualified") return false;
        if (statusFilter === "not_matching" && result.status !== "not_matching") return false;
        if (statusFilter === "manual" && !result.manualStatus) return false;
      }

      // Skill Filter
      if (skillFilter && !candidate.resumeText.toLowerCase().includes(skillFilter.toLowerCase())) {
        return false;
      }

      // Date Filter (simple "last X days")
      if (dateRange !== "all") {
        const appliedDate = new Date(candidate.appliedAt);
        const now = new Date();
        const diffDays = Math.ceil((now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dateRange === "7d" && diffDays > 7) return false;
        if (dateRange === "30d" && diffDays > 30) return false;
      }

      return true;
    });
  }, [candidates, results, selectedJob, globalSearch, statusFilter, skillFilter, dateRange]);

  const stats = useMemo(() => [
    { label: "Open Requisitions", value: jobs.length, icon: FileText, trend: "+2 this week" },
    { label: "Active Applicants", value: candidates.length, icon: UserCheck, trend: "+15%" },
    { label: "Assessments Run", value: results.length, icon: Sparkles, color: "indigo" as const },
    { label: "Regulatory Integrity", value: "99.4%", icon: ShieldCheck, color: "teal" as const },
  ], [jobs.length, candidates.length, results.length]);

  const handleScreenAll = async () => {
    if (!selectedJob) return;
    setIsScreening(true);
    
    const newResults: ScreeningResult[] = [];
    for (const candidate of candidates) {
      if (results.some(r => r.candidateId === candidate.id && r.jobId === selectedJob.id)) continue;
      
      try {
        const result = await screenCandidate(selectedJob, candidate.resumeText, candidate.id);
        newResults.push({
          ...result,
          manualStatus: undefined // explicitly set
        });
      } catch (err) {
        console.error("Screening failed for", candidate.name, err);
      }
    }
    
    setResults(prev => [...prev, ...newResults]);
    setIsScreening(false);
  };

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  const handleUpdateCandidateStatus = (status: ScreeningResult['manualStatus']) => {
    if (!viewingCandidate || !selectedJob) return;
    
    setResults(prev => prev.map(r => {
      if (r.candidateId === viewingCandidate.c.id && r.jobId === selectedJob.id) {
        return { ...r, manualStatus: status };
      }
      return r;
    }));
    
    // Add audit log
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      userId: 'recruiter@resuscan.ai',
      action: 'STATUS UPDATE',
      details: `Updated ${viewingCandidate.c.name} status to ${status?.toUpperCase()}`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // In a real app we'd save this to a list, for now just updating viewing candidate
    setViewingCandidate(prev => prev ? { ...prev, r: { ...prev.r!, manualStatus: status } } : null);
  };

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const fetchAIInsights = async () => {
    setIsGeneratingAI(true);
    const insights = await getAIInsights(candidates, jobs);
    setAiInsights(insights);
    setIsGeneratingAI(false);
    
    setAuditLogs(prev => [{
      id: `log-${Date.now()}`,
      action: 'AI GENERATION',
      details: 'Synthesized deep talent pool insights',
      timestamp: new Date().toISOString(),
      userId: 'SYSTEM'
    }, ...prev]);
  };

  useEffect(() => {
    if (activeTab === 'insights' && aiInsights.length === 0) {
      fetchAIInsights();
    }
  }, [activeTab]);

  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const handleSyncHRIS = async (system: string) => {
    setIsSyncing(system);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const newCandidates: Candidate[] = [
      {
        id: `sync-${Date.now()}-1`,
        name: "Marcus Aurelius",
        email: "marcus@rome.gov",
        resumeText: "Experienced infrastructure lead with focus on stoic systems and high-availability architecture. Proficient in Go and cloud deployments.",
        appliedAt: new Date().toISOString()
      },
      {
        id: `sync-${Date.now()}-2`,
        name: "Ada Lovelace",
        email: "ada@analytical.engine",
        resumeText: "Pioneer in computational logic. Expert at designing complex algorithms and debugging system-level bottlenecks.",
        appliedAt: new Date().toISOString()
      }
    ];

    setCandidates(prev => [...prev, ...newCandidates]);
    
    // Add audit log
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      userId: 'system@resuscan.ai',
      action: 'HRIS SYNC',
      details: `Successfully synchronized 2 records from ${system}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
    
    setIsSyncing(null);
  };

  const getCandidateResult = (candidateId: string) => {
    return results.find(r => r.candidateId === candidateId && r.jobId === selectedJob?.id);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {activeTab === 'dashboard' ? 'Strategy Dashboard' : 
               activeTab === 'jobs' ? 'Open Requisitions' :
               activeTab === 'candidates' ? 'Applicant Registry' : 
               activeTab === 'hris' ? 'HRIS Integrations' : 'Intelligence'}
            </h2>
            <p className="text-slate-400 mt-1 text-sm">Streamlining specialized candidate assessments.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Global search..." 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="glass pl-10 pr-4 py-2 rounded-xl text-sm w-64 focus:outline-none ring-1 ring-white/5 focus:ring-2 focus:ring-teal-400/50 transition-all shadow-none"
              />
            </div>
            <button className="glass-button-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>New Requisition</span>
            </button>
          </div>
        </header>

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  whileHover={{ y: -5 }}
                  className="glass-card flex flex-col justify-between group h-64 border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 rounded-xl bg-teal-400/10 text-teal-400 group-hover:bg-teal-400 group-hover:text-slate-950 transition-all duration-300">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-1 rounded-md">
                        {job.department}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white mb-2 leading-tight group-hover:text-teal-400 transition-colors uppercase tracking-tight">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex -space-x-2">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[8px] font-bold">
                           {String.fromCharCode(64 + i)}
                         </div>
                       ))}
                       <div className="w-6 h-6 rounded-full border-2 border-slate-950 bg-teal-400/20 text-teal-400 flex items-center justify-center text-[8px] font-bold">
                         +4
                       </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedJob(job);
                        setActiveTab('dashboard');
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-teal-400 hover:text-teal-300 flex items-center gap-1 group/btn"
                    >
                      Process Applicants <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
              
              <button 
                className="glass-card flex flex-col items-center justify-center text-center border-dashed border-white/10 hover:border-teal-400/30 hover:bg-teal-400/[0.02] transition-all group h-64"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-slate-500 group-hover:text-teal-400" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Start New Requisition</h4>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <StatsCard {...stat} />
                </motion.div>
              ))}
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Job Explorer */}
              <div className="lg:col-span-1 glass-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Requisitions</h3>
                  <button className="text-[10px] bg-white/5 px-2 py-1 rounded-md hover:bg-white/10 transition-colors uppercase font-bold tracking-tighter">View Feed</button>
                </div>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
                        selectedJob?.id === job.id 
                          ? "bg-teal-400/10 border-teal-400/30 text-teal-400" 
                          : "bg-white/5 border-white/5 hover:bg-white/[0.08] text-slate-300"
                      )}
                    >
                      {selectedJob?.id === job.id && (
                        <motion.div 
                          layoutId="active-job-indicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                        />
                      )}
                      <h4 className="font-bold text-sm leading-tight transition-colors">{job.title}</h4>
                      <p className="text-[10px] font-black uppercase tracking-wider opacity-60 mt-1">{job.department}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Candidate Matching Engine */}
              <div className="lg:col-span-2 glass-card">
                <AnimatePresence mode="wait">
                  {selectedJob ? (
                    <motion.div
                      key={selectedJob.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                            <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em]">Predictive Appraisal Engine</span>
                          </div>
                          <h3 className="text-xl font-black text-white">{selectedJob.title}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Inline Filters */}
                          <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                            <input 
                              type="text"
                              placeholder="Search skills..."
                              value={skillFilter}
                              onChange={(e) => setSkillFilter(e.target.value)}
                              className="bg-transparent text-[10px] font-bold text-white placeholder:text-slate-600 px-3 py-1 focus:outline-none w-24 border-r border-white/10"
                            />
                            <select 
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                              className="bg-transparent text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 focus:outline-none cursor-pointer hover:text-white transition-colors"
                            >
                              <option value="all">Full Registry</option>
                              <option value="highly_qualified">Superior Alignment</option>
                              <option value="shortlisted">Qualified</option>
                              <option value="interview_scheduled">In Interview</option>
                              <option value="hired">Hired</option>
                              <option value="rejected">Declined</option>
                            </select>
                            <div className="w-px h-4 bg-white/10" />
                            <select 
                              value={dateRange}
                              onChange={(e) => setDateRange(e.target.value)}
                              className="bg-transparent text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 focus:outline-none cursor-pointer hover:text-white transition-colors"
                            >
                              <option value="all">All Dates</option>
                              <option value="7d">Last 7d</option>
                              <option value="30d">Last 30d</option>
                            </select>
                          </div>

                          <button 
                            disabled={isScreening}
                            onClick={handleScreenAll}
                            className="glass-button-primary disabled:opacity-30"
                          >
                            <Sparkles className={cn("w-4 h-4 mr-2 inline-block", isScreening && "animate-spin")} />
                            <span>{isScreening ? 'Appraising...' : 'Confirm Alignment'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                          {filteredCandidates.map((candidate) => {
                            const result = getCandidateResult(candidate.id);
                            return (
                              <div 
                                key={candidate.id} 
                                onClick={() => setViewingCandidate({c: candidate, r: result})}
                                className="group flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.08] hover:border-teal-400/30 transition-all cursor-pointer"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-[10px] text-teal-400 shadow-inner group-hover:border-teal-400/50 transition-colors">
                                    {candidate.name.charAt(0)}{candidate.name.split(' ')[1]?.charAt(0)}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-sm text-slate-100 group-hover:text-teal-400 transition-colors">{candidate.name}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Applied 2d ago</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  {result ? (
                                    <div className="text-right">
                                      <div className={cn(
                                        "text-lg font-black font-mono",
                                        result.score > 80 ? "text-teal-400" : result.score > 50 ? "text-amber-400" : "text-rose-400"
                                      )}>
                                        {result.score.toFixed(1)}%
                                      </div>
                                      <div className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">
                                        {result.manualStatus ? (
                                          <span className="text-white bg-indigo-500/80 px-1 rounded">{result.manualStatus.replace(/_/g, ' ')}</span>
                                        ) : (
                                          result.status.replace(/_/g, ' ')
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-right opacity-30">
                                      <div className="text-lg font-black font-mono">--.-%</div>
                                      <div className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">Standby</div>
                                    </div>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ) : (
                    <div className="flex flex-col items-center justify-center text-center p-20 h-full">
                      <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center mb-6 border border-white/5 rotate-6 hover:rotate-0 transition-transform duration-700">
                        <Sparkles className="w-8 h-8 text-slate-700 shadow-[0_0_20px_white]" />
                      </div>
                      <h4 className="text-lg font-black text-white uppercase tracking-widest mb-2">Protocol Initialized</h4>
                      <p className="text-slate-500 max-w-xs text-[10px] font-bold uppercase tracking-widest leading-loose">
                        SELECT A REQUISITION FROM THE REGISTRY TO START EVALUATION.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom System Bar */}
            <div className="h-10 glass border-white/5 rounded-2xl flex items-center px-4 justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="opacity-50">ENGINE:</span>
                  <span className="text-teal-400 font-mono">APPRAISAL-PRO-v3</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="opacity-50">STATUS:</span>
                  <span className="text-slate-300">OPERATIONAL</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                <span>System Operational</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Cognitive Intelligence Suite</h3>
                <p className="text-slate-500 text-sm">Real-time analysis of talent ecosystem</p>
              </div>
              <button 
                onClick={fetchAIInsights}
                disabled={isGeneratingAI}
                className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-teal-400/20 text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-teal-400/10 transition-all disabled:opacity-50"
              >
                {isGeneratingAI ? <RefreshCw className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
                {isGeneratingAI ? 'Processing...' : 'Regenerate Analysis'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card space-y-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Alignment Distribution Analysis</h3>
                  <ScoreDistributionChart results={results} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiInsights.map((insight, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={idx} 
                      className="glass-card !p-6 border-l-4 border-l-teal-400/50 hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {insight.type === 'strategy' ? <Zap className="w-4 h-4 text-amber-400" /> : 
                         insight.type === 'warning' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : 
                         <Sparkles className="w-4 h-4 text-emerald-400" />}
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white">{insight.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        {insight.description}
                      </p>
                    </motion.div>
                  ))}
                  {isGeneratingAI && [1, 2, 3].map(i => (
                    <div key={i} className="glass-card !p-6 animate-pulse bg-white/5 h-32 rounded-3xl" />
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1 glass-card space-y-6">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Compliance Ledger</h3>
                <div className="space-y-4">
                  {auditLogs.map(log => (
                    <div key={log.id} className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-teal-400 uppercase">{log.action}</span>
                        <span className="text-[8px] text-slate-600 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">{log.details}</p>
                      <p className="text-[8px] text-slate-600 font-bold tracking-widest uppercase">Actor: {log.userId}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[9px] text-teal-500 italic">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Regulatory Standard: SOC2/GDPR Ready</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Global Talent Registry</h3>
                <p className="text-slate-500 text-sm">Total: {candidates.length} Professionals</p>
              </div>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      <th className="px-6 py-4">Professional</th>
                      <th className="px-6 py-4">Email Address</th>
                      <th className="px-6 py-4">Sourcing Date</th>
                      <th className="px-6 py-4">Registry ID</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {candidates.map((candidate) => (
                      <tr key={candidate.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-teal-400/10 flex items-center justify-center text-[10px] font-black text-teal-400">
                              {candidate.name.charAt(0)}{candidate.name.split(' ')[1]?.charAt(0)}
                            </div>
                            <span className="font-bold text-white group-hover:text-teal-400 transition-colors uppercase tracking-tight">{candidate.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-400">{candidate.email}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{new Date(candidate.appliedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-[10px] font-mono text-slate-600">{candidate.id}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setViewingCandidate({ c: candidate })}
                            className="p-2 hover:bg-teal-400 hover:text-slate-950 rounded-lg transition-all text-slate-500"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hris' && (
          <div className="space-y-8">
            <div className="glass-card p-12 text-center max-w-4xl mx-auto space-y-8">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/20">
                <Settings className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em]">HRIS Pipeline Sync</h3>
                <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
                  Consolidate your global recruitment efforts by bridging your Applicant Tracking Systems with ResuScan's Predictive Appraisal Engine.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                {[
                  { name: 'Workday', color: 'indigo', icon: Users },
                  { name: 'Lever', color: 'emerald', icon: Calendar },
                  { name: 'Greenhouse', color: 'teal', icon: CheckCircle2 }
                ].map(sys => (
                  <button 
                    key={sys.name}
                    disabled={!!isSyncing}
                    onClick={() => handleSyncHRIS(sys.name)}
                    className={cn(
                      "p-8 glass rounded-3xl border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden",
                      isSyncing === sys.name && "ring-2 ring-teal-400 border-transparent shadow-[0_0_30px_rgba(45,212,191,0.2)]"
                    )}
                  >
                    {isSyncing === sys.name && (
                      <div className="absolute inset-0 bg-teal-400/5 animate-pulse" />
                    )}
                    <div className="relative z-10">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500",
                        isSyncing === sys.name ? "bg-teal-400 text-slate-950 scale-110" : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                      )}>
                        {isSyncing === sys.name ? (
                          <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <sys.icon className="w-6 h-6" />
                        )}
                      </div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{sys.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                        {isSyncing === sys.name ? 'Synchronizing Archive...' : 'Connect & Sync'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-6">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-black text-white font-mono">1,240</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Sync Logs</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-teal-400 font-mono">100%</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Data Integrity</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-white font-mono">Realtime</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Update Frequency</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Recent Sync Activity</h3>
                <button className="text-[10px] font-black text-teal-400 uppercase tracking-widest hover:underline">View All Exports</button>
              </div>
              <div className="space-y-3">
                {auditLogs.filter(l => l.action === 'HRIS SYNC').slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-teal-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase tracking-tight">{log.details}</p>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600">ID: {log.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {viewingCandidate && (
            <CandidateModal 
              candidate={viewingCandidate.c}
              result={viewingCandidate.r}
              job={selectedJob || undefined}
              onUpdateStatus={handleUpdateCandidateStatus}
              onClose={() => setViewingCandidate(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
