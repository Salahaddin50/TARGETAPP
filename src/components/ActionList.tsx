import { Action, Priority } from '../types';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { ChevronDown, ChevronUp, AlertTriangle, Zap, ListChecks, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface ActionListProps {
  actions: Action[];
  onActionClick: (actionId: string) => void;
}

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority]}`}
    >
      {priority}
    </span>
  );
};

export function ActionList({ actions, onActionClick }: ActionListProps) {
  const [expandedAction, setExpandedAction] = useState<string | null>(null);

  const getCompletedSteps = (action: Action) => {
    return action.steps.filter(step => 
      step.tasks?.every(task => task.completed) || step.completed
    ).length;
  };

  const getResolvedObstacles = (action: Action) => {
    return action.obstacles.filter(obstacle => obstacle.resolved).length;
  };

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <div key={action.id} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setExpandedAction(
                    expandedAction === action.id ? null : action.id
                  )
                }
              >
                {expandedAction === action.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {action.title}
                </h4>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-4 w-4 text-gray-400" />
                    <PriorityBadge priority={action.urgency} />
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-gray-400" />
                    <PriorityBadge priority={action.impact} />
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <ListChecks className="h-4 w-4" />
                    <span>{getCompletedSteps(action)}/{action.steps.length}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <AlertCircle className="h-4 w-4" />
                    <span>{getResolvedObstacles(action)}/{action.obstacles.length}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={() => onActionClick(action.id)}>View Details</Button>
          </div>

          {expandedAction === action.id && (
            <div className="mt-4 pl-12">
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Progress
                  </h5>
                  <Progress value={action.progress} />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Steps ({getCompletedSteps(action)}/{action.steps.length})
                  </h5>
                  <ul className="space-y-2">
                    {action.steps.map((step) => (
                      <li
                        key={step.id}
                        className={`text-sm ${
                          step.completed
                            ? 'text-gray-400 line-through'
                            : 'text-gray-600'
                        }`}
                      >
                        {step.description}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Obstacles ({getResolvedObstacles(action)}/{action.obstacles.length})
                  </h5>
                  <ul className="space-y-2">
                    {action.obstacles.map((obstacle) => (
                      <li
                        key={obstacle.id}
                        className={`text-sm ${
                          obstacle.resolved
                            ? 'text-gray-400 line-through'
                            : 'text-gray-600'
                        }`}
                      >
                        {obstacle.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}