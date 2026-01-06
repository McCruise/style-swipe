import { useState, useEffect } from 'react';
import { savePhoto, getPhotos, deletePhoto } from '../utils/storage';

const PhotoUpload = ({ onPhotosUpdate, userName }) => {
  const [photos, setPhotos] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Load existing photos on mount
    const existingPhotos = getPhotos();
    setPhotos(existingPhotos);
    if (onPhotosUpdate) {
      onPhotosUpdate(existingPhotos);
    }
  }, [onPhotosUpdate]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setPreview(base64Data);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleUpload = () => {
    if (preview) {
      const fileName = `photo_${Date.now()}.jpg`;
      const photoId = savePhoto(preview, fileName, userName);
      if (photoId) {
        const updatedPhotos = getPhotos();
        setPhotos(updatedPhotos);
        setPreview(null);
        // Reset file input
        const fileInput = document.getElementById('photo-input');
        if (fileInput) fileInput.value = '';
        if (onPhotosUpdate) {
          onPhotosUpdate(updatedPhotos);
        }
      }
    }
  };

  const handleDelete = (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      deletePhoto(photoId);
      const updatedPhotos = getPhotos();
      setPhotos(updatedPhotos);
      if (onPhotosUpdate) {
        onPhotosUpdate(updatedPhotos);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Style Photos</h2>
      
      {/* Upload Section */}
      <div className="mb-6">
        <label htmlFor="photo-input" className="block text-sm font-medium text-gray-700 mb-2">
          Select a Photo
        </label>
        <input
          type="file"
          id="photo-input"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        
        {preview && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-w-xs max-h-64 rounded-lg border-2 border-gray-300"
              />
            </div>
            <button
              onClick={handleUpload}
              className="mt-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Upload Photo
            </button>
            <button
              onClick={() => {
                setPreview(null);
                const fileInput = document.getElementById('photo-input');
                if (fileInput) fileInput.value = '';
              }}
              className="mt-3 ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Display Uploaded Photos */}
      {photos.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Photos ({photos.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.data}
                  alt={photo.fileName}
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Delete photo"
                >
                  ×
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate">{photo.fileName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {photos.length === 0 && (
        <p className="text-gray-500 text-center py-8">No photos uploaded yet. Upload your first style photo above!</p>
      )}
    </div>
  );
};

export default PhotoUpload;
