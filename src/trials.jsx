import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Replace with your backend URL
  const API_URL = 'https://segintco7003.onrender.com/api/images';

  // Load images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  // Fetch all images
  const fetchImages = async () => {
    try {
      const response = await axios.get(API_URL);
      setImages(response.data.images);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadMessage('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);
    setUploadMessage('');

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadMessage('✅ ' + response.data.message);
      setSelectedFile(null);
      setPreview(null);
      
      // Refresh images list
      fetchImages();
      
      // Reset file input
      e.target.reset();
    } catch (error) {
      setUploadMessage('❌ Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Delete image
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchImages();
    } catch (error) {
      alert('Error deleting image: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Image Upload to MongoDB</h1>

      {/* Upload Form */}
      <form onSubmit={handleUpload} style={styles.form}>
        <div style={styles.uploadBox}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={styles.fileInput}
          />
          
          {preview && (
            <div style={styles.previewBox}>
              <img src={preview} alt="Preview" style={styles.previewImage} />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading || !selectedFile}
          style={{
            ...styles.button,
            opacity: (loading || !selectedFile) ? 0.6 : 1
          }}
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>

        {uploadMessage && (
          <div style={{
            ...styles.message,
            backgroundColor: uploadMessage.includes('✅') ? '#d4edda' : '#f8d7da',
            color: uploadMessage.includes('✅') ? '#155724' : '#721c24'
          }}>
            {uploadMessage}
          </div>
        )}
      </form>

      {/* Images List */}
      <div style={styles.imagesSection}>
        <h2 style={styles.subtitle}>Uploaded Images ({images.length})</h2>
        
        {images.length === 0 ? (
          <p style={styles.noImages}>No images uploaded yet</p>
        ) : (
          <div style={styles.imageGrid}>
            {images.map((image) => (
              <div key={image._id} style={styles.imageCard}>
                <img
                  src={`${API_URL}/${image._id}`}
                  alt={image.name}
                  style={styles.thumbnailImage}
                />
                <div style={styles.imageInfo}>
                  <h4 style={styles.imageName}>{image.name}</h4>
                  <p style={styles.imageDate}>
                    {new Date(image.uploadDate).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDelete(image._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '40px',
  },
  uploadBox: {
    marginBottom: '20px',
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    border: '2px dashed #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  previewBox: {
    marginTop: '20px',
    textAlign: 'center',
  },
  previewImage: {
    maxWidth: '300px',
    maxHeight: '300px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  message: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '5px',
    textAlign: 'center',
  },
  imagesSection: {
    marginTop: '40px',
  },
  subtitle: {
    color: '#333',
    marginBottom: '20px',
  },
  noImages: {
    textAlign: 'center',
    color: '#999',
    fontSize: '18px',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  imageCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  thumbnailImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  imageInfo: {
    padding: '15px',
  },
  imageName: {
    margin: '0 0 5px 0',
    fontSize: '16px',
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  imageDate: {
    margin: '0 0 10px 0',
    fontSize: '12px',
    color: '#999',
  },
  deleteButton: {
    width: '100%',
    backgroundColor: '#f44336',
    color: 'white',
    padding: '8px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ImageUpload;