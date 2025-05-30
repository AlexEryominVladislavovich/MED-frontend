import React from 'react';
import { Box, useTheme } from '@mui/material';
import { DoctorPhoto } from '../../types';

interface PhotoGalleryProps {
  photos: DoctorPhoto[];
  mainPhotoUrl: string;
  selectedPhotoIndex: number;
  onPhotoSelect: (index: number) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ 
  photos, 
  mainPhotoUrl, 
  selectedPhotoIndex,
  onPhotoSelect 
}) => {
  const theme = useTheme();

  // Объединяем основное фото с дополнительными
  const allPhotos = [
    { id: -1, photo_url: mainPhotoUrl, order: -1 },
    ...(photos || [])
  ].sort((a, b) => a.order - b.order);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.grey[100],
          borderRadius: 3,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.primary.main,
          borderRadius: 3,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        },
        pb: 2,
        pt: 1,
        justifyContent: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        mt: 2
      }}
    >
      {allPhotos.map((photo, index) => (
        <Box
          key={photo.id}
          onClick={() => onPhotoSelect(index)}
          sx={{
            width: 80,
            height: 80,
            flexShrink: 0,
            position: 'relative',
            cursor: 'pointer',
            borderRadius: 1,
            overflow: 'hidden',
            transition: 'all 0.2s ease-in-out',
            transform: 'scale(1)',
            '&:hover': {
              transform: 'scale(1.05)',
              zIndex: 1
            },
            border: index === selectedPhotoIndex 
              ? `2px solid ${theme.palette.primary.main}`
              : '2px solid transparent',
            opacity: index === selectedPhotoIndex ? 1 : 0.7,
            margin: '2px',
          }}
        >
          <Box
            component="img"
            src={photo.photo_url}
            alt={`Фото ${index + 1}`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default PhotoGallery; 