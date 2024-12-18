import { useStore } from '../store/useStore';
import { Priority } from '../types';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { 
  Target, 
  AlertTriangle, 
  AlertCircle, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Clock,
  ChevronRight,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Statistics() {
  const { targets, user } = useStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-md inline-block mb-6">
            <Target className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Sign in Required</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Please sign in to view your statistics and progress tracking.
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

  const userTargets = targets.filter(target => target.userId === user.id);

  const getTotalProgress = () => {
    if (userTargets.length === 0) return 0;
    return Math.round(
      userTargets.reduce((sum, target) => sum + target.progress, 0) / userTargets.length
    );
  };

  const getAllTasks = () => {
    return userTargets.flatMap(target =>
      target.actions.flatMap(action =>
        action.steps.flatMap(step =>
          (step.tasks || []).map(task => ({
            ...task,
            action,
            step,
            target
          }))
        )
      )
    );
  };

  const getTasksByPriority = () => {
    const tasks = getAllTasks();
    const priorityMap: Record<Priority, typeof tasks> = {
      high: [],
      medium: [],
      low: []
    };

    tasks.forEach(task => {
      if (task.action.urgency === 'high' || task.action.impact === 'high') {
        priorityMap.high.push(task);
      } else if (task.action.urgency === 'medium' || task.action.impact === 'medium') {
        priorityMap.medium.push(task);
      } else {
        priorityMap.low.push(task);
      }
    });

    return priorityMap;
  };

  const getUpcomingTasks = () => {
    const tasks = getAllTasks().filter(task => !task.completed);
    
    const tasksWithDeadlines = tasks.filter(task => task.deadline);
    const tasksWithoutDeadlines = tasks.filter(task => !task.deadline);

    const sortedTasksWithDeadlines = tasksWithDeadlines.sort((a, b) => {
      if (!a.deadline || !b.deadline) return 0;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

    return [...sortedTasksWithDeadlines, ...tasksWithoutDeadlines].slice(0, 10);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (date: Date) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const navigateToTargetAction = (targetId: string, actionId: string) => {
    navigate(`/targets/${targetId}`, { state: { selectedActionId: actionId } });
  };

  const tasksByPriority = getTasksByPriority();
  const upcomingTasks = getUpcomingTasks();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Statistics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and manage tasks effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {userTargets.length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Targets</h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {tasksByPriority.high.length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority Tasks</h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {getAllTasks().filter(t => t.completed).length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tasks</h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-purple-600 dark:text-purple-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {upcomingTasks.length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tasks</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Overall Progress</h2>
            <div className="space-y-4">
              {userTargets.map(target => (
                <Link key={target.id} to={`/targets/${target.id}`}>
                  <div className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 -mx-3 rounded-xl transition-colors">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-medium">
                        {target.title}
                      </span>
                      <div className="flex items-center">
                        <span>{target.progress}%</span>
                        <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <Progress value={target.progress} />
                  </div>
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white mb-2">
                  <span>Total Progress</span>
                  <span>{getTotalProgress()}%</span>
                </div>
                <Progress value={getTotalProgress()} className="h-3" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Tasks</h2>
            <div className="space-y-4">
              {upcomingTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => navigateToTargetAction(task.target.id, task.action.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {task.description}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.target.title} • {task.action.title}
                        </span>
                        {task.deadline ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                            {formatDate(task.deadline)}
                          </span>
                        ) : (
                          <span className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            <HelpCircle className="h-3 w-3 mr-1" />
                            No deadline
                          </span>
                        )}
                      </div>
                    </div>
                    {task.deadline && (
                      <div className="ml-4 text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {getDaysUntil(task.deadline)} days
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">remaining</div>
                      </div>
                    )}
                    <ChevronRight className="h-4 w-4 ml-4 text-gray-400" />
                  </div>
                </button>
              ))}
              {upcomingTasks.length === 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">No tasks found</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Tasks by Priority</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <ArrowUp className="h-4 w-4 text-red-500 dark:text-red-400" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">High Priority</h3>
                </div>
                <div className="space-y-2">
                  {tasksByPriority.high.map(task => (
                    <button
                      key={task.id}
                      onClick={() => navigateToTargetAction(task.target.id, task.action.id)}
                      className="w-full text-left"
                    >
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors">
                        <p className="text-sm text-red-900 dark:text-red-300">{task.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-red-700 dark:text-red-400">{task.target.title}</p>
                          <ChevronRight className="h-4 w-4 text-red-400 dark:text-red-500" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <ArrowUp className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Medium Priority</h3>
                </div>
                <div className="space-y-2">
                  {tasksByPriority.medium.map(task => (
                    <button
                      key={task.id}
                      onClick={() => navigateToTargetAction(task.target.id, task.action.id)}
                      className="w-full text-left"
                    >
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-xl transition-colors">
                        <p className="text-sm text-yellow-900 dark:text-yellow-300">{task.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-yellow-700 dark:text-yellow-400">{task.target.title}</p>
                          <ChevronRight className="h-4 w-4 text-yellow-400 dark:text-yellow-500" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <ArrowDown className="h-4 w-4 text-green-500 dark:text-green-400" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Low Priority</h3>
                </div>
                <div className="space-y-2">
                  {tasksByPriority.low.map(task => (
                    <button
                      key={task.id}
                      onClick={() => navigateToTargetAction(task.target.id, task.action.id)}
                      className="w-full text-left"
                    >
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-colors">
                        <p className="text-sm text-green-900 dark:text-green-300">{task.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-green-700 dark:text-green-400">{task.target.title}</p>
                          <ChevronRight className="h-4 w-4 text-green-400 dark:text-green-500" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}