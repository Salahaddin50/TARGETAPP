import { Target } from '../types';

interface ActionSuggestion {
  title: string;
  urgency: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export function generateActionSuggestions(target: Target): ActionSuggestion[] {
  // This is a simplified version. In a real application, this would use an AI service
  const suggestions: Record<string, ActionSuggestion[]> = {
    'fitness': [
      { title: 'Create a weekly workout schedule', urgency: 'high', impact: 'high' },
      { title: 'Set up meal planning system', urgency: 'high', impact: 'high' },
      { title: 'Buy necessary workout equipment', urgency: 'medium', impact: 'high' },
      { title: 'Find a workout buddy or trainer', urgency: 'medium', impact: 'medium' },
      { title: 'Track daily calorie intake', urgency: 'high', impact: 'high' },
    ],
    'business': [
      { title: 'Conduct market research', urgency: 'high', impact: 'high' },
      { title: 'Create business plan', urgency: 'high', impact: 'high' },
      { title: 'Set up legal structure', urgency: 'high', impact: 'high' },
      { title: 'Develop marketing strategy', urgency: 'medium', impact: 'high' },
      { title: 'Secure initial funding', urgency: 'high', impact: 'high' },
    ],
    'education': [
      { title: 'Create study schedule', urgency: 'high', impact: 'high' },
      { title: 'Gather learning materials', urgency: 'high', impact: 'medium' },
      { title: 'Find study group or mentor', urgency: 'medium', impact: 'high' },
      { title: 'Set up practice tests', urgency: 'medium', impact: 'high' },
      { title: 'Create progress tracking system', urgency: 'medium', impact: 'medium' },
    ],
    'default': [
      { title: 'Break down target into smaller milestones', urgency: 'high', impact: 'high' },
      { title: 'Create timeline and deadlines', urgency: 'high', impact: 'high' },
      { title: 'Identify potential obstacles', urgency: 'medium', impact: 'high' },
      { title: 'Set up progress tracking method', urgency: 'medium', impact: 'medium' },
      { title: 'Gather necessary resources', urgency: 'high', impact: 'medium' },
    ],
  };

  // Analyze target title and description to determine category
  const targetText = `${target.title} ${target.description}`.toLowerCase();
  
  let category = 'default';
  if (targetText.match(/fitness|health|workout|exercise|weight|gym/)) {
    category = 'fitness';
  } else if (targetText.match(/business|startup|company|profit|market/)) {
    category = 'business';
  } else if (targetText.match(/study|learn|education|course|degree|exam/)) {
    category = 'education';
  }

  return suggestions[category];
}