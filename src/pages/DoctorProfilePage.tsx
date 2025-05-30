import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Box,
  CircularProgress,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authData, setAuthData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/doctors/doctors/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error('Врач не найден');
        return res.json();
      })
      .then(data => {
        setDoctor(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleBookAppointment = () => {
    // Проверяем авторизацию
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthDialogOpen(true);
      return;
    }
    navigate(`/doctor/${id}/slots`);
  };

  const handleAuth = () => {
    // Здесь будет логика авторизации
    setAuthDialogOpen(false);
    navigate(`/doctor/${id}/slots`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" variant="h5">{error}</Typography>
      </Container>
    );
  }

  if (!doctor) return null;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'linear-gradient(135deg, #e3f0ff 0%, #b3d8f7 100%)',
      py: 6 
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Левая колонка - фото и основная информация */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4, bgcolor: 'white' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={doctor.photo_url}
                  alt={`${doctor.user.last_name} ${doctor.user.first_name}`}
                  sx={{ width: 200, height: 200, mb: 2, borderRadius: 2 }}
                />
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {doctor.user.last_name} {doctor.user.first_name} {doctor.patronymic}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {doctor.specialization?.map((spec: any) => spec.name_specialization).join(', ')}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CalendarMonthIcon />}
                  onClick={handleBookAppointment}
                  sx={{ mt: 2, width: '100%' }}
                >
                  Записаться на приём
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Правая колонка - детальная информация */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4, bgcolor: 'white' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                О враче
              </Typography>
              <Typography variant="body1" paragraph>
                {doctor.bio}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      Кабинет: {doctor.room_number}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      {doctor.phone_number}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      {doctor.user.email}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight={700} gutterBottom>
                Специализации
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {doctor.specialization?.map((spec: any) => (
                  <Chip
                    key={spec.id}
                    label={spec.name_specialization}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Модальное окно авторизации */}
      <Dialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)}>
        <DialogTitle>Авторизация</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={authData.email}
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuthDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleAuth} variant="contained">Войти</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorProfilePage; 