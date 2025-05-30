import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  patronymic?: string;
  specialization: Array<{
    id: number;
    name_specialization: string;
  }>;
  photo_url?: string;
  bio?: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  large?: boolean;
  compact?: boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, large, compact }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/doctors/${doctor.id}`);
  };

  // Форматирование имени
  const name = `${doctor.user?.last_name || ''} ${doctor.user?.first_name || ''} ${doctor.patronymic || ''}`.trim();
  
  // Форматирование специализации
  const specialization = doctor.specialization
    ? Array.isArray(doctor.specialization)
      ? doctor.specialization.map(s => s.name_specialization).join(', ')
      : typeof doctor.specialization === 'string'
        ? doctor.specialization
        : ''
    : '';

  // Размеры и стили
  const cardMaxWidth = large ? 480 : compact ? 260 : 340;
  const cardMediaHeight = large ? 320 : compact ? 72 : 220;
  const nameVariant = large ? 'h5' : compact ? 'subtitle1' : 'h6';
  const specVariant = large ? 'h6' : compact ? 'body2' : 'subtitle1';

  return (
    <Card 
      sx={{
        maxWidth: cardMaxWidth,
        width: '100%',
        mx: 'auto',
        borderRadius: 4,
        boxShadow: 0,
        cursor: 'pointer',
        bgcolor: 'transparent',
        boxSizing: 'border-box',
        p: 0,
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out'
        }
      }}
    >
      <CardActionArea 
        onClick={handleClick} 
        sx={{ p: 0 }}
        role="link"
        aria-label={`Перейти к профилю врача ${name}`}
      >
        <Box sx={{ position: 'relative', width: '100%', pb: compact ? 0 : '75%' }}>
          <CardMedia
            component="img"
            image={doctor.photo_url || '/default-doctor.png'}
            alt={name}
            sx={{
              position: compact ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              width: compact ? 72 : '100%',
              height: compact ? 72 : '100%',
              borderRadius: compact ? 2 : 4,
              objectFit: 'cover',
              mx: compact ? 'auto' : 0,
              my: compact ? 2 : 0
            }}
          />
        </Box>
        <CardContent sx={{ p: compact ? 1 : 2, textAlign: compact ? 'center' : 'left' }}>
          <Typography 
            variant={nameVariant} 
            component="h3"
            fontWeight={700} 
            gutterBottom
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {name}
          </Typography>
          <Typography 
            variant={specVariant} 
            color="textSecondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {specialization}
          </Typography>
          {doctor.bio && large && !compact && (
            <Typography 
              variant="body1" 
              color="textSecondary" 
              mt={1}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {doctor.bio}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DoctorCard; 