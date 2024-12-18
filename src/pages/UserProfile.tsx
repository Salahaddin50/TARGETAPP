import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { UserCard } from '../components/home/UserCard';
import { TargetCard } from '../components/home/TargetCard';

export function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { users, targets } = useStore();
  const user = users.find(u => u.id === id);
  const userTargets = targets.filter(target => target.userId === id);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
          <Link to="/">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const activeTargets = userTargets.filter(target => target.progress < 100);
  const completedTargets = userTargets.filter(target => target.progress === 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <UserCard user={user} />
          
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {userTargets.length}
                </div>
                <div className="text-sm text-blue-600">Total Targets</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700">
                  {completedTargets.length}
                </div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-700">
                  {activeTargets.length}
                </div>
                <div className="text-sm text-yellow-600">In Progress</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {userTargets.length > 0 
                    ? Math.round(completedTargets.length / userTargets.length * 100)
                    : 0}%
                </div>
                <div className="text-sm text-purple-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {activeTargets.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Targets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTargets.map(target => (
                  <TargetCard key={target.id} target={target} user={user} />
                ))}
              </div>
            </section>
          )}

          {completedTargets.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Targets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedTargets.map(target => (
                  <TargetCard key={target.id} target={target} user={user} />
                ))}
              </div>
            </section>
          )}

          {userTargets.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">
                No targets yet
              </h3>
              <p className="mt-2 text-gray-600">
                This user hasn't created any targets
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}