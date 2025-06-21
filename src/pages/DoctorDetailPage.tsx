import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, CircularProgress, Alert, Typography, Grid } from '@mui/material';
import { Doctor } from '../types';
import AppointmentCalendar from '../components/doctor/AppointmentCalendar';
import DoctorProfile from '../components/doctor/DoctorProfile';
import { createApiRequest, useLanguage } from '../config/api';

const API_URL = 'http://127.0.0.1:8000';

const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentLanguage = useLanguage();

    const fetchDoctor = async () => {
      try {
        if (!id) {
          throw new Error('ID врача не указан');
        }
      const response = await createApiRequest(`${API_URL}/api/doctors/doctors/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке данных врача');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (id) {
      fetchDoctor();
    }
  }, [id, currentLanguage]); // Перезагружаем данные при смене языка

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#1976d2' }} />
      </Box>
    );
  }

  if (error || !doctor || !id) {
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
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <DoctorProfile
            doctor={doctor}
            photos={doctor.photos}
          />
        </Grid>

        <Grid item xs={12} sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
            Записаться на прием
          </Typography>
          <AppointmentCalendar doctorId={parseInt(id, 10)} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorDetailPage;