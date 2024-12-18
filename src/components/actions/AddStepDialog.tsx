import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../ui/Button';
import { X, Plus, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { generateStepSuggestions } from '../../services/stepSuggestions';
import { Target, Action } from '../../types';

interface AddStepDialogProps {
  target: Target;
  action: Action;
  onAddStep: (stepData: {
    description: string;
    tasks: { description: string; completed: boolean }[];
  }) => void;
}

export function AddStepDialog({ target, action, onAddStep }: AddStepDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onAddStep({
        description: description.trim(),
        tasks: []
      });
      setDescription('');
      setSuggestions([]);
      setOpen(false);
    }
  };

  const handleGenerateSteps = () => {
    const newSuggestions = generateStepSuggestions(target, action);
    setSuggestions(newSuggestions);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Step
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">
              Add New Step
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Step Description
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleGenerateSteps}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Steps
                </Button>
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Describe what needs to be done"
                required
              />
            </div>

            {suggestions.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Suggested Steps</h4>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-sm text-blue-800"
                    >
                      <span>{suggestion}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setDescription(suggestion)}
                      >
                        Use
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setDescription('');
                  setSuggestions([]);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Step
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}