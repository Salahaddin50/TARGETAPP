import { Constraint } from '../../types';
import { Button } from '../ui/Button';
import { AlertTriangle, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { EditConstraintDialog } from '../dialogs/EditConstraintDialog';
import { DeleteConstraintDialog } from '../dialogs/DeleteConstraintDialog';

interface ConstraintListProps {
  constraints: Constraint[];
  onUpdateConstraint: (constraintId: string, updates: Partial<Constraint>) => void;
  onDeleteConstraint: (constraintId: string) => void;
}

export function ConstraintList({
  constraints,
  onUpdateConstraint,
  onDeleteConstraint,
}: ConstraintListProps) {
  const [expandedConstraint, setExpandedConstraint] = useState<string | null>(null);

  const getStatusColor = (status: Constraint['status']) => {
    switch (status) {
      case 'active':
        return 'text-red-600 bg-red-50';
      case 'mitigated':
        return 'text-yellow-600 bg-yellow-50';
      case 'resolved':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactColor = (impact: Constraint['impact']) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      {constraints.map((constraint) => (
        <div key={constraint.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setExpandedConstraint(
                    expandedConstraint === constraint.id ? null : constraint.id
                  )
                }
              >
                {expandedConstraint === constraint.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <div>
                <p className="text-sm text-gray-600">{constraint.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(constraint.status)}`}>
                    {constraint.status}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactColor(constraint.impact)}`}>
                    {constraint.impact} impact
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {constraint.type}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <EditConstraintDialog
                constraint={constraint}
                onEdit={(updates) => onUpdateConstraint(constraint.id, updates)}
              />
              <DeleteConstraintDialog
                constraintDescription={constraint.description}
                onDelete={() => onDeleteConstraint(constraint.id)}
              />
            </div>
          </div>

          {expandedConstraint === constraint.id && constraint.resolution && (
            <div className="mt-4 pl-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Resolution</h5>
                <p className="text-sm text-gray-600">{constraint.resolution}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}