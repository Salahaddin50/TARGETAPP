import React, { useState, useEffect } from 'react';
import { Step, Task } from '../../types';
import { Button } from '../ui/Button';
import { Wand2, Plus, Check, Calendar, Pencil, Trash2 } from 'lucide-react';
import { generateStepRecommendations } from '../../services/stepRecommendations';
import { EditStepDialog } from '../dialogs/EditStepDialog';
import { DeleteStepDialog } from '../dialogs/DeleteStepDialog';
import { EditTaskDialog } from '../dialogs/EditTaskDialog';
import { DeleteTaskDialog } from '../dialogs/DeleteTaskDialog';

interface StepDetailsProps {
  step: Step;
  stepNumber: number;
  onProgressUpdate: (progress: number) => void;
  onRecommendationsGenerate: (recommendations: string[]) => void;
  onAddTask: (description: string, deadline?: Date) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskDeadline: (taskId: string, deadline?: Date) => void;
  onToggleTask: (taskId: string) => void;
  onUpdateStep: (updates: Partial<Step>) => void;
  onDeleteStep: () => void;
  recommendations?: string[];
  isOwner: boolean;
}

export function StepDetails({
  step,
  stepNumber,
  onProgressUpdate,
  onRecommendationsGenerate,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateTaskDeadline,
  onToggleTask,
  onUpdateStep,
  onDeleteStep,
  recommendations,
  isOwner,
}: StepDetailsProps) {
  const [newTask, setNewTask] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const calculateProgress = () => {
    if (!step.tasks || step.tasks.length === 0) {
      return 0;
    }
    const completedTasks = step.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / step.tasks.length) * 100);
  };

  useEffect(() => {
    const progress = calculateProgress();
    onProgressUpdate(progress);
  }, [step.tasks]);

  const handleGenerateRecommendations = () => {
    const newRecommendations = generateStepRecommendations(step);
    onRecommendationsGenerate(newRecommendations);
    setShowRecommendations(true);
  };

  const handleAddTask = () => {
    if (!isOwner || !newTask.trim()) return;
    
    const deadline = newTaskDeadline ? new Date(newTaskDeadline) : undefined;
    onAddTask(newTask.trim(), deadline);
    setNewTask('');
    setNewTaskDeadline('');
  };

  const handleAddRecommendationAsTask = (recommendation: string) => {
    if (!isOwner) return;
    onAddTask(recommendation);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
            {stepNumber}
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">{step.description}</h4>
              {isOwner && (
                <div className="flex items-center space-x-2">
                  <EditStepDialog step={step} onEdit={onUpdateStep} />
                  <DeleteStepDialog
                    stepDescription={step.description}
                    onDelete={onDeleteStep}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span className="font-medium text-blue-600">
                {calculateProgress()}%
              </span>
              <span className="mx-2">•</span>
              <span>
                {step.tasks?.filter((t) => t.completed).length || 0}/
                {step.tasks?.length || 0} tasks completed
              </span>
            </div>
          </div>
        </div>
        {isOwner && (
          <Button variant="outline" size="sm" onClick={handleGenerateRecommendations}>
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Tips
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {recommendations && showRecommendations && isOwner && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-blue-900 mb-2">
              Recommendations
            </h5>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between text-sm text-blue-800"
                >
                  <span>{rec}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddRecommendationAsTask(rec)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Tasks ({step.tasks?.filter((t) => t.completed).length || 0}/
              {step.tasks?.length || 0})
            </span>
          </div>
          <div className="space-y-2">
            {isOwner && (
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task"
                  className="flex-1"
                />
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="date"
                      value={newTaskDeadline}
                      onChange={(e) => setNewTaskDeadline(e.target.value)}
                      className="w-full"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <Button onClick={handleAddTask}>Add Task</Button>
                </div>
              </div>
            )}
            {step.tasks && step.tasks.length > 0 && (
              <ul className="space-y-2">
                {step.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={task.completed ? 'line-through text-gray-400' : ''}
                        >
                          {task.description}
                        </span>
                        <div className="flex items-center space-x-2">
                          {isOwner && (
                            <>
                              <EditTaskDialog
                                task={task}
                                onEdit={(updates) => onUpdateTask(task.id, updates)}
                              />
                              <DeleteTaskDialog
                                taskDescription={task.description}
                                onDelete={() => onDeleteTask(task.id)}
                              />
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => isOwner && onToggleTask(task.id)}
                            disabled={!isOwner}
                          >
                            <Check
                              className={`h-4 w-4 ${
                                task.completed ? 'text-green-500' : 'text-gray-400'
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                      {editingTaskId === task.id && isOwner ? (
                        <input
                          type="date"
                          value={
                            task.deadline
                              ? new Date(task.deadline).toISOString().split('T')[0]
                              : ''
                          }
                          onChange={(e) => {
                            const newDeadline = e.target.value
                              ? new Date(e.target.value)
                              : undefined;
                            onUpdateTaskDeadline(task.id, newDeadline);
                            setEditingTaskId(null);
                          }}
                          className="mt-1 block w-full text-xs"
                          min={new Date().toISOString().split('T')[0]}
                          autoFocus
                          onBlur={() => setEditingTaskId(null)}
                        />
                      ) : (
                        <button
                          onClick={() => isOwner && setEditingTaskId(task.id)}
                          className="flex items-center mt-1 text-xs text-gray-500 hover:text-blue-500"
                          disabled={!isOwner}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {task.deadline ? formatDate(task.deadline) : 'Add deadline'}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}