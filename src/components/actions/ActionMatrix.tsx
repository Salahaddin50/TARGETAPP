import React, { useState } from 'react';
import { Action, Priority } from '../../types';
import { cn } from '../../lib/utils';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';
import { UrgencyTimeframes } from './UrgencyTimeframes';

interface ActionMatrixProps {
  actions: Action[];
  onActionSelect: (action: Action) => void;
  selectedActionId?: string;
}

const PRIORITY_ORDER: Priority[] = ['high', 'medium', 'low'];

export function ActionMatrix({ actions, onActionSelect, selectedActionId }: ActionMatrixProps) {
  const [selectedCell, setSelectedCell] = useState<{urgency: Priority; impact: Priority} | null>(null);
  const [timeframes, setTimeframes] = useState<Record<Priority, number>>({
    high: 1,
    medium: 3,
    low: 5
  });

  const getActionsForCell = (urgency: Priority, impact: Priority) => {
    return actions.filter(
      (action) => action.urgency === urgency && action.impact === impact
    );
  };

  const filteredActions = selectedCell
    ? actions.filter(
        (action) =>
          action.urgency === selectedCell.urgency &&
          action.impact === selectedCell.impact
      )
    : actions;

  const handleCellClick = (urgency: Priority, impact: Priority) => {
    const cellActions = getActionsForCell(urgency, impact);
    if (cellActions.length > 0) {
      setSelectedCell({ urgency, impact });
    }
  };

  const handleTimeframeChange = (priority: Priority, years: number) => {
    setTimeframes(prev => ({
      ...prev,
      [priority]: years
    }));
  };

  const getCellColor = (urgency: Priority, impact: Priority) => {
    if (urgency === 'high' && impact === 'high') {
      return 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30';
    }
    if (urgency === 'high' || impact === 'high') {
      return 'bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30';
    }
    if (urgency === 'medium' && impact === 'medium') {
      return 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30';
    }
    if (urgency === 'low' && impact === 'low') {
      return 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30';
    }
    return 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Priority Matrix</h3>
      </div>

      <UrgencyTimeframes 
        timeframes={timeframes}
        onTimeframeChange={handleTimeframeChange}
      />

      <div className="relative mt-6">
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Urgency</span>
        </div>
        
        <div className="ml-8">
          <div className="text-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Impact</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {/* Header row */}
            <div className="col-span-3 grid grid-cols-3 gap-2 mb-2">
              {PRIORITY_ORDER.map((impact) => (
                <div
                  key={impact}
                  className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 capitalize"
                >
                  {impact}
                </div>
              ))}
            </div>

            {/* Matrix cells */}
            {PRIORITY_ORDER.map((urgency) => (
              <React.Fragment key={urgency}>
                <div className="col-span-3 grid grid-cols-3 gap-2">
                  {PRIORITY_ORDER.map((impact) => {
                    const cellActions = getActionsForCell(urgency, impact);
                    const isSelected = selectedCell?.urgency === urgency && selectedCell?.impact === impact;
                    return (
                      <button
                        key={`${urgency}-${impact}`}
                        onClick={() => handleCellClick(urgency, impact)}
                        className={cn(
                          "p-3 rounded-xl transition-all min-h-[80px] text-center",
                          getCellColor(urgency, impact),
                          isSelected && "ring-2 ring-indigo-500 dark:ring-indigo-400",
                          cellActions.length === 0 && "opacity-50 cursor-default"
                        )}
                      >
                        <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {cellActions.length}
                        </span>
                        <span className="block text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {cellActions.length === 1 ? 'action' : 'actions'}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {timeframes[urgency]} {timeframes[urgency] === 1 ? 'year' : 'years'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Action List */}
      <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
          {selectedCell 
            ? `Actions (${filteredActions.length})`
            : 'All Actions'}
        </h4>
        <div className="space-y-2">
          {filteredActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onActionSelect(action)}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all",
                "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                selectedActionId === action.id && "bg-gray-100 dark:bg-gray-700"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{action.title}</span>
                  <div className="flex space-x-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      action.urgency === 'high' && "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300",
                      action.urgency === 'medium' && "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300",
                      action.urgency === 'low' && "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                    )}>
                      {action.urgency}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      action.impact === 'high' && "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300",
                      action.impact === 'medium' && "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300",
                      action.impact === 'low' && "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                    )}>
                      {action.impact}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Progress</span>
                    <span>{action.progress}%</span>
                  </div>
                  <Progress value={action.progress} className="h-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}