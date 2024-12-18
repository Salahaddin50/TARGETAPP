import { Target, User } from '../../types';
import { TargetCard } from './TargetCard';
import { Target as TargetIcon } from 'lucide-react';

interface TargetGridProps {
  targets: Target[];
  users: User[];
  currentUser: User | null;
  onAuthRequired: () => void;
}

export function TargetGrid({ targets, users, currentUser, onAuthRequired }: TargetGridProps) {
  const getUserInfo = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  if (targets.length === 0) {
    return (
      <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <TargetIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No targets found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {targets.map((target) => {
        const targetUser = getUserInfo(target.userId);
        if (!targetUser) return null;
        return (
          <TargetCard
            key={target.id}
            target={target}
            user={targetUser}
            currentUser={currentUser}
            onAuthRequired={onAuthRequired}
          />
        );
      })}
    </div>
  );
}