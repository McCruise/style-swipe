// Local storage keys
const PROFILE_KEY = 'styleSwipe_profile';
const PHOTOS_KEY = 'styleSwipe_photos';

/**
 * Save user profile to local storage
 * @param {string} name - User's name
 */
export const saveProfile = (name) => {
  try {
    const profile = { name, createdAt: new Date().toISOString() };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    return false;
  }
};

/**
 * Get user profile from local storage
 * @returns {Object|null} Profile object or null if not found
 */
export const getProfile = () => {
  try {
    const profileData = localStorage.getItem(PROFILE_KEY);
    if (!profileData) return null;
    return JSON.parse(profileData);
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

/**
 * Save a photo to local storage
 * @param {string} photoData - Base64 encoded image data
 * @param {string} fileName - Original file name
 * @param {string} userName - Name of the user uploading the photo
 * @returns {string} Photo ID
 */
export const savePhoto = (photoData, fileName, userName) => {
  try {
    const photos = getPhotos();
    const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPhoto = {
      id: photoId,
      data: photoData,
      fileName: fileName,
      userName: userName || 'Anonymous',
      uploadedAt: new Date().toISOString()
    };
    photos.push(newPhoto);
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
    return photoId;
  } catch (error) {
    console.error('Error saving photo:', error);
    return null;
  }
};

/**
 * Get all photos from local storage
 * @returns {Array} Array of photo objects
 */
export const getPhotos = () => {
  try {
    const photosData = localStorage.getItem(PHOTOS_KEY);
    if (!photosData) return [];
    return JSON.parse(photosData);
  } catch (error) {
    console.error('Error getting photos:', error);
    return [];
  }
};

/**
 * Delete a photo from local storage
 * @param {string} photoId - ID of photo to delete
 */
export const deletePhoto = (photoId) => {
  try {
    const photos = getPhotos();
    const filteredPhotos = photos.filter(photo => photo.id !== photoId);
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(filteredPhotos));
    return true;
  } catch (error) {
    console.error('Error deleting photo:', error);
    return false;
  }
};
