import { useState, useEffect } from 'react';
import ProfileForm from './components/ProfileForm';
import PhotoUpload from './components/PhotoUpload';
import PhotoFeed from './components/PhotoFeed';
import SwipeDeck from './components/SwipeDeck';
import { getProfile, getPhotos } from './utils/storage';

function App() {
  const [profileName, setProfileName] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Load data from local storage on mount
    const profile = getProfile();
    if (profile) {
      setProfileName(profile.name);
    }
    getPhotos(); // Warm up cache; return value not directly used here
  }, []);

  const handleProfileUpdate = (name) => {
    setProfileName(name);
  };

  const handlePhotosUpdate = (updatedPhotos) => {
    // Trigger feed refresh
    setRefreshKey(prev => prev + 1);
  };

  const handleSwipeUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Style Swipe</h1>
          <p className="text-gray-600">Share your style and get feedback from the community</p>
          {profileName && (
            <p className="text-sm text-gray-500 mt-2">Welcome back, {profileName}! 👋</p>
          )}
        </header>

        <ProfileForm onProfileUpdate={handleProfileUpdate} />
        <PhotoUpload onPhotosUpdate={handlePhotosUpdate} userName={profileName} />
        
        <div className="mt-8">
          <PhotoFeed refreshTrigger={refreshKey} />
        </div>

        <div className="mt-8">
          <SwipeDeck refreshTrigger={refreshKey} onSwipe={handleSwipeUpdate} />
        </div>
      </div>
    </div>
  );
}

export default App;
