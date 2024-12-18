import { User } from '../../types';
import { countries } from '../../data/countries';
import { MapPin, Briefcase, GraduationCap, Calendar, Link as LinkIcon } from 'lucide-react';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {user.profile?.photo ? (
          <img
            src={user.profile.photo}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-2xl font-semibold text-blue-600">
              {user.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {user.name}
          </h3>
          <div className="mt-1 space-y-1">
            {user.profile?.country && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{countries.find(c => c.code === user.profile.country)?.name}</span>
              </div>
            )}
            {user.profile?.profession && (
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{user.profile.profession}</span>
              </div>
            )}
            {user.profile?.degree && (
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{user.profile.degree}</span>
              </div>
            )}
            {user.profile?.age && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{user.profile.age} years old</span>
              </div>
            )}
            {user.profile?.linkedIn && (
              <div className="flex items-center text-sm">
                <LinkIcon className="h-4 w-4 mr-2 flex-shrink-0 text-blue-600" />
                <a
                  href={user.profile.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  );
}