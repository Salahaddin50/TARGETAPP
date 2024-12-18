import { User, Target } from '../../types';
import { MemberCard } from './MemberCard';

interface NewUsersSectionProps {
  users: User[];
  targets: Target[];
}

export function NewUsersSection({ users, targets }: NewUsersSectionProps) {
  const recentUsers = users
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">New Members</h2>
      <div className="space-y-4">
        {recentUsers.map((user) => (
          <MemberCard key={user.id} user={user} targets={targets} />
        ))}
      </div>
    </div>
  );
}