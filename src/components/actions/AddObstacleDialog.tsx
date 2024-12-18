import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../ui/Button';
import { X, Plus, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { generateId } from '../../lib/utils';
import { generateObstacleResolutions } from '../../services/obstacleResolutions';

interface AddObstacleDialogProps {
  onAddObstacle: (obstacle: {
    description: string;
    resolution?: string;
    resolutionDate?: Date;
    suggestedResolutions?: string[];
  }) => void;
}

export function AddObstacleDialog({ onAddObstacle }: AddObstacleDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [resolution, setResolution] = useState('');
  const [resolutionDate, setResolutionDate] = useState('');
  const [suggestedObstacles, setSuggestedObstacles] = useState<string[]>([]);
  const [suggestedResolutions, setSuggestedResolutions] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  const validateForm = () => {
    const isValidNow = Boolean(
      description.trim() &&
      resolution.trim() &&
      resolutionDate
    );
    setIsValid(isValidNow);
    return isValidNow;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAddObstacle({
        description: description.trim(),
        resolution: resolution.trim(),
        resolutionDate: new Date(resolutionDate),
        suggestedResolutions
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setDescription('');
    setResolution('');
    setResolutionDate('');
    setSuggestedObstacles([]);
    setSuggestedResolutions([]);
    setIsValid(false);
    setOpen(false);
  };

  const handleGenerateObstacles = () => {
    // In a real app, this would use AI to generate contextual obstacles
    const mockObstacles = [
      'Limited resources available for implementation',
      'Technical complexity exceeding initial estimates',
      'Dependencies on external systems causing delays',
      'Skill gap in the team for specific requirements',
      'Conflicting priorities with other initiatives'
    ];
    setSuggestedObstacles(mockObstacles);
  };

  const handleGenerateResolutions = () => {
    if (description.trim()) {
      const mockObstacle = {
        id: generateId(),
        description: description.trim(),
        resolved: false,
        actionId: '',
      };
      const newResolutions = generateObstacleResolutions(mockObstacle);
      setSuggestedResolutions(newResolutions);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Obstacle
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">
              Add New Obstacle
            </Dialog.Title>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} onChange={validateForm} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Obstacle Description
              </label>
              <div className="mt-1 flex space-x-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe the obstacle or challenge"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateObstacles}
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {suggestedObstacles.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-blue-900 mb-2">Suggested Obstacles</h5>
                <ul className="space-y-2">
                  {suggestedObstacles.map((obstacle, index) => (
                    <li key={index} className="flex items-center justify-between text-sm text-blue-800">
                      <span>{obstacle}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDescription(obstacle)}
                      >
                        Use
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Proposed Solution
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleGenerateResolutions}
                  disabled={!description.trim()}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Solutions
                </Button>
              </div>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Describe how you plan to overcome this obstacle"
                required
              />
            </div>

            {suggestedResolutions.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-green-900 mb-2">Suggested Solutions</h5>
                <ul className="space-y-2">
                  {suggestedResolutions.map((solution, index) => (
                    <li key={index} className="flex items-center justify-between text-sm text-green-800">
                      <span>{solution}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setResolution(solution)}
                      >
                        Use
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Resolution Date
              </label>
              <input
                type="date"
                value={resolutionDate}
                onChange={(e) => setResolutionDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid}>
                Add Obstacle
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}