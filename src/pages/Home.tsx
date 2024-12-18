import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { SearchAndFilter } from '../components/home/SearchAndFilter';
import { TargetGrid } from '../components/home/TargetGrid';
import { categories } from '../types/categories';

export function Home() {
  const navigate = useNavigate();
  const { targets, users, user } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filteredTargets = targets.filter(target => {
    const matchesSearch = target.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      target.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || target.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTargets = [...filteredTargets].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return b.progress - a.progress;
      case 'actions':
        return b.actions.length - a.actions.length;
      default: // recent
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {!user && <Hero />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <TargetGrid 
          targets={sortedTargets}
          users={users}
          currentUser={user}
          onAuthRequired={() => navigate('/auth')}
        />
      </div>
    </div>
  );
}