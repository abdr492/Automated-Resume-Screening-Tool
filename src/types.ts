export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  resumeText: string;
  appliedAt: string;
}

export interface InterviewQuestion {
  question: string;
  intent: string;
  expectedKeywords: string[];
}

export interface GapDetail {
  requirement: string;
  missingSpecifics: string;
  impact: string;
}

export interface ScreeningResult {
  candidateId: string;
  jobId: string;
  score: number; // 0-100
  skills: string[];
  experience: string;
  mustHaveGaps: GapDetail[];
  insights: string;
  interviewQuestions: InterviewQuestion[];
  status: 'highly_qualified' | 'qualified' | 'not_matching';
  manualStatus?: 'interview_scheduled' | 'rejected' | 'hired' | 'shortlisted';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: string;
}
