import React, { useState } from 'react';
import { Obstacle } from '../../types';
import { Button } from '../ui/Button';
import { Calendar, Check, Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import { generateObstacleResolutions } from '../../services/obstacleResolutions';
import { EditObstacleDialog } from '../dialogs/EditObstacleDialog';
import { DeleteObstacleDialog } from '../dialogs/DeleteObstacleDialog';

interface ObstacleDetailsProps {
  obstacle: Obstacle;
  onResolve: (resolution: string, date: Date) => void;
  onUnresolve: () => void;
  onUpdate: (updates: Partial<Obstacle>) => void;
  onDelete: () => void;
  isOwner: boolean;
}

export function ObstacleDetails({
  obstacle,
  onResolve,
  onUnresolve,
  onUpdate,
  onDelete,
  isOwner,
}: ObstacleDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [resolution, setResolution] = useState(obstacle.resolution || '');
  const [resolutionDate, setResolutionDate] = useState(
    obstacle.resolutionDate
      ? new Date(obstacle.resolutionDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [suggestedResolutions, setSuggestedResolutions] = useState<string[]>(
    obstacle.suggestedResolutions || []
  );

  const handleGenerateResolutions = () => {
    const newResolutions = generateObstacleResolutions(obstacle);
    setSuggestedResolutions(newResolutions);
  };

  const handleResolve = () => {
    if (!isOwner || !resolution.trim()) return;
    onResolve(resolution.trim(), new Date(resolutionDate));
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <div>
            <p className="text-sm text-gray-600">{obstacle.description}</p>
            {obstacle.resolved && obstacle.resolutionDate && (
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                Resolved on {formatDate(obstacle.resolutionDate)}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isOwner && (
            <>
              <EditObstacleDialog obstacle={obstacle} onEdit={onUpdate} />
              <DeleteObstacleDialog
                obstacleDescription={obstacle.description}
                onDelete={onDelete}
              />
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={obstacle.resolved ? onUnresolve : handleResolve}
            className={obstacle.resolved ? 'text-green-500' : 'text-gray-400'}
            disabled={!isOwner}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isExpanded && !obstacle.resolved && isOwner && (
        <div className="mt-4 space-y-4 pl-8">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleGenerateResolutions}>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Solutions
            </Button>
          </div>

          {suggestedResolutions.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-blue-900 mb-2">
                Suggested Resolutions
              </h5>
              <ul className="space-y-2">
                {suggestedResolutions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm text-blue-800"
                  >
                    <span>{suggestion}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setResolution(suggestion)}
                    >
                      Use
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resolution
              </label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Describe how you plan to resolve this obstacle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Resolution Date
              </label>
              <input
                type="date"
                value={resolutionDate}
                onChange={(e) => setResolutionDate(e.target.value)}
                className="mt-1 block w-full"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleResolve}>
                <Check className="h-4 w-4 mr-2" />
                Mark as Resolved
              </Button>
            </div>
          </div>
        </div>
      )}

      {isExpanded && obstacle.resolved && obstacle.resolution && (
        <div className="mt-4 pl-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-green-900 mb-2">Resolution</h5>
            <p className="text-sm text-green-800">{obstacle.resolution}</p>
          </div>
        </div>
      )}
    </div>
  );
}