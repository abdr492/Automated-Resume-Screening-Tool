import { GoogleGenAI, Type } from "@google/genai";
import { Job, ScreeningResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function screenCandidate(job: Job, resumeText: string, candidateId: string): Promise<ScreeningResult> {
  const prompt = `
    You are an expert HR Tech Specialist and AI Recruiter. 
    Analyze the following resume text against the specific job requirement.
    
    IMPORTANT: Prioritize fairness and minimize bias. Evaluate based strictly on skills, certificates, and relevant experience. Ignore names, perceived gender, or age-suggesting dates.
    
    JOB TITLE: ${job.title}
    JOB DESCRIPTION: ${job.description}
    MUST-HAVE REQUIREMENTS: ${job.requirements.join(", ")}
    
    RESUME TEXT:
    ${resumeText}
    
    Evaluate the candidate based on these criteria:
    1. Overall match score (0-100).
    2. List of key skills found.
    3. Experience summary relevant to this job.
    4. Gaps in "Must-have" requirements. For each gap, identify which requirement it relates to, explain precisely what specific sub-skill or experience is missing, and the impact/criticality of this gap for the role.
    5. A brief AI insight about why this candidate is a good or bad fit.
    6. Generate 3 behavioral or technical interview questions tailored specifically to this resume's details and the job requirements.
    
    Return the result in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            experience: { type: Type.STRING },
            mustHaveGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  requirement: { type: Type.STRING },
                  missingSpecifics: { type: Type.STRING },
                  impact: { type: Type.STRING }
                },
                required: ["requirement", "missingSpecifics", "impact"]
              }
            },
            insights: { type: Type.STRING },
            interviewQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  intent: { type: Type.STRING },
                  expectedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            status: { 
              type: Type.STRING,
              enum: ['highly_qualified', 'qualified', 'not_matching']
            }
          },
          required: ["score", "skills", "experience", "mustHaveGaps", "insights", "status", "interviewQuestions"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      ...result,
      candidateId,
      jobId: job.id
    };
  } catch (error) {
    console.error("AI Screening Error:", error);
    // Fallback if AI fails
    return {
      candidateId,
      jobId: job.id,
      score: 0,
      skills: [],
      experience: "Analysis failed",
      mustHaveGaps: [
        { 
          requirement: "General Alignment", 
          missingSpecifics: "The appraisal engine encountered a processing error while analyzing the document structure.",
          impact: "Critical verification of professional qualifications could not be completed."
        }
      ],
      insights: "The AI was unable to process this resume.",
      interviewQuestions: [],
      status: 'not_matching'
    };
  }
}
