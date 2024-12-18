import React, { useState, useEffect } from 'react';
import { Action, Step, Obstacle, Target } from '../../types';
import { Button } from '../ui/Button';
import { AddStepDialog } from './AddStepDialog';
import { AddObstacleDialog } from './AddObstacleDialog';
import { useStore } from '../../store/useStore';
import { generateId } from '../../lib/utils';
import { StepDetails } from '../steps/StepDetails';
import { ObstacleDetails } from '../obstacles/ObstacleDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { EditActionDialog } from '../dialogs/EditActionDialog';
import { DeleteActionDialog } from '../dialogs/DeleteActionDialog';

interface ActionViewProps {
  action: Action;
  target: Target;
  isOwner: boolean;
}

export function ActionView({ action, target, isOwner }: ActionViewProps) {
  const { 
    addStep, 
    updateStep,
    deleteStep,
    addTask, 
    updateTask,
    deleteTask,
    updateTaskDeadline,
    toggleTask,
    addObstacle,
    updateObstacle,
    deleteObstacle,
    resolveObstacle,
    unresolveObstacle,
    updateAction,
    deleteAction
  } = useStore();

  const [recommendations, setRecommendations] = useState<Record<string, string[]>>({});

  const getCompletedSteps = () => {
    return action.steps.filter(step => 
      step.tasks?.every(task => task.completed) || step.completed
    ).length;
  };

  const getResolvedObstacles = () => {
    return action.obstacles.filter(obstacle => obstacle.resolved).length;
  };

  useEffect(() => {
    const completedSteps = getCompletedSteps();
    const resolvedObstacles = getResolvedObstacles();
    const totalItems = action.steps.length + action.obstacles.length;
    const completedItems = completedSteps + resolvedObstacles;
    
    const newProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    if (newProgress !== action.progress && isOwner) {
      updateAction(action.targetId, { ...action, progress: newProgress });
    }
  }, [action.steps, action.obstacles]);

  const handleAddStep = (stepData: {
    description: string;
    tasks: { description: string; completed: boolean }[];
  }) => {
    if (!isOwner) return;

    const newStep: Step = {
      id: generateId(),
      description: stepData.description,
      completed: false,
      progress: 0,
      tasks: stepData.tasks.map(task => ({
        id: generateId(),
        description: task.description,
        completed: task.completed,
        stepId: '',
      })),
      actionId: action.id,
    };
    addStep(action.targetId, action.id, newStep);
  };

  const handleAddObstacle = (obstacleData: {
    description: string;
    resolution?: string;
    resolutionDate?: Date;
    suggestedResolutions?: string[];
  }) => {
    if (!isOwner) return;

    const newObstacle: Obstacle = {
      id: generateId(),
      description: obstacleData.description,
      resolved: false,
      actionId: action.id,
      resolution: obstacleData.resolution,
      resolutionDate: obstacleData.resolutionDate,
      suggestedResolutions: obstacleData.suggestedResolutions,
    };
    addObstacle(action.targetId, action.id, newObstacle);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{action.title}</h3>
        {isOwner && (
          <div className="flex items-center space-x-2">
            <EditActionDialog
              action={action}
              onEdit={(updates) => updateAction(action.targetId, { ...action, ...updates })}
            />
            <DeleteActionDialog
              actionTitle={action.title}
              onDelete={() => deleteAction(action.targetId, action.id)}
            />
          </div>
        )}
      </div>
      
      <Tabs defaultValue="steps" className="space-y-6">
        <TabsList className="bg-gray-100/80 dark:bg-gray-700/50 p-1 rounded-lg">
          <TabsTrigger value="steps" className="rounded-md">
            Steps ({getCompletedSteps()}/{action.steps.length})
          </TabsTrigger>
          <TabsTrigger value="obstacles" className="rounded-md">
            Obstacles ({getResolvedObstacles()}/{action.obstacles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-4">
          {isOwner && (
            <div className="flex justify-end">
              <AddStepDialog
                target={target}
                action={action}
                onAddStep={handleAddStep}
              />
            </div>
          )}

          {action.steps.map((step, index) => (
            <StepDetails
              key={step.id}
              step={step}
              stepNumber={index + 1}
              onProgressUpdate={(progress) => 
                updateStep(action.targetId, action.id, { ...step, progress })
              }
              onRecommendationsGenerate={(recs) => 
                setRecommendations({ ...recommendations, [step.id]: recs })
              }
              onAddTask={(description, deadline) => 
                addTask(action.targetId, action.id, step.id, {
                  id: generateId(),
                  description,
                  completed: false,
                  deadline,
                  stepId: step.id
                })
              }
              onUpdateTask={(taskId, updates) =>
                updateTask(action.targetId, action.id, step.id, taskId, updates)
              }
              onDeleteTask={(taskId) =>
                deleteTask(action.targetId, action.id, step.id, taskId)
              }
              onUpdateTaskDeadline={(taskId, deadline) => 
                updateTaskDeadline(action.targetId, action.id, step.id, taskId, deadline)
              }
              onToggleTask={(taskId) => 
                toggleTask(action.targetId, action.id, step.id, taskId)
              }
              onUpdateStep={(updates) =>
                updateStep(action.targetId, action.id, { ...step, ...updates })
              }
              onDeleteStep={() =>
                deleteStep(action.targetId, action.id, step.id)
              }
              recommendations={recommendations[step.id]}
              isOwner={isOwner}
            />
          ))}

          {action.steps.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-gray-600 dark:text-gray-400">
                No steps added yet
                {isOwner && " - click 'Add Step' to get started"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="obstacles" className="space-y-4">
          {isOwner && (
            <div className="flex justify-end">
              <AddObstacleDialog onAddObstacle={handleAddObstacle} />
            </div>
          )}

          {action.obstacles.map((obstacle) => (
            <ObstacleDetails
              key={obstacle.id}
              obstacle={obstacle}
              onResolve={(resolution, date) => 
                resolveObstacle(action.targetId, action.id, obstacle.id, resolution, date)
              }
              onUnresolve={() => 
                unresolveObstacle(action.targetId, action.id, obstacle.id)
              }
              onUpdate={(updates) =>
                updateObstacle(action.targetId, action.id, obstacle.id, updates)
              }
              onDelete={() =>
                deleteObstacle(action.targetId, action.id, obstacle.id)
              }
              isOwner={isOwner}
            />
          ))}

          {action.obstacles.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-gray-600 dark:text-gray-400">
                No obstacles added yet
                {isOwner && " - click 'Add Obstacle' to get started"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}