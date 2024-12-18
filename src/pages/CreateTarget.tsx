import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import { generateId } from '../lib/utils';
import { ArrowLeft, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories, Category, Subcategory } from '../types/categories';

export function CreateTarget() {
  const navigate = useNavigate();
  const { addTarget, user } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedSubcategory(null);
  }, [selectedCategory]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-md inline-block mb-6">
            <Target className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Sign in Required</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Please sign in to create new targets and track your progress.
          </p>
          <Link to="/auth">
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              Sign In to Continue
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCategory || !selectedSubcategory) {
      setError('Please select both a category and subcategory');
      return;
    }

    const newTarget = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      categoryId: selectedCategory.id,
      subcategoryId: selectedSubcategory.id,
      progress: 0,
      actions: [],
      createdAt: new Date(),
      userId: user.id,
    };

    addTarget(newTarget);
    navigate(`/targets/${newTarget.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create New Target</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Define your goal and start tracking your progress
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory?.id || ''}
                onChange={(e) => {
                  const category = categories.find(c => c.id === e.target.value);
                  setSelectedCategory(category || null);
                }}
                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-indigo-500 dark:focus:border-indigo-400"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {selectedCategory && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {selectedCategory.description}
                </p>
              )}
            </div>

            {selectedCategory && (
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subcategory
                </label>
                <select
                  id="subcategory"
                  value={selectedSubcategory?.id || ''}
                  onChange={(e) => {
                    const subcategory = selectedCategory.subcategories.find(
                      s => s.id === e.target.value
                    );
                    setSelectedSubcategory(subcategory || null);
                  }}
                  className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-indigo-500 dark:focus:border-indigo-400"
                  required
                >
                  <option value="">Select a subcategory</option>
                  {selectedCategory.subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
                {selectedSubcategory && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedSubcategory.description}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-indigo-500 dark:focus:border-indigo-400"
                placeholder="Enter your target title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-indigo-500 dark:focus:border-indigo-400"
                placeholder="Describe your target and what you want to achieve"
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                Create Target
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}