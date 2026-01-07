import { useState, useEffect } from 'react';
import { getPhotos } from '../utils/storage';

const PhotoFeed = ({ refreshTrigger }) => {
  const [photos, setPhotos] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load photos from storage
    const loadPhotos = () => {
      const allPhotos = getPhotos();
      // Sort by upload date (newest first)
      const sortedPhotos = allPhotos.sort((a, b) => 
        new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );
      setPhotos(sortedPhotos);
    };

    loadPhotos();
  }, [refreshTrigger]); // Reload when refreshTrigger changes

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const uniqueUsers = Array.from(
    new Set(
      photos
        .map((p) => p.userName || 'Anonymous')
        .filter(Boolean)
    )
  );

  const filteredPhotos = photos.filter((photo) => {
    const userName = (photo.userName || 'Anonymous').toLowerCase();
    const fileName = (photo.fileName || '').toLowerCase();
    const term = searchTerm.trim().toLowerCase();

    if (selectedUser !== 'all' && userName !== selectedUser.toLowerCase()) {
      return false;
    }

    if (term) {
      return userName.includes(term) || fileName.includes(term);
    }

    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Style Feed</h2>

      {photos.length > 0 && (
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Filter by user
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All users</option>
              {uniqueUsers.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Search (name or file)
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      )}
      
      {filteredPhotos.length > 0 ? (
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
          {filteredPhotos.map((photo) => {
            const status = photo.swipe?.status;
            const badgeStyles =
              status === 'loved'
                ? 'bg-green-100 text-green-700'
                : status === 'not_for_me'
                  ? 'bg-amber-100 text-amber-700'
                  : status === 'skipped'
                    ? 'bg-gray-100 text-gray-700'
                    : 'hidden';
            const badgeText =
              status === 'loved'
                ? 'Loved'
                : status === 'not_for_me'
                  ? 'Not for me'
                  : status === 'skipped'
                    ? 'Skipped'
                    : '';

            return (
              <div 
                key={photo.id} 
                className="relative border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
              >
                {status && (
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${badgeStyles}`}>
                    {badgeText}
                  </span>
                )}
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    {photo.userName ? photo.userName.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {photo.userName || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(photo.uploadedAt)}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={photo.data}
                    alt={photo.fileName}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : photos.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No photos match your filters</p>
          <p className="text-gray-400 text-sm">
            Try clearing the search or selecting &quot;All users&quot;.
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb2">No photos in the feed yet</p>
          <p className="text-gray-400 text-sm">Upload your first style photo to get started!</p>
        </div>
      )}
    </div>
  );
};

export default PhotoFeed;
