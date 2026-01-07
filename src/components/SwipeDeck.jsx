import { useEffect, useState } from 'react';
import { getPhotos, saveSwipe } from '../utils/storage';

const SwipeDeck = ({ refreshTrigger, onSwipe }) => {
  const [queue, setQueue] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  const loadQueue = () => {
    const allPhotos = getPhotos();
    const unswiped = allPhotos.filter(photo => !photo.swipe?.status);
    setQueue(unswiped);
    setCurrentPhoto(unswiped[0] || null);
  };

  useEffect(() => {
    loadQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleSwipe = (status) => {
    if (!currentPhoto) return;
    saveSwipe(currentPhoto.id, status);
    if (onSwipe) onSwipe();
    loadQueue();
  };

  if (!currentPhoto) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Swipe Queue</h2>
        <p className="text-gray-600 mb-2">No more photos to swipe.</p>
        <p className="text-gray-400 text-sm">Upload new photos to keep swiping.</p>
      </div>
    );
  }

  const remaining = queue.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Swipe Queue</h2>
        <span className="text-sm text-gray-500">Remaining: {remaining}</span>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <img
          src={currentPhoto.data}
          alt={currentPhoto.fileName}
          className="w-full max-h-[480px] object-contain bg-gray-50"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
            {currentPhoto.userName ? currentPhoto.userName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{currentPhoto.userName || 'Anonymous'}</p>
            <p className="text-xs text-gray-500">{currentPhoto.fileName}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleSwipe('not_for_me')}
          className="py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors duration-200"
        >
          👋 Not for me
        </button>
        <button
          onClick={() => handleSwipe('skipped')}
          className="py-3 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-colors duration-200"
        >
          ↓ Skip
        </button>
        <button
          onClick={() => handleSwipe('loved')}
          className="py-3 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors duration-200"
        >
          ❤️ Love it
        </button>
      </div>
    </div>
  );
};

export default SwipeDeck;
