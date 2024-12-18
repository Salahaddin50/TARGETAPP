import { Target, Action } from '../types';

export function generateStepSuggestions(target: Target, action: Action): string[] {
  // This is a simplified version. In a real app, this would use an AI service
  const suggestions: Record<string, string[]> = {
    planning: [
      'Create a detailed project timeline',
      'Define key milestones and deliverables',
      'Identify required resources and dependencies',
      'Set up progress tracking metrics',
      'Establish communication channels'
    ],
    implementation: [
      'Set up development environment',
      'Create basic project structure',
      'Implement core functionality',
      'Add error handling and validation',
      'Perform initial testing'
    ],
    research: [
      'Conduct market analysis',
      'Review existing solutions',
      'Identify target audience',
      'Analyze competitors',
      'Document findings and insights'
    ],
    default: [
      'Break down the action into smaller tasks',
      'Create a checklist of requirements',
      'Set up monitoring and tracking',
      'Review and validate progress',
      'Document process and learnings'
    ]
  };

  const text = `${target.title} ${target.description} ${action.title}`.toLowerCase();
  let category = 'default';

  if (text.match(/plan|strategy|organize|prepare/)) {
    category = 'planning';
  } else if (text.match(/build|create|implement|develop|code/)) {
    category = 'implementation';
  } else if (text.match(/research|analyze|study|investigate/)) {
    category = 'research';
  }

  return suggestions[category];
}