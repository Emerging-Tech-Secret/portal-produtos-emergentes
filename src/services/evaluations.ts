import { z } from 'zod';
import OpenAI from 'openai';
import { executeQuery } from '../lib/db';
import { PortalEvaluation, EvaluationAnalysis } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const evaluationSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  created_at: z.string().transform(date => new Date(date)),
  overall_rating: z.number(),
  likert_responses: z.string().transform(data => JSON.parse(data)),
  qualitative_response: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).nullable()
});

// Mock data for development
const mockEvaluations: PortalEvaluation[] = [];

export async function createEvaluation(
  evaluation: Omit<PortalEvaluation, 'id' | 'sentiment'>,
  useMockData: boolean = true
): Promise<PortalEvaluation> {
  if (useMockData) {
    const newEvaluation: PortalEvaluation = {
      ...evaluation,
      id: Math.random().toString(36).substr(2, 9),
      sentiment: await analyzeSentiment(evaluation.qualitativeResponse)
    };
    mockEvaluations.push(newEvaluation);
    return newEvaluation;
  }

  const sql = `
    INSERT INTO portal_evaluations (
      user_id,
      overall_rating,
      likert_responses,
      qualitative_response,
      sentiment
    ) VALUES (?, ?, ?, ?, ?)
    RETURNING *
  `;

  const sentiment = await analyzeSentiment(evaluation.qualitativeResponse);

  const results = await executeQuery(
    sql,
    [
      evaluation.userId,
      evaluation.overallRating,
      JSON.stringify(evaluation.likertResponses),
      evaluation.qualitativeResponse,
      sentiment
    ],
    evaluationSchema.array()
  );

  return results[0];
}

export async function getAllEvaluations(useMockData: boolean = true): Promise<PortalEvaluation[]> {
  if (useMockData) {
    return mockEvaluations;
  }

  const sql = `
    SELECT *
    FROM portal_evaluations
    ORDER BY created_at DESC
  `;

  return executeQuery(sql, [], evaluationSchema.array());
}

async function analyzeSentiment(text: string): Promise<'positive' | 'neutral' | 'negative'> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Classify the following text as 'positive', 'neutral', or 'negative'."
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    const sentiment = response.choices[0].message.content?.toLowerCase();
    if (sentiment?.includes('positive')) return 'positive';
    if (sentiment?.includes('negative')) return 'negative';
    return 'neutral';
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return 'neutral';
  }
}

export async function analyzeEvaluations(evaluations: PortalEvaluation[]): Promise<EvaluationAnalysis> {
  const prompt = `
    Analyze the following portal evaluations and provide insights:

    Evaluations: ${JSON.stringify(evaluations, null, 2)}

    Please provide:
    1. A summary of the overall feedback
    2. Key recommendations for improvement
    3. Identified trends and patterns
    4. Analysis of sentiment distribution

    Format the response as JSON with the following structure:
    {
      "summary": "string",
      "recommendations": ["string"],
      "trends": [{"category": "string", "trend": number, "insight": "string"}],
      "sentimentDistribution": {"positive": number, "neutral": number, "negative": number}
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI analyst specializing in user feedback analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');

    return {
      id: Math.random().toString(36).substr(2, 9),
      evaluationIds: evaluations.map(e => e.id),
      createdAt: new Date(),
      ...analysis
    };
  } catch (error) {
    console.error('Error analyzing evaluations:', error);
    throw new Error('Failed to analyze evaluations');
  }
}