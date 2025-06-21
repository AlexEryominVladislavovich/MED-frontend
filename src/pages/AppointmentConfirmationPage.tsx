import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Container, Alert } from '@mui/material';
import AppointmentConfirmation from '../components/doctor/AppointmentConfirmation';
import { Doctor, TimeSlot } from '../types';
import { API_ENDPOINTS, createApiRequest, useLanguage } from '../config/api';

interface AppointmentData {
  name: string;
  phone: string;
  comment?: string;
}

interface RouteParams {
  doctorId: string;
  slotId: string;
}

const AppointmentConfirmationPage: React.FC = () => {
  const { doctorId, slotId } = useParams<keyof RouteParams>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);
  const currentLanguage = useLanguage();

    const fetchData = async () => {
      if (!doctorId || !slotId) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      try {
        // Загружаем информацию о враче
      const doctorResponse = await createApiRequest(API_ENDPOINTS.doctors.detail(doctorId));
        if (!doctorResponse.ok) {
          const errorData = await doctorResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка загрузки информации о враче: ${doctorResponse.status}`);
        }
        const doctorData = await doctorResponse.json();
        setDoctor(doctorData);

        // Загружаем информацию о временном слоте
      const slotResponse = await createApiRequest(API_ENDPOINTS.timeSlots.detail(slotId));
        if (!slotResponse.ok) {
        if (slotResponse.status === 404) {
          throw new Error('Временной слот не найден. Возможно, он был удален или уже занят.');
        }
          const errorData = await slotResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка загрузки информации о слоте: ${slotResponse.status}`);
        }
        const slotData = await slotResponse.json();
        
        // Проверяем, что слот все еще доступен
        if (!slotData.is_available) {
        throw new Error('Этот временной слот уже занят. Пожалуйста, выберите другой слот.');
        }
        
        setTimeSlot(slotData);
      } catch (err) {
        console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [doctorId, slotId, currentLanguage]); // Перезагружаем данные при смене языка

  const handleCancel = () => {
    if (doctorId) {
      navigate(`/doctors/${doctorId}`);
    } else {
      navigate('/');
    }
  };

  const handleConfirm = async (data: AppointmentData) => {
    if (!doctorId || !slotId) {
      throw new Error('Missing required parameters');
    }

    try {
      const response = await createApiRequest(API_ENDPOINTS.doctors.createAppointment(doctorId), {
        method: 'POST',
        body: JSON.stringify({
          time_slot_id: slotId,
          full_name: data.name,
          phone_number: data.phone,
          comment: data.comment
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка создания записи: ${response.status}`);
      }

      // После успешного создания записи перенаправляем на страницу успеха
      navigate(`/appointment-success/${doctorId}`);
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err instanceof Error ? err.message : 'Ошибка создания записи');
      throw err;
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !doctor || !timeSlot) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Ошибка загрузки данных записи'}
        </Alert>
      </Container>
    );
  }

  return (
    <AppointmentConfirmation
      doctor={doctor}
      timeSlot={timeSlot}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    />
  );
};

export default AppointmentConfirmationPage;
 