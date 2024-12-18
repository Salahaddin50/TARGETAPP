import React from 'react';
import { Priority } from '../../types';

interface UrgencyTimeframesProps {
  onTimeframeChange: (priority: Priority, years: number) => void;
  timeframes: Record<Priority, number>;
}

export function UrgencyTimeframes({ onTimeframeChange, timeframes }: UrgencyTimeframesProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Urgency Timeframes (Years)</h3>
      <div className="grid grid-cols-3 gap-4">
        {(['high', 'medium', 'low'] as Priority[]).map((priority) => (
          <div key={priority} className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 capitalize">{priority}</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={timeframes[priority]}
              onChange={(e) => onTimeframeChange(priority, parseFloat(e.target.value))}
              className="w-full px-2 py-1 text-sm border rounded-lg 
                       bg-white dark:bg-gray-800 
                       border-gray-200 dark:border-gray-700 
                       focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                       focus:border-indigo-500 dark:focus:border-indigo-400
                       text-gray-900 dark:text-gray-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}