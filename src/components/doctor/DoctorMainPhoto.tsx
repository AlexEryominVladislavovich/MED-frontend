import React from 'react';
import { Box, Container, IconButton } from '@mui/material';
import { NavigateBefore as PrevIcon, NavigateNext as NextIcon } from '@mui/icons-material';
import { Doctor, DoctorPhoto } from '../../types';

interface DoctorMainPhotoProps {
  doctor: Doctor;
  selectedPhotoIndex: number;
  onPhotoChange: (index: number) => void;
}

const DoctorMainPhoto: React.FC<DoctorMainPhotoProps> = ({ 
  doctor, 
  selectedPhotoIndex,
  onPhotoChange 
}) => {
  const photos = [
    { id: -1, photo_url: doctor.photo_url, order: -1 },
    ...(doctor.photos || [])
  ].sort((a, b) => a.order - b.order);

  const handlePrevPhoto = () => {
    const newIndex = selectedPhotoIndex > 0 ? selectedPhotoIndex - 1 : photos.length - 1;
    onPhotoChange(newIndex);
  };

  const handleNextPhoto = () => {
    const newIndex = selectedPhotoIndex < photos.length - 1 ? selectedPhotoIndex + 1 : 0;
    onPhotoChange(newIndex);
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '40vh',
        py: 3,
        position: 'relative'
      }}
    >
      <IconButton
        onClick={handlePrevPhoto}
        sx={{
          position: 'absolute',
          left: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
          boxShadow: 2,
        }}
      >
        <PrevIcon />
      </IconButton>

      <Box
        component="img"
        src={photos[selectedPhotoIndex]?.photo_url || doctor.photo_url}
        alt={`${doctor.user.last_name} ${doctor.user.first_name}`}
        sx={{
          width: '100%',
          maxWidth: '250px',
          height: 'auto',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          aspectRatio: '3/4',
          objectFit: 'cover'
        }}
      />

      <IconButton
        onClick={handleNextPhoto}
        sx={{
          position: 'absolute',
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
          boxShadow: 2,
        }}
      >
        <NextIcon />
      </IconButton>
    </Container>
  );
};

export default DoctorMainPhoto; 