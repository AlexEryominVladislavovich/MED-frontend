import React, { useState } from 'react';
import styles from './styles.module.css';

interface Photo {
  id: number;
  url: string;
  alt: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleThumbnailClick = (index: number) => {
    if (index === currentPhotoIndex) return;
    setIsTransitioning(true);
    setCurrentPhotoIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (!photos?.length) return null;

  return (
    <div className={styles.gallery}>
      <div className={styles.mainPhotoContainer}>
        <img
          src={photos[currentPhotoIndex].url}
          alt={photos[currentPhotoIndex].alt}
          className={`${styles.mainPhoto} ${isTransitioning ? styles.transitioning : ''}`}
        />
      </div>
      
      <div className={styles.thumbnailStrip}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`${styles.thumbnailContainer} ${
              index === currentPhotoIndex ? styles.active : ''
            }`}
            onClick={() => handleThumbnailClick(index)}
          >
            <img
              src={photo.url}
              alt={photo.alt}
              className={styles.thumbnail}
            />
          </div>
        ))}
      </div>
      
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${((currentPhotoIndex + 1) / photos.length) * 100}%` }}
        />
      </div>
    </div>
  );
}; 