import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { User } from '../types';
import { Pencil, Link as LinkIcon, Upload, Check, ArrowLeft } from 'lucide-react';
import { countries } from '../data/countries';
import { Link } from 'react-router-dom';

export function Profile() {
  const { user, setUser } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, string>>({});

  if (!user) return null;

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValues({ ...tempValues, [field]: value });
  };

  const handleSave = (field: string) => {
    const value = tempValues[field];
    if (!value?.trim()) return;

    const profile = user.profile || {};
    const updates = {
      ...user,
      ...(field === 'name' ? { name: value } : {}),
      profile: {
        ...profile,
        ...(field !== 'name' ? { [field]: field === 'age' ? parseInt(value) : value } : {}),
      },
    };

    setUser(updates);
    setEditingField(null);
    setTempValues({});
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // In a real app, implement photo upload logic here
      const photoURL = URL.createObjectURL(file);
      
      setUser({
        ...user,
        profile: {
          ...user.profile,
          photo: photoURL,
        },
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  const renderEditableField = (
    label: string,
    field: string,
    value: string | number | undefined,
    type: string = 'text'
  ) => {
    const isEditing = editingField === field;
    const displayValue = value?.toString() || '';

    return (
      <div className="relative bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-500 mb-1">
          {label}
        </label>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            {field === 'country' ? (
              <select
                value={tempValues[field]}
                onChange={(e) => setTempValues({ ...tempValues, [field]: e.target.value })}
                className="flex-1 rounded-lg border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                autoFocus
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={tempValues[field]}
                onChange={(e) => setTempValues({ ...tempValues, [field]: e.target.value })}
                className="flex-1 rounded-lg border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                autoFocus
                min={type === 'number' ? '0' : undefined}
                max={type === 'number' && field === 'age' ? '120' : undefined}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSave(field)}
              className="text-green-600"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <span className="text-gray-900">
              {field === 'country' && displayValue
                ? countries.find((c) => c.code === displayValue)?.name || displayValue
                : displayValue || <span className="text-gray-400">Not set</span>}
              {field === 'age' && displayValue && ' years'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(field, displayValue)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h1>

          <div className="space-y-8">
            {/* Photo Section */}
            <div className="flex items-center space-x-6 pb-8 border-b border-gray-100">
              {user.profile?.photo ? (
                <img
                  src={user.profile.photo}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-indigo-100 flex items-center justify-center ring-2 ring-white shadow-md">
                  <span className="text-3xl font-semibold text-indigo-600">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Change Photo'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderEditableField('Full Name', 'name', user.name)}
              {renderEditableField('Age', 'age', user.profile?.age, 'number')}
              {renderEditableField('Country', 'country', user.profile?.country)}
              {renderEditableField('Degree', 'degree', user.profile?.degree)}
              {renderEditableField('Profession', 'profession', user.profile?.profession)}
              {renderEditableField('LinkedIn Profile', 'linkedIn', user.profile?.linkedIn, 'url')}
            </div>

            {/* Email (Read-only) */}
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <span className="text-gray-900">{user.email}</span>
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed for security reasons
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}