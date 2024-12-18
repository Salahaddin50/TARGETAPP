import { Step } from '../types';

export function generateStepRecommendations(step: Step): string[] {
  // This is a simplified version. In a real app, this would use an AI service
  const recommendations: Record<string, string[]> = {
    research: [
      'Break down the research into specific topics',
      'Identify key sources and references',
      'Create a research timeline',
      'Document findings systematically',
      'Review and validate findings'
    ],
    planning: [
      'Define clear objectives and goals',
      'Create a detailed timeline',
      'Identify required resources',
      'Assign responsibilities',
      'Set up progress tracking methods'
    ],
    implementation: [
      'Create a step-by-step implementation plan',
      'Set up monitoring and feedback mechanisms',
      'Prepare contingency plans',
      'Document the implementation process',
      'Regular progress reviews'
    ],
    default: [
      'Break down the step into smaller tasks',
      'Set specific deadlines for each task',
      'Identify potential challenges',
      'Create a progress tracking system',
      'Regular review and adjustment'
    ]
  };

  const stepText = step.description.toLowerCase();
  let category = 'default';

  if (stepText.match(/research|study|analyze|investigate/)) {
    category = 'research';
  } else if (stepText.match(/plan|prepare|design|strategy/)) {
    category = 'planning';
  } else if (stepText.match(/implement|execute|build|create|develop/)) {
    category = 'implementation';
  }

  return recommendations[category];
}