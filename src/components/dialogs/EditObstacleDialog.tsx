import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../ui/Button';
import { X, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Obstacle } from '../../types';

interface EditObstacleDialogProps {
  obstacle: Obstacle;
  onEdit: (updates: Partial<Obstacle>) => void;
}

export function EditObstacleDialog({ obstacle, onEdit }: EditObstacleDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(obstacle.description);
  const [resolution, setResolution] = useState(obstacle.resolution || '');
  const [resolutionDate, setResolutionDate] = useState(
    obstacle.resolutionDate ? new Date(obstacle.resolutionDate).toISOString().split('T')[0] : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit({
      description: description.trim(),
      resolution: resolution.trim() || undefined,
      resolutionDate: resolutionDate ? new Date(resolutionDate) : undefined,
    });
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">
              Edit Obstacle
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe the obstacle"
                required
              />
            </div>

            <div>
              <label htmlFor="resolution" className="block text-sm font-medium text-gray-700">
                Resolution
              </label>
              <textarea
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe how the obstacle was resolved (if applicable)"
              />
            </div>

            <div>
              <label htmlFor="resolutionDate" className="block text-sm font-medium text-gray-700">
                Resolution Date
              </label>
              <input
                type="date"
                id="resolutionDate"
                value={resolutionDate}
                onChange={(e) => setResolutionDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}