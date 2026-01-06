import { useState, useEffect } from 'react';
import { getPhotos } from '../utils/storage';

const PhotoFeed = ({ refreshTrigger }) => {
  const [photos, setPhotos] = useState([]);

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Style Feed</h2>
      
      {photos.length > 0 ? (
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
            >
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
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No photos in the feed yet</p>
          <p className="text-gray-400 text-sm">Upload your first style photo to get started!</p>
        </div>
      )}
    </div>
  );
};

export default PhotoFeed;
