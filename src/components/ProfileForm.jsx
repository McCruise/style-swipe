import { useState, useEffect } from 'react';
import { saveProfile, getProfile } from '../utils/storage';

const ProfileForm = ({ onProfileUpdate }) => {
  const [name, setName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load existing profile on mount
    const existingProfile = getProfile();
    if (existingProfile) {
      setName(existingProfile.name);
      setIsSaved(false); // Don't show "Saved!" on initial load
      if (onProfileUpdate) {
        onProfileUpdate(existingProfile.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const success = saveProfile(name.trim());
      if (success) {
        setIsSaved(true);
        if (onProfileUpdate) {
          onProfileUpdate(name.trim());
        }
        // Show feedback
        setTimeout(() => setIsSaved(false), 2000);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {isSaved ? '✓ Saved!' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
