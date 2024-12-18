import { Button } from '../ui/Button';
import { LogOut, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';

export function UserMenu() {
  const { user, setUser } = useStore();

  const handleSignOut = () => {
    setUser(null);
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-4">
      <Link 
        to="/profile"
        className="flex items-center space-x-3 group"
      >
        {user.profile?.photo ? (
          <img
            src={user.profile.photo}
            alt={user.name}
            className="w-8 h-8 rounded-lg object-cover ring-2 ring-white dark:ring-gray-800 group-hover:ring-indigo-100 dark:group-hover:ring-indigo-900 transition-all"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center ring-2 ring-white dark:ring-gray-800 group-hover:ring-indigo-100 dark:group-hover:ring-indigo-900 transition-all">
            <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {user.name}
        </span>
      </Link>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleSignOut}
        className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}