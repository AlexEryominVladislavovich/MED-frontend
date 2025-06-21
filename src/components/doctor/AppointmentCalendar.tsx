import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, IconButton, Paper, CircularProgress, Alert } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { TimeSlot, Doctor } from '../../types';
import { useNavigate } from 'react-router-dom';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameDay, isBefore, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { createApiRequest, useLanguage } from '../../config/api';

interface AppointmentCalendarProps {
  doctorId: number;
}

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const API_URL = 'http://127.0.0.1:8000';
const KYRGYZSTAN_OFFSET = 6; // UTC+6 для Кыргызстана

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ doctorId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const navigate = useNavigate();
  const currentLanguage = useLanguage();

  // Загрузка информации о враче
    const fetchDoctor = async () => {
      try {
      const response = await createApiRequest(`${API_URL}/api/doctors/doctors/${doctorId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch doctor info');
        }
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    };

  useEffect(() => {
    fetchDoctor();
  }, [doctorId, currentLanguage]); // Перезагружаем данные при смене языка

  // Проверка, является ли дата прошедшей
  const isPastDate = (date: Date): boolean => {
    const now = new Date();
    return date.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0);
  };

  // Получаем начало недели (понедельник)
  const getWeekStart = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  // Получаем массив дат текущей недели
  const getWeekDates = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Форматирование даты для отображения
  const formatDate = (date: Date) => {
    return date.getDate().toString();
  };

  // Получение названия месяца
  const getMonthName = (date: Date) => {
    return date.toLocaleString('ru-RU', { month: 'long' });
  };

  // Навигация по неделям
  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Загрузка доступных слотов
  const fetchAvailableSlots = async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const response = await createApiRequest(
        `${API_URL}/api/doctors/doctors/${doctorId}/available_slots/?date=${formattedDate}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch slots');
      }
      const data = await response.json();
      // Преобразуем данные в нужный формат (без фильтрации по времени)
      const formattedSlots = data.map((slot: any) => ({
        id: slot.id,
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        duration: slot.duration,
        slot_type: slot.slot_type,
        slot_type_display: slot.slot_type_display,
        is_available: slot.is_available
      }));
      setAvailableSlots(formattedSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch slots');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Обработка выбора даты
  const handleDateSelect = (date: Date) => {
    // Проверяем, что выбранная дата не в прошлом
    if (!isPastDate(date)) {
    setSelectedDate(date);
    fetchAvailableSlots(date);
    }
  };

  // Фильтрация слотов для выбранной даты
  const getDateSlots = (date: Date) => {
    if (!selectedDate) return [];
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const now = new Date();
    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
    return availableSlots.filter(slot => {
      if (slot.date !== formattedDate || !slot.is_available) return false;
      if (isToday) {
        // Фильтруем только по времени для сегодняшней даты
        const [hours, minutes] = slot.start_time.split(':');
        const slotDate = new Date(slot.date);
        slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return slotDate > now;
      }
      return true;
    });
  };

  // Форматирование времени слота
  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const weekStart = getWeekStart(currentDate);
  const weekDates = getWeekDates(weekStart);

  const handleSlotClick = (slot: TimeSlot) => {
    navigate(`/appointment-confirmation/${doctorId}/${slot.id}`);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      {/* Информация о враче */}
      {doctor && (
        <Box 
          sx={{ 
            width: '100%',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3
          }}
        >
          <Box
            component="img"
            src={doctor.photo_url}
            alt={`${doctor.user.last_name} ${doctor.user.first_name}`}
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#1976d2',
                mb: 0.5
              }}
            >
              {doctor.user.last_name} {doctor.user.first_name} {doctor.patronymic}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                fontSize: '0.9rem'
              }}
            >
              {doctor.specialization.map(spec => spec.name_specialization).join(', ')}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Заголовок с месяцем */}
      <Typography 
        variant="h5" 
        align="center"
        sx={{ 
          fontWeight: 500,
          color: '#1976d2',
          mb: 3
        }}
      >
        {getMonthName(currentDate)}
      </Typography>

      {/* Календарь */}
      <Box sx={{ mb: 4, position: 'relative' }}>
        <Grid container spacing={0.5} sx={{ maxWidth: '600px', mx: 'auto' }}>
          {DAYS_OF_WEEK.map((day, index) => (
            <Grid item xs key={`day-${day}`}>
              <Box 
                onClick={() => !isPastDate(weekDates[index]) && handleDateSelect(weekDates[index])}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{
                  cursor: isPastDate(weekDates[index]) ? 'not-allowed' : 'pointer',
                  py: 0.5,
                  px: 0.25,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  bgcolor: selectedDate?.getDate() === weekDates[index].getDate() ? '#64b5f6' : 
                          isPastDate(weekDates[index]) ? '#f5f5f5' :
                          hoveredIndex === index ? '#e3f2fd' : 'transparent',
                  '&:hover': {
                    bgcolor: isPastDate(weekDates[index]) ? '#f5f5f5' :
                            selectedDate?.getDate() === weekDates[index].getDate() ? '#64b5f6' : '#e3f2fd'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  minWidth: '40px',
                  maxWidth: '60px',
                  mx: 'auto',
                  opacity: isPastDate(weekDates[index]) ? 0.5 : 1
                }}
              >
                <Typography
                  sx={{ 
                    fontSize: '0.85rem',
                    color: selectedDate?.getDate() === weekDates[index].getDate() ? '#fff' : '#666',
                    fontWeight: 500,
                    lineHeight: 1.2
                  }}
                >
                  {day}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    color: selectedDate?.getDate() === weekDates[index].getDate() ? '#fff' : '#333',
                    fontWeight: selectedDate?.getDate() === weekDates[index].getDate() ? 600 : 400,
                    lineHeight: 1.2
                  }}
                >
                  {formatDate(weekDates[index])}
                </Typography>
              </Box>
            </Grid>
          ))}

          {/* Стрелка влево */}
          <IconButton 
            onClick={handlePrevWeek}
            sx={{ 
              position: 'absolute',
              left: -16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#1976d2',
              width: 32,
              height: 32
            }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>

          {/* Стрелка вправо */}
          <IconButton 
            onClick={handleNextWeek}
            sx={{ 
              position: 'absolute',
              right: -16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#1976d2',
              width: 32,
              height: 32
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Box>

      {/* Временные слоты */}
      {selectedDate && (
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 1,
          p: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          maxWidth: '600px',
          mx: 'auto'
        }}>
          {loading ? (
            <Typography 
              sx={{ 
                gridColumn: '1 / -1',
                textAlign: 'center',
                color: '#666',
                py: 2
              }}
            >
              Загрузка слотов...
            </Typography>
          ) : error ? (
            <Typography 
              sx={{ 
                gridColumn: '1 / -1',
                textAlign: 'center',
                color: 'error.main',
                py: 2
              }}
            >
              {error}
            </Typography>
          ) : (
            <>
              {getDateSlots(selectedDate).map((slot) => (
                <Button
                  key={slot.id}
                  onClick={() => handleSlotClick(slot)}
                  variant="outlined"
                  sx={{
                    py: 0.75,
                    backgroundColor: '#fff',
                    color: slot.slot_type === 'consultation' ? '#2196f3' : '#ff9800',
                    borderColor: slot.slot_type === 'consultation' ? '#2196f3' : '#ff9800',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    minWidth: 0,
                    '&:hover': {
                      backgroundColor: slot.slot_type === 'consultation' ? '#2196f3' : '#ff9800',
                      color: '#fff',
                      borderColor: slot.slot_type === 'consultation' ? '#2196f3' : '#ff9800'
                    },
                    boxShadow: '0 2px 4px rgba(25,118,210,0.1)'
                  }}
                >
                  {formatTime(slot.start_time)}
                </Button>
              ))}
              {getDateSlots(selectedDate).length === 0 && (
                <Typography 
                  sx={{ 
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    color: '#666',
                    py: 2
                  }}
                >
                  Нет доступных слотов на выбранную дату
                </Typography>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AppointmentCalendar; 