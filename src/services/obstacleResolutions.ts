import { Obstacle } from '../types';

export function generateObstacleResolutions(obstacle: Obstacle): string[] {
  // This is a simplified version. In a real app, this would use an AI service
  const resolutions: Record<string, string[]> = {
    technical: [
      'Research and implement alternative technical solutions',
      'Consult with technical experts or documentation',
      'Break down the problem into smaller, manageable parts',
      'Create a proof of concept to validate the solution',
      'Set up proper testing environment'
    ],
    resource: [
      'Identify alternative resources or suppliers',
      'Optimize existing resource allocation',
      'Create a resource sharing plan',
      'Develop contingency plans for resource constraints',
      'Negotiate for additional resources'
    ],
    timeline: [
      'Reassess and adjust project timeline',
      'Identify tasks that can be parallelized',
      'Optimize critical path activities',
      'Add additional resources to critical tasks',
      'Negotiate deadline extensions if necessary'
    ],
    default: [
      'Break down the obstacle into smaller challenges',
      'Create a detailed action plan',
      'Identify and engage key stakeholders',
      'Set up regular progress reviews',
      'Document lessons learned for future reference'
    ]
  };

  const obstacleText = obstacle.description.toLowerCase();
  let category = 'default';

  if (obstacleText.match(/technical|system|software|hardware|code|bug/)) {
    category = 'technical';
  } else if (obstacleText.match(/resource|budget|cost|funding|staff|equipment/)) {
    category = 'resource';
  } else if (obstacleText.match(/time|schedule|deadline|delay|late/)) {
    category = 'timeline';
  }

  return resolutions[category];
}