import OpenAI from 'openai';
import { useError } from '../contexts/ErrorContext';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateImage(description: string): Promise<string | null> {
  // If no API key is configured, return null immediately
  if (!import.meta.env.VITE_OPENAI_API_KEY || 
      import.meta.env.VITE_OPENAI_API_KEY === 'your-api-key-here') {
    console.warn('OpenAI API key not configured');
    return null;
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a professional, modern visualization for a tech prototype: ${description}`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    return response.data[0].url || null;
  } catch (error) {
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('invalid_api_key')) {
        console.warn('Invalid OpenAI API key');
      } else {
        console.error('Failed to generate image:', error);
      }
    }
    return null;
  }
}