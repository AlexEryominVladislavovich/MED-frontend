import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box, Paper, Typography, List, ListItem, ListItemButton, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid
} from '@mui/material';
import dayjs from 'dayjs';

const mockSlots = {
  examination: [
    { id: 1, time: '09:00', available: true },
    { id: 2, time: '10:00', available: false },
    { id: 3, time: '11:00', available: true },
    { id: 4, time: '12:00', available: false },
  ],
  treatment: [
    { id: 5, time: '14:00', available: false },
    { id: 6, time: '15:00', available: false },
  ],
};

const isAuthenticated = false; // mock auth
const doctor = { name: 'Иванов Иван Иванович', specialization: 'Кардиолог' };

const SlotSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const date = new URLSearchParams(location.search).get('date') || dayjs().format('YYYY-MM-DD');
  const [selectedSlot, setSelectedSlot] = useState<{ id: number; time: string } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSelectSlot = (slot: { id: number; time: string }) => {
    setSelectedSlot(slot);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    if (isAuthenticated) {
      // save to DB, redirect to profile
      navigate('/profile?success=1');
    } else {
      setShowForm(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // save request, redirect or show success
    setShowForm(false);
    navigate('/profile?success=1');
  };

  return (
    <Box maxWidth="lg" mx="auto" mt={6}>
      <Typography variant="h5" fontWeight={700} mb={4} textAlign="center">
        Выберете время для приема. Запись возможна только на осмотр.
      </Typography>
      <Grid container spacing={4} columns={12}>
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Осмотр</Typography>
            <List>
              {mockSlots.examination.map(slot => (
                <ListItem key={slot.id} disablePadding>
                  <ListItemButton
                    disabled={!slot.available}
                    sx={{
                      bgcolor: slot.available ? '#ff5252' : '#ffcdd2',
                      color: '#fff',
                      mb: 1,
                      '&.Mui-disabled': { opacity: 0.6 },
                    }}
                    onClick={() => slot.available && handleSelectSlot(slot)}
                  >
                    <ListItemText primary={slot.time} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Лечение</Typography>
            <List>
              {mockSlots.treatment.map(slot => (
                <ListItem key={slot.id} disablePadding>
                  <ListItemButton
                    disabled
                    sx={{ bgcolor: '#ffcdd2', color: '#fff', mb: 1, opacity: 0.6 }}
                  >
                    <ListItemText primary={slot.time} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Grid>
      {/* Модальное окно подтверждения */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Подтвердите запись</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены что хотите записаться на осмотр к {doctor.specialization}, {doctor.name} в {dayjs(date).format('DD.MM.YYYY')} {selectedSlot?.time}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit" variant="outlined">Нет, спасибо</Button>
          <Button onClick={handleConfirm} color="success" variant="contained">Да, уверен</Button>
        </DialogActions>
      </Dialog>
      {/* Форма для неаутентифицированных */}
      <Dialog open={showForm} onClose={() => setShowForm(false)}>
        <DialogTitle>Для успешной записи на приём напишите</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <TextField
              label="ФИО"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Телефон"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Typography variant="body2" mt={2}>
              После нажатия кнопки окей ваша заявка будет успешно сохранена.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary" variant="contained">Окей</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SlotSelectionPage;