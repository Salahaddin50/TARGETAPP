import { Target } from '../types';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditTargetDialog } from './dialogs/EditTargetDialog';
import { DeleteTargetDialog } from './dialogs/DeleteTargetDialog';
import { useStore } from '../store/useStore';
import { getCategory, getSubcategory } from '../types/categories';

interface TargetCardProps {
  target: Target;
}

export function TargetCard({ target }: TargetCardProps) {
  const { updateTarget, deleteTarget, user } = useStore();
  
  const category = getCategory(target.categoryId);
  const subcategory = getSubcategory(target.categoryId, target.subcategoryId);
  const isOwner = user?.id === target.userId;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {target.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {target.description}
          </p>
          <div className="flex items-center mt-2 text-sm space-x-2">
            {category && subcategory && (
              <>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                  {category.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {subcategory.name}
                </span>
              </>
            )}
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center space-x-2 ml-4">
            <EditTargetDialog
              target={target}
              onEdit={(updates) => updateTarget(target.id, updates)}
            />
            <DeleteTargetDialog
              targetTitle={target.title}
              onDelete={() => deleteTarget(target.id)}
            />
            <Link to={`/targets/${target.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Progress</span>
          <span>{target.progress}%</span>
        </div>
        <Progress value={target.progress} />
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {target.actions.length} {target.actions.length === 1 ? 'Action' : 'Actions'}
          </span>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {new Date(target.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}