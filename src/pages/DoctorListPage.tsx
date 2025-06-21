import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Alert } from '@mui/material';
import DoctorCard from '../components/DoctorCard';

const DoctorListPage: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/doctors/doctors/')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch doctors');
        }
        return res.json();
      })
      .then(data => {
        setDoctors(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #e3f0ff 0%, #b3d8f7 100%)', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={700} mb={4} textAlign="center" color="#1976d2">
          Выберите врача
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {doctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor.id}>
              <Box sx={{
                border: '2px solid #90caf9',
                borderRadius: 3,
                bgcolor: 'white',
                boxShadow: 2,
                transition: 'box-shadow 0.2s, border-color 0.2s',
                '&:hover': {
                  boxShadow: 6,
                  borderColor: '#1976d2',
                },
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                minHeight: 260,
              }}>
                <DoctorCard doctor={doctor} />
              </Box>
            </Grid>
          ))}
          {!loading && doctors.length === 0 && (
            <Grid item xs={12}>
              <Alert severity="info">Нет доступных врачей</Alert>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default DoctorListPage;