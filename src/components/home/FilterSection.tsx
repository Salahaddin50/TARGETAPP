import { Category } from '../../types/categories';

interface FilterSectionProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function FilterSection({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: FilterSectionProps) {
  return (
    <div className="flex items-center space-x-4">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="flex-1 px-3 py-2.5 rounded-xl 
                  border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-800/50
                  focus:bg-white dark:focus:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                  focus:border-transparent transition-colors"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="flex-1 px-3 py-2.5 rounded-xl 
                  border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-800/50
                  focus:bg-white dark:focus:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                  focus:border-transparent transition-colors"
      >
        <option value="recent">Most Recent</option>
        <option value="progress">Highest Progress</option>
        <option value="actions">Most Actions</option>
      </select>
    </div>
  );
}