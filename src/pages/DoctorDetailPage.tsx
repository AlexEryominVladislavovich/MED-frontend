import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, CircularProgress, Alert } from '@mui/material';
import DoctorInfo from '../components/doctor/DoctorInfo';
import PhotoGallery from '../components/doctor/PhotoGallery';
import TimeSlotSelector from '../components/doctor/TimeSlotSelector';
import DoctorMainPhoto from '../components/doctor/DoctorMainPhoto';
import { Doctor, TimeSlot } from '../types';

const API_URL = 'http://127.0.0.1:8000';

const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        console.log('Fetching doctor with ID:', id);
        const response = await fetch(`${API_URL}/api/doctors/${id}/detail/`);
        console.log('Response:', response);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received doctor data:', data);
        console.log('Doctor photos:', data.photos);
        
        setDoctor(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке данных врача');
        setLoading(false);
      }
    };

    if (id) {
      console.log('Starting to fetch doctor data...');
      fetchDoctor();
    } else {
      console.error('No doctor ID provided');
      setError('ID врача не указан');
      setLoading(false);
    }
  }, [id]);

  const handleSlotSelect = (slot: TimeSlot) => {
    // TODO: Implement appointment creation
    console.log('Selected slot:', slot);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !doctor) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Врач не найден'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <DoctorMainPhoto 
        doctor={doctor} 
        selectedPhotoIndex={selectedPhotoIndex}
        onPhotoChange={setSelectedPhotoIndex}
      />
      {doctor.photos && doctor.photos.length > 0 && (
        <PhotoGallery 
          photos={doctor.photos}
          mainPhotoUrl={doctor.photo_url}
          selectedPhotoIndex={selectedPhotoIndex}
          onPhotoSelect={setSelectedPhotoIndex}
        />
      )}
      <Box sx={{ mt: 4 }}>
        <TimeSlotSelector
          doctorId={doctor.id}
          onSlotSelect={handleSlotSelect}
        />
      </Box>
    </Container>
  );
};

export default DoctorDetailPage;