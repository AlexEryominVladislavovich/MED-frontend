import React, { useState } from 'react';
import { Doctor } from '../../../types';
import styles from './styles.module.css';

interface DoctorProfileProps {
  doctor: Doctor;
  photos: Array<{ id: number; photo_url: string }>;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({
  doctor,
  photos,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Создаем массив всех фотографий, включая основную
  const allPhotos = [
    { id: -1, photo_url: doctor.photo_url },
    ...photos
  ];

  // Функция для получения индексов для боковых фотографий
  const getSidePhotos = (centerIndex: number, count: number) => {
    const sidePhotos = [];
    for (let i = 1; i <= count; i++) {
      const leftIndex = (centerIndex - i + allPhotos.length) % allPhotos.length;
      const rightIndex = (centerIndex + i) % allPhotos.length;
      sidePhotos.push({ left: leftIndex, right: rightIndex });
    }
    return sidePhotos;
  };

  const sidePhotos = getSidePhotos(activePhotoIndex, 3);

  return (
        <div className={styles.photoGrid}>
          <div className={styles.sidePhotosContainer + ' ' + styles.leftPhotos}>
            {sidePhotos.map((indices, i) => (
              <div key={`left-${i}`} className={styles.sidePhoto}>
                <img
                  src={allPhotos[indices.left].photo_url}
                  alt="Previous photo"
                  onClick={() => setActivePhotoIndex(indices.left)}
                />
              </div>
            ))}
          </div>
          
          <div className={styles.mainPhoto}>
            <img
              src={allPhotos[activePhotoIndex].photo_url}
              alt={`${doctor.user.last_name} ${doctor.user.first_name}`}
            />
          </div>
          
          <div className={styles.sidePhotosContainer + ' ' + styles.rightPhotos}>
            {sidePhotos.map((indices, i) => (
              <div key={`right-${i}`} className={styles.sidePhoto}>
                <img
                  src={allPhotos[indices.right].photo_url}
                  alt="Next photo"
                  onClick={() => setActivePhotoIndex(indices.right)}
                />
              </div>
            ))}
      </div>
    </div>
  );
};

export default DoctorProfile;
