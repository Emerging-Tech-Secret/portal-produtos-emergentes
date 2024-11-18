import OpenAI from 'openai';
import { ProductMarketFit, Feedback, Prototype } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeFeedback(prototype: Prototype, feedback: Feedback[]): Promise<ProductMarketFit> {
  const feedbackSummary = feedback.map(f => ({
    rating: f.rating,
    comment: f.comment,
    categories: f.categories,
    reaction: f.reaction
  }));

  const prompt = `
    Analyze the following product feedback and provide insights about product-market fit:
    
    Product: ${prototype.title}
    Description: ${prototype.description}
    Tags: ${prototype.tags.join(', ')}
    
    Feedback Data:
    ${JSON.stringify(feedbackSummary, null, 2)}
    
    Please provide:
    1. Overall PMF score (0-100)
    2. Detailed analysis
    3. Key recommendations
    4. Metrics for:
       - User engagement
       - Problem-solution fit
       - Market potential
       - Technical feasibility
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a product market fit analyst specializing in emerging technologies."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const analysis = response.choices[0].message.content || '';
  
  // Parse the GPT response to extract structured data
  const pmfData = parseGPTResponse(analysis);

  return {
    id: Math.random().toString(36).substr(2, 9),
    prototypeId: prototype.id,
    score: pmfData.score,
    analysis: pmfData.analysis,
    recommendations: pmfData.recommendations,
    createdAt: new Date(),
    metrics: pmfData.metrics
  };
}

function parseGPTResponse(response: string): {
  score: number;
  analysis: string;
  recommendations: string[];
  metrics: {
    userEngagement: number;
    problemSolution: number;
    marketPotential: number;
    technicalFeasibility: number;
  };
} {
  // Implement parsing logic based on the GPT response format
  // This is a simplified example
  return {
    score: 75,
    analysis: response,
    recommendations: ['Improve user onboarding', 'Add more features', 'Optimize performance'],
    metrics: {
      userEngagement: 0.8,
      problemSolution: 0.7,
      marketPotential: 0.9,
      technicalFeasibility: 0.6
    }
  };
}

export async function generateInsights(prototype: Prototype, pmf: ProductMarketFit): Promise<string> {
  const prompt = `
    Based on the following product market fit analysis, generate actionable insights:
    
    Product: ${prototype.title}
    PMF Score: ${pmf.score}
    Analysis: ${pmf.analysis}
    
    Current Metrics:
    - User Engagement: ${pmf.metrics.userEngagement}
    - Problem-Solution Fit: ${pmf.metrics.problemSolution}
    - Market Potential: ${pmf.metrics.marketPotential}
    - Technical Feasibility: ${pmf.metrics.technicalFeasibility}
    
    Please provide:
    1. Key opportunities for improvement
    2. Potential risks and mitigation strategies
    3. Next steps for product development
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a product strategy consultant specializing in emerging technologies."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return response.choices[0].message.content || '';
}