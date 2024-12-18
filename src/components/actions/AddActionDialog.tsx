import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../ui/Button';
import { X, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { Priority, Target } from '../../types';
import { generateActionSuggestionsWithAI } from '../../services/ai';
import { ChatGptPrompt } from './ChatGptPrompt';

interface AddActionDialogProps {
  target: Target;
  onAddAction: (action: {
    title: string;
    urgency: Priority;
    impact: Priority;
  }) => void;
}

export function AddActionDialog({ target, onAddAction }: AddActionDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [urgency, setUrgency] = useState<Priority>('medium');
  const [impact, setImpact] = useState<Priority>('medium');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAction({
      title,
      urgency,
      impact,
    });
    setTitle('');
    setUrgency('medium');
    setImpact('medium');
    setOpen(false);
  };

  const handleAIGenerate = async () => {
    setIsLoading(true);
    try {
      const newSuggestions = await generateActionSuggestionsWithAI(target);
      setSuggestions(newSuggestions);
      if (newSuggestions.length > 0) {
        const suggestion = newSuggestions[0];
        setTitle(suggestion.title);
        setUrgency(suggestion.urgency);
        setImpact(suggestion.impact);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className="shadow-sm hover:shadow-md transition-shadow">Add Action</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm dialog-overlay" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto dialog-content">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              Add New Action
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Action Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full"
                      placeholder="Enter action title"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-8"
                    onClick={handleAIGenerate}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4 mr-2" />
                    )}
                    Generate
                  </Button>
                </div>

                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Urgency
                  </label>
                  <select
                    id="urgency"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as Priority)}
                    className="w-full"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="impact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Impact
                  </label>
                  <select
                    id="impact"
                    value={impact}
                    onChange={(e) => setImpact(e.target.value as Priority)}
                    className="w-full"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Action</Button>
                </div>
              </form>

              {suggestions.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-300 mb-4">AI-Generated Suggestions:</h4>
                  <ul className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl"
                          onClick={() => {
                            setTitle(suggestion.title);
                            setUrgency(suggestion.urgency);
                            setImpact(suggestion.impact);
                          }}
                        >
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{suggestion.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Urgency: {suggestion.urgency}, Impact: {suggestion.impact}
                            </div>
                            {suggestion.reasoning && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {suggestion.reasoning}
                              </div>
                            )}
                          </div>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <ChatGptPrompt
                target={target}
                onCopy={(text) => {
                  // Handle copied text if needed
                }}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}