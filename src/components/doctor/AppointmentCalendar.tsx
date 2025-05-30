import React from 'react';
import { Paper, Typography, Grid, Button, Box } from '@mui/material';
import { TimeSlot } from '../../types';

interface AppointmentCalendarProps {
  selectedDate: string | null;
  availableSlots: TimeSlot[];
  onDateSelect: (date: Date) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  selectedDate,
  availableSlots,
  onDateSelect,
}) => {
  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Записаться на приём
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={2}>
          {generateCalendarDays().map((date) => (
            <Grid item xs={4} sm={3} md={2} key={date.toISOString()}>
              <Button
                fullWidth
                variant={selectedDate === date.toISOString().split('T')[0] ? 'contained' : 'outlined'}
                onClick={() => onDateSelect(date)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 1,
                  minHeight: 80,
                  borderRadius: 2
                }}
              >
                <Typography variant="caption" display="block">
                  {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
                </Typography>
                <Typography variant="h6">
                  {date.getDate()}
                </Typography>
                <Typography variant="caption" display="block">
                  {date.toLocaleDateString('ru-RU', { month: 'short' })}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>

        {selectedDate && availableSlots.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Доступное время {formatDate(new Date(selectedDate))}:
            </Typography>
            <Grid container spacing={2}>
              {availableSlots.map((slot) => (
                <Grid item xs={6} sm={4} md={3} key={slot.id}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    sx={{ borderRadius: 2 }}
                  >
                    {slot.start_time}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default AppointmentCalendar; 