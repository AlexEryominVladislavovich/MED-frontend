import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper
} from '@mui/material';
import { Doctor, TimeSlot } from '../../types';

interface AppointmentConfirmationProps {
  doctor: Doctor;
  timeSlot: TimeSlot;
  onCancel: () => void;
  onConfirm: (data: AppointmentData) => Promise<void>;
}

interface AppointmentData {
  name: string;
  phone: string;
  comment?: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
}

const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  doctor,
  timeSlot,
  onCancel,
  onConfirm
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AppointmentData>({
    name: '',
    phone: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Имя обязательно для заполнения';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Имя должно содержать минимум 2 символа';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Номер телефона обязателен для заполнения';
      isValid = false;
    } else if (!/^\+996\d{9}$/.test(formData.phone.trim())) {
      errors.phone = 'Введите корректный номер телефона в формате +996XXXXXXXXX';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очищаем ошибку поля при изменении
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await onConfirm(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании записи');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getSlotTypeDisplay = (type: 'consultation' | 'treatment') => {
    return type === 'consultation' ? 'Консультация' : 'Лечение';
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom align="center">
            Запись на прием
          </Typography>

          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              required
              label="Имя"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              required
              label="Номер телефона"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone || 'Формат: +996XXXXXXXXX'}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Комментарий"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
            />
          </Box>

          <Typography variant="h6" gutterBottom>
            Проверьте информацию о записи
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3,
            p: 2,
            bgcolor: '#f8f9fa',
            borderRadius: 1
          }}>
            <Box
              component="img"
              src={doctor.photo_url}
              alt={`${doctor.user.last_name} ${doctor.user.first_name}`}
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {doctor.user.last_name} {doctor.user.first_name} {doctor.patronymic}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {doctor.specialization.map(spec => spec.name_specialization).join(', ')}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {getSlotTypeDisplay(timeSlot.slot_type)} на {formatDate(timeSlot.date)} в {timeSlot.start_time}
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              Нет, спасибо
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || Object.keys(formErrors).length > 0}
            >
              Подтверждаю
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AppointmentConfirmation;