import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../ui/Button';
import { X, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Target } from '../../types';
import { categories, getCategory } from '../../types/categories';

interface EditTargetDialogProps {
  target: Target;
  onEdit: (updatedTarget: Partial<Target>) => void;
}

export function EditTargetDialog({ target, onEdit }: EditTargetDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(target.title);
  const [description, setDescription] = useState(target.description);
  const [categoryId, setCategoryId] = useState(target.categoryId);
  const [subcategoryId, setSubcategoryId] = useState(target.subcategoryId);

  useEffect(() => {
    // Reset form when dialog opens
    if (open) {
      setTitle(target.title);
      setDescription(target.description);
      setCategoryId(target.categoryId);
      setSubcategoryId(target.subcategoryId);
    }
  }, [open, target]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit({
      title: title.trim(),
      description: description.trim(),
      categoryId,
      subcategoryId,
    });
    setOpen(false);
  };

  const selectedCategory = getCategory(categoryId);

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
              Edit Target
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => {
                  const newCategoryId = e.target.value;
                  setCategoryId(newCategoryId);
                  // Reset subcategory when category changes
                  setSubcategoryId('');
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && (
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <select
                  id="subcategory"
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a subcategory</option>
                  {selectedCategory.subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Target Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter target title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe your target"
                required
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