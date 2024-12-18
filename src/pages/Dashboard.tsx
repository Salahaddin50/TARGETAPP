import { useStore } from '../store/useStore';
import { TargetCard } from '../components/TargetCard';
import { Button } from '../components/ui/Button';
import { Plus, Target, LogIn, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { targets, user } = useStore();
  const userTargets = targets.filter((target) => target.userId === user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="bg-white p-3 rounded-2xl shadow-md inline-block mb-6">
            <Target className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Target Achiever</h2>
          <p className="text-lg text-gray-600 mb-8">
            Set goals, track progress, and achieve your targets with our powerful management tool.
          </p>
          <Link to="/auth">
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <LogIn className="h-5 w-5 mr-2" />
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const inProgressTargets = userTargets.filter(target => target.progress < 100);
  const completedTargets = userTargets.filter(target => target.progress === 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
            <p className="text-gray-600">
              Track and manage your personal goals
            </p>
          </div>
          <Link to="/targets/new">
            <Button className="shadow-md hover:shadow-lg transition-shadow">
              <Plus className="h-4 w-4 mr-2" />
              New Target
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Total Targets</h3>
              <Target className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{userTargets.length}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">In Progress</h3>
              <ArrowRight className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{inProgressTargets.length}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-lg">✓</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{completedTargets.length}</p>
          </div>
        </div>

        {userTargets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              No targets created yet
            </h3>
            <p className="text-gray-600 mb-8">
              Create your first target to start tracking your progress
            </p>
            <Link to="/targets/new">
              <Button className="shadow-md hover:shadow-lg transition-shadow">
                <Plus className="h-4 w-4 mr-2" />
                Create Target
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {inProgressTargets.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">In Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressTargets.map((target) => (
                    <TargetCard key={target.id} target={target} />
                  ))}
                </div>
              </section>
            )}

            {completedTargets.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedTargets.map((target) => (
                    <TargetCard key={target.id} target={target} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}