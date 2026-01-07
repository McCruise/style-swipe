import { useEffect, useState } from 'react';
import { getPhotos } from '../utils/storage';

const SwipeHistory = ({ refreshTrigger }) => {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    loved: 0,
    notForMe: 0,
    skipped: 0,
    loveRate: 0,
  });

  useEffect(() => {
    const photos = getPhotos();
    const swipedEntries = photos
      .filter(photo => photo.swipe && photo.swipe.status)
      .map(photo => ({
        id: photo.id,
        userName: photo.userName || 'Anonymous',
        fileName: photo.fileName,
        status: photo.swipe.status,
        swipedAt: photo.swipe.swipedAt,
        uploadedAt: photo.uploadedAt,
        data: photo.data,
      }))
      .sort((a, b) => new Date(b.swipedAt) - new Date(a.swipedAt));

    const loved = swipedEntries.filter(e => e.status === 'loved').length;
    const notForMe = swipedEntries.filter(e => e.status === 'not_for_me').length;
    const skipped = swipedEntries.filter(e => e.status === 'skipped').length;
    const total = swipedEntries.length;
    const meaningful = loved + notForMe;
    const loveRate = meaningful ? Math.round((loved / meaningful) * 100) : 0;

    setEntries(swipedEntries);
    setStats({
      total,
      loved,
      notForMe,
      skipped,
      loveRate,
    });
  }, [refreshTrigger]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusBadge = (status) => {
    const base = 'inline-flex px-2 py-1 rounded-full text-xs font-semibold';
    if (status === 'loved') return `${base} bg-green-100 text-green-700`;
    if (status === 'not_for_me') return `${base} bg-amber-100 text-amber-700`;
    if (status === 'skipped') return `${base} bg-gray-100 text-gray-700`;
    return base;
  };

  const statusLabel = (status) => {
    if (status === 'loved') return 'Loved';
    if (status === 'not_for_me') return 'Not for me';
    if (status === 'skipped') return 'Skipped';
    return status;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Swipe History & Stats</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs uppercase text-gray-500 mb-1">Total Swipes</p>
          <p className="text-xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xs uppercase text-green-600 mb-1">Loved</p>
          <p className="text-xl font-bold text-green-700">{stats.loved}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <p className="text-xs uppercase text-amber-600 mb-1">Not for me</p>
          <p className="text-xl font-bold text-amber-700">{stats.notForMe}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs uppercase text-gray-600 mb-1">Skipped</p>
          <p className="text-xl font-bold text-gray-800">{stats.skipped}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs uppercase text-blue-600 mb-1">Love Rate</p>
          <p className="text-xl font-bold text-blue-700">
            {stats.loveRate}
            <span className="text-sm font-normal ml-1">%</span>
          </p>
        </div>
      </div>

      {/* History list */}
      {entries.length > 0 ? (
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
          {entries.map((entry) => (
            <div key={entry.id} className="py-3 flex items-start">
              <div className="w-16 h-16 mr-3 flex-shrink-0">
                <img
                  src={entry.data}
                  alt={entry.fileName}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-800 truncate">
                    {entry.userName}
                  </p>
                  <span className={statusBadge(entry.status)}>
                    {statusLabel(entry.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Swiped on: {formatDate(entry.swipedAt)}
                </p>
                <p className="text-xs text-gray-400">
                  Uploaded: {formatDate(entry.uploadedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-2">No swipes yet</p>
          <p className="text-gray-400 text-sm">
            Start swiping in the queue above to see your history and stats here.
          </p>
        </div>
      )}
    </div>
  );
};

export default SwipeHistory;

