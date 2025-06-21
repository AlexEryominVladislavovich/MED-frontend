import React from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Doctor } from '../../types';

interface DoctorMainPhotoProps {
  doctor: Doctor;
  selectedPhotoIndex: number;
  onPhotoChange: (index: number) => void;
}

const DoctorMainPhoto: React.FC<DoctorMainPhotoProps> = ({
  doctor,
  selectedPhotoIndex,
  onPhotoChange,
}) => {
  const photos = doctor.photos || [];
  const totalPhotos = photos.length;
  const currentPhoto = photos[selectedPhotoIndex]?.photo_url || doctor.photo_url;

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex > 0) {
      onPhotoChange(selectedPhotoIndex - 1);
    } else {
      onPhotoChange(totalPhotos - 1);
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex < totalPhotos - 1) {
      onPhotoChange(selectedPhotoIndex + 1);
    } else {
      onPhotoChange(0);
    }
  };

  if (!currentPhoto) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '400px',
        borderRadius: 2,
        overflow: 'hidden',
        '&:hover .MuiIconButton-root': {
          opacity: 1,
        },
      }}
    >
      <Box
        component="img"
        src={currentPhoto}
        alt={`${doctor.user?.last_name} ${doctor.user?.first_name}`}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {totalPhotos > 1 && (
        <>
          <IconButton
            onClick={handlePrevPhoto}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              opacity: 0,
              transition: 'opacity 0.3s',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={handleNextPhoto}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              opacity: 0,
              transition: 'opacity 0.3s',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default DoctorMainPhoto; 