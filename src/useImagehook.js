import { useState } from 'react';
import axios from 'axios';

/**
 * Custom hook for managing image uploads to MongoDB
 * 
 * Usage:
 * const { uploadImage, loading, error } = useImageUpload();
 * 
 * await uploadImage(file);
 */
export const useImageUpload = (apiUrl = 'https://segintco7003.onrender.com/api/images') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      return response.data; // Returns { success, message, imageId, name }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
      throw err;
    }
  };

  return { uploadImage, loading, error };
};

/**
 * Custom hook for fetching images from MongoDB
 * 
 * Usage:
 * const { images, loading, error, refetch } = useImages();
 */
export const useImages = (apiUrl = 'https://segintco7003.onrender.com/api/images') => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(apiUrl);
      setImages(response.data.images);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

  const deleteImage = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      await fetchImages(); // Refresh list
      return true;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  return { images, loading, error, fetchImages, deleteImage };
};

/**
 * Utility function to get image URL
 * 
 * Usage:
 * <img src={getImageUrl(imageId)} alt="..." />
 */
export const getImageUrl = (imageId, apiUrl = 'https://segintco7003.onrender.com/api/images') => {
  return `${apiUrl}/${imageId}`;
};