import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Grid, Paper, Avatar, Container, CircularProgress, Alert } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import { useNavigate } from 'react-router-dom';
import { createApiRequest, useLanguage } from '../config/api';

const API_URL = 'http://127.0.0.1:8000';

const HomePage: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const currentLanguage = useLanguage();

    const fetchDoctors = async () => {
      try {
        console.log('Fetching doctors...');
      const response = await createApiRequest(`${API_URL}/api/doctors/doctors/`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        setDoctors(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDoctors();
  }, [currentLanguage]); // Перезагружаем данные при смене языка

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #e3f0ff 0%, #b3d8f7 100%)' }}>
      {/* Минималистичная шапка */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'white',
          px: 0,
          pt: 1,
          pb: 0.5,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          position: 'relative',
          minHeight: 44
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 4 }}>
          <Button disableRipple sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 16,
            color: '#222',
            textTransform: 'none',
            minWidth: 0,
            p: 0.5,
            bgcolor: 'transparent',
            '&:hover': { color: '#1976d2', bgcolor: 'transparent' }
          }}>О нас</Button>
          <Button disableRipple sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 16,
            color: '#222',
            textTransform: 'none',
            minWidth: 0,
            p: 0.5,
            bgcolor: 'transparent',
            '&:hover': { color: '#1976d2', bgcolor: 'transparent' }
          }}>Отзывы</Button>
          <Button disableRipple sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 16,
            color: '#222',
            textTransform: 'none',
            minWidth: 0,
            p: 0.5,
            bgcolor: 'transparent',
            '&:hover': { color: '#1976d2', bgcolor: 'transparent' }
          }}>RU ▾</Button>
          <Button disableRipple sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 16,
            color: '#222',
            textTransform: 'none',
            minWidth: 0,
            p: 0.5,
            bgcolor: 'transparent',
            '&:hover': { color: '#1976d2', bgcolor: 'transparent' }
          }}>Местоположение</Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 4 }}>
          <Button disableRipple sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 16,
            color: '#222',
            textTransform: 'none',
            minWidth: 0,
            p: 0.5,
            bgcolor: 'transparent',
            '&:hover': { color: '#1976d2', bgcolor: 'transparent' }
          }}>Регистрация</Button>
          <Button disableRipple sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 16,
            color: '#222',
            textTransform: 'none',
            minWidth: 0,
            p: 0.5,
            bgcolor: 'transparent',
            '&:hover': { color: '#1976d2', bgcolor: 'transparent' }
          }}>Войти</Button>
        </Box>
      </Box>

      {/* Основной контент */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4} alignItems="flex-start">
          {/* Список специалистов */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                background: 'linear-gradient(90deg, #1976d2 0%, #00bfff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: 1.1,
                textTransform: 'uppercase',
                fontSize: { xs: 16, md: 20 },
                lineHeight: 1.1
              }}
            >
              Наши специалисты
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container direction="column" spacing={2}>
                {doctors.length > 0 ? doctors.map((doc) => (
                  <Grid item key={doc.id}>
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        p: 2, 
                        borderRadius: '12px', 
                        cursor: 'pointer', 
                        '&:hover': { 
                          boxShadow: 6, 
                          bgcolor: '#e3f0ff' 
                        } 
                      }}
                      onClick={() => navigate(`/doctors/${doc.id}`)}
                    >
                      <Avatar 
                        src={doc.photo_url || undefined} 
                        alt={doc.user?.first_name} 
                        variant="square" 
                        sx={{ 
                          width: 100, 
                          height: '100%', 
                          mr: 2, 
                          borderRadius: '4px !important', 
                          objectFit: 'cover' 
                        }} 
                      />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {doc.user?.last_name} {doc.user?.first_name} {doc.patronymic}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {doc.specialization && doc.specialization.length > 0 
                            ? doc.specialization.map((s: any) => s.name_specialization).join(', ') 
                            : ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {doc.bio}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                )) : (
                  <Grid item>
                    <Alert severity="info">
                      Нет доступных врачей
                    </Alert>
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>

          {/* Карта */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ 
              height: 340, 
              borderRadius: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              bgcolor: '#f5faff' 
            }}>
              <MapIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>
                Месторасположение клиники
              </Typography>
              <Box sx={{ 
                width: '90%', 
                height: 200, 
                bgcolor: '#b3d8f7', 
                borderRadius: 2, 
                mt: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#1976d2', 
                fontWeight: 700 
              }}>
                Карта клиники (заглушка)
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Кнопка записи */}
      <Box sx={{ 
        position: 'fixed', 
        left: 0, 
        bottom: 32, 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        zIndex: 1000 
      }}>
        <Button 
          variant="contained" 
          size="large" 
          sx={{
            bgcolor: '#00685A !important',
            backgroundColor: '#00685A !important',
            color: 'white !important',
            px: 8,
            py: 0.5,
            fontSize: 17,
            minWidth: 350,
            borderRadius: 2,
            boxShadow: 6,
            '&:hover': {
              bgcolor: '#00A08A !important',
              backgroundColor: '#00A08A !important',
            }
          }}
          onClick={() => navigate('/doctors')}
        >
          Записаться на приём
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage; 