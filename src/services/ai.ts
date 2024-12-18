import { HfInference } from '@huggingface/inference';
import { Target } from '../types';
import { generateActionSuggestions } from './actionSuggestions';

const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CX = import.meta.env.VITE_GOOGLE_CX;
const hf = new HfInference(HUGGINGFACE_API_KEY);

async function searchGoogle(query: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error searching Google:', error);
    return [];
  }
}

async function extractRelevantInfo(searchResults: any[]) {
  const relevantTexts = searchResults
    .map(item => `${item.title}\n${item.snippet}`)
    .join('\n\n');

  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      inputs: `Based on the following search results, extract key actionable steps and insights:

${relevantTexts}

Format your response as a JSON array of objects with properties:
- title: The action title
- urgency: "high", "medium", or "low"
- impact: "high", "medium", or "low"
- reasoning: Why this action is important

Limit to 5 most relevant actions.`,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
    });

    const jsonStr = response.generated_text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)?.[0];
    if (!jsonStr) throw new Error('No JSON found in response');
    
    const suggestions = JSON.parse(jsonStr);
    return Array.isArray(suggestions) ? suggestions : [];
  } catch (error) {
    console.error('Error extracting insights:', error);
    return [];
  }
}

export async function generateActionSuggestionsWithAI(target: Target) {
  try {
    // If no API keys are provided, fall back to local suggestions
    if (!GOOGLE_API_KEY || !GOOGLE_CX || !HUGGINGFACE_API_KEY) {
      console.log('Missing API keys, using fallback suggestions');
      return generateActionSuggestions(target);
    }

    // Construct search query based on target details
    const searchQuery = `how to ${target.title} ${target.description} best practices steps guide`;
    const searchResults = await searchGoogle(searchQuery);

    if (searchResults.length === 0) {
      console.log('No search results found, using fallback suggestions');
      return generateActionSuggestions(target);
    }

    const suggestions = await extractRelevantInfo(searchResults);
    
    if (suggestions.length === 0) {
      return generateActionSuggestions(target);
    }

    return suggestions;
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return generateActionSuggestions(target);
  }
}