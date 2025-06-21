import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const AppointmentSuccessPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();

  const handleBackToDoctor = () => {
    navigate(`/doctors/${doctorId}`);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main' }} />
        </Box>
        
        <Typography variant="h5" gutterBottom>
          Запись успешно создана!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Мы отправили вам SMS с подтверждением записи.
          В ближайшее время с вами свяжется наш администратор для подтверждения записи.
        </Typography>

        <Button
          variant="contained"
          onClick={handleBackToDoctor}
          sx={{ minWidth: 200 }}
        >
          Вернуться к врачу
        </Button>
      </Paper>
    </Container>
  );
};

export default AppointmentSuccessPage; 