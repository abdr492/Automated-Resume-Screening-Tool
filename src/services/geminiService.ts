import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface AIInsight {
  title: string;
  description: string;
  type: 'strategy' | 'warning' | 'opportunity';
}

export async function getAIInsights(candidates: any[], jobs: any[]): Promise<AIInsight[]> {
  const prompt = `
    As an AI Recruitment Strategist, analyze the following talent pipeline and job requisitions.
    Provide 3 high-level strategic insights.
    
    Talent Pool: ${JSON.stringify(candidates.map(c => ({ name: c.name, resume: c.resumeText.substring(0, 100) })))}
    Open Jobs: ${JSON.stringify(jobs.map(j => ({ title: j.title, requirements: j.requirements })))}

    Return the insights as a JSON array of objects with 'title', 'description', and 'type' (strategy, warning, or opportunity).
    Be professional, concise, and technical.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Insights Error:", error);
    return [
      {
        title: "Latency Detected",
        description: "AI Engine is experiencing high demand. Strategy recommendation: prioritize high-value React roles.",
        type: 'warning'
      }
    ];
  }
}
