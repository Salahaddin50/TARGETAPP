import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Lock } from 'lucide-react';
import { Progress } from '../components/ui/Progress';
import { AddActionDialog } from '../components/actions/AddActionDialog';
import { ActionMatrix } from '../components/actions/ActionMatrix';
import { ActionView } from '../components/actions/ActionView';
import { generateId } from '../lib/utils';
import { Priority, Action } from '../types';

interface LocationState {
  selectedActionId?: string;
}

export function TargetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { targets, addAction, user } = useStore();
  const [selectedActionId, setSelectedActionId] = useState<string>();
  const target = targets.find((t) => t.id === id);

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.selectedActionId) {
      setSelectedActionId(state.selectedActionId);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (!target) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Target not found</h2>
          <Link to="/">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view target details
          </p>
          <Link to="/auth">
            <Button>
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user.id === target.userId;

  const handleAddAction = (actionData: {
    title: string;
    urgency: Priority;
    impact: Priority;
  }) => {
    if (!isOwner) return;
    
    const newAction = {
      id: generateId(),
      title: actionData.title,
      urgency: actionData.urgency,
      impact: actionData.impact,
      steps: [],
      obstacles: [],
      progress: 0,
      targetId: target.id,
    };
    
    addAction(target.id, newAction);
  };

  const selectedAction = target.actions.find(
    (action) => action.id === selectedActionId
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{target.title}</h1>
            <p className="mt-2 text-gray-600">{target.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Overall Progress
            </h2>
            <span className="text-gray-600">{target.progress}%</span>
          </div>
          <Progress value={target.progress} />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Actions</h2>
          {isOwner && <AddActionDialog target={target} onAddAction={handleAddAction} />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActionMatrix
            actions={target.actions}
            onActionSelect={(action: Action) => setSelectedActionId(action.id)}
            selectedActionId={selectedActionId}
          />
          {selectedAction && (
            <ActionView 
              action={selectedAction} 
              target={target} 
              isOwner={isOwner}
            />
          )}
        </div>
      </div>
    </div>
  );
}