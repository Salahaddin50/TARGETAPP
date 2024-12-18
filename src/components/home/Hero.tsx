import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { LogIn, Target, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex p-4 mb-8 rounded-2xl bg-white dark:bg-gray-800 shadow-md">
          <Target className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
          Welcome to Target Achiever
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Set meaningful goals, track your progress, and achieve your targets with our powerful management tool.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link to="/auth">
            <Button size="lg" className="text-base px-8 shadow-lg hover:shadow-xl transition-shadow">
              <LogIn className="h-5 w-5 mr-2" />
              Get Started
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="text-base px-8">
              Learn More
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}