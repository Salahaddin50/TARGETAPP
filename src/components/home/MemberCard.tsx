import { Link } from 'react-router-dom';
import { User, Target } from '../../types';
import { countries } from '../../data/countries';
import { MapPin, Briefcase, Calendar, GraduationCap, Target as TargetIcon } from 'lucide-react';

interface MemberCardProps {
  user: User;
  targets: Target[];
}

export function MemberCard({ user, targets }: MemberCardProps) {
  const userTargets = targets.filter(target => target.userId === user.id);
  const completedTargets = userTargets.filter(target => target.progress === 100);

  return (
    <Link 
      to={`/users/${user.id}`} 
      className="block transition-transform hover:-translate-y-1"
    >
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow h-[320px] flex flex-col">
        <div className="flex items-center space-x-4">
          {user.profile?.photo ? (
            <img
              src={user.profile.photo}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xl font-semibold text-blue-600">
                {user.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {user.name}
            </h3>
            {user.profile?.profession && (
              <p className="text-sm text-gray-600 truncate">
                {user.profile.profession}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {user.profile?.age && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{user.profile.age} years old</span>
            </div>
          )}
          {user.profile?.country && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {countries.find(c => c.code === user.profile.country)?.name}
              </span>
            </div>
          )}
          {user.profile?.profession && (
            <div className="flex items-center text-sm text-gray-600">
              <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{user.profile.profession}</span>
            </div>
          )}
          {user.profile?.degree && (
            <div className="flex items-center text-sm text-gray-600">
              <GraduationCap className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{user.profile.degree}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <TargetIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{userTargets.length} targets</span>
            {completedTargets.length > 0 && (
              <span className="ml-1 text-green-600">
                ({completedTargets.length} completed)
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <div className="flex items-center text-blue-600">
            <span>View Profile</span>
          </div>
        </div>
      </div>
    </Link>
  );
}