import { SearchBar } from './SearchBar';
import { FilterSection } from './FilterSection';
import { Category } from '../../types/categories';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: SearchAndFilterProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md p-4 mb-8 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>
        <div className="flex-1">
          <FilterSection
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
          />
        </div>
      </div>
    </div>
  );
}