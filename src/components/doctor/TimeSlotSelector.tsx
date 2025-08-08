import React, { useState } from 'react';
import { Box, Typography, styled, Button } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameDay, isBefore, startOfDay, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TimeSlot } from '../../types';
import { CircularProgress } from '@mui/material';
import { createApiRequest, useLanguage } from '../../config/api';

// Стилизованные компоненты
const WeekDayButton = styled(Box)(({ theme }) => ({
  padding: '4px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  borderRadius: '4px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  '&.selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const TimeSlotButton = styled(Box)<{ isAvailable: boolean }>(({ theme, isAvailable }) => ({
  padding: '8px 16px',
  backgroundColor: isAvailable ? theme.palette.grey[50] : theme.palette.grey[200],
  borderRadius: '20px',
  cursor: isAvailable ? 'pointer' : 'not-allowed',
  transition: 'all 0.2s ease',
  textAlign: 'center',
  opacity: isAvailable ? 1 : 0.6,
  '&:hover': {
    backgroundColor: isAvailable ? theme.palette.primary.light : theme.palette.grey[200],
    color: isAvailable ? theme.palette.primary.contrastText : theme.palette.text.disabled,
  },
  '&.treatment': {
    borderLeft: `3px solid ${theme.palette.warning.main}`,
  },
  '&.consultation': {
    borderLeft: `3px solid ${theme.palette.info.main}`,
  },
}));

interface TimeSlotSelectorProps {
  doctorId: number;
  onSlotSelect: (slot: TimeSlot) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ doctorId, onSlotSelect }) => {
  // Состояния компонента
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const currentLanguage = useLanguage();

  // Получение временных слотов для выбранной даты
  const fetchTimeSlots = async (date: Date) => {
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // JavaScript months are 0-based
      const response = await createApiRequest(
        `http://127.0.0.1:8000/api/doctors/doctors/${doctorId}/available_slots/?year=${year}&month=${month}`
      );
      
      if (!response.ok) {
        console.error('Server response:', await response.text());
        throw new Error('Failed to fetch slots');
      }
      
      const data = await response.json();
      console.log('Received slots:', data);
      
      // Фильтруем слоты только для выбранной даты (все слоты, включая недоступные)
      const selectedDateStr = format(date, 'yyyy-MM-dd');
      const filteredSlots = data.filter((slot: TimeSlot) => slot.date === selectedDateStr);
      
      setTimeSlots(filteredSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Перезагружаем слоты при смене языка
  React.useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [currentLanguage]);

  // Обработчики навигации по неделям
  const handlePrevWeek = () => {
    const newWeek = subWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
    if (selectedDate) {
      handleDateSelect(newWeek);
    }
  };

  const handleNextWeek = () => {
    const newWeek = addWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
    if (selectedDate) {
      handleDateSelect(newWeek);
    }
  };

  // Обработчик выбора даты
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    fetchTimeSlots(date);
  };

  // Получение дней текущей недели
  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  // Форматирование временных слотов для отображения
  const formatTimeSlots = () => {
    return timeSlots.reduce((acc: TimeSlot[][], slot, index) => {
      const rowIndex = Math.floor(index / 4); // Изменено с 5 на 4 для лучшего отображения
      if (!acc[rowIndex]) acc[rowIndex] = [];
      acc[rowIndex].push(slot);
      return acc;
    }, []);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Выберите удобное время
        </Typography>

      {/* Навигация по неделям */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button onClick={handlePrevWeek} startIcon={<ArrowBackIos />}>
          Предыдущая неделя
        </Button>
        <Button onClick={handleNextWeek} endIcon={<ArrowForwardIos />}>
          Следующая неделя
        </Button>
      </Box>

      {/* Календарь */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        {getWeekDays().map((date) => {
          const isToday = isSameDay(date, new Date());
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isDisabled = isBefore(date, startOfDay(new Date()));

          return (
            <Button
            key={date.toISOString()}
              onClick={() => !isDisabled && handleDateSelect(date)}
              variant={isSelected ? 'contained' : 'outlined'}
              disabled={isDisabled}
              sx={{
                minWidth: '100px',
                p: 1,
                borderColor: isToday ? 'primary.main' : 'grey.300',
                backgroundColor: isSelected ? 'primary.main' : 'transparent',
                '&:hover': {
                  backgroundColor: isSelected ? 'primary.dark' : 'grey.100',
                },
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" display="block">
              {format(date, 'EEEEEE', { locale: ru })}
            </Typography>
                <Typography variant="h6">
                  {format(date, 'd', { locale: ru })}
                </Typography>
                <Typography variant="caption" display="block">
                  {format(date, 'MMM', { locale: ru })}
            </Typography>
              </Box>
            </Button>
          );
        })}
      </Box>

      {/* Индикатор загрузки */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Временные слоты */}
      {!loading && selectedDate && (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {timeSlots.length === 0 ? (
            <Typography variant="body1" textAlign="center" color="text.secondary">
              На выбранную дату нет доступных слотов
            </Typography>
          ) : (
            formatTimeSlots().map((row, rowIndex) => (
          <Box 
            key={rowIndex} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2 
            }}
          >
            {row.map((slot) => (
              <TimeSlotButton
                key={slot.id}
                onClick={() => slot.is_available && onSlotSelect(slot)}
                className={slot.slot_type}
                isAvailable={slot.is_available}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: slot.is_available ? 'text.primary' : 'text.disabled' 
                  }}
                >
                      {format(parse(slot.start_time, 'HH:mm:ss', new Date()), 'HH:mm')}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    color: slot.is_available ? 'text.secondary' : 'text.disabled' 
                  }}
                >
                      {slot.slot_type === 'treatment' ? '40 мин' : '15 мин'}
                </Typography>
                {!slot.is_available && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      color: 'error.main',
                      fontSize: '0.7rem',
                      mt: 0.5
                    }}
                  >
                    Занят
                  </Typography>
                )}
              </TimeSlotButton>
            ))}
          </Box>
            ))
          )}
      </Box>
      )}

      {/* Легенда */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: 'info.light', borderRadius: 1 }} />
          <Typography variant="body2">Консультация (15 мин)</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: 'warning.light', borderRadius: 1 }} />
          <Typography variant="body2">Лечение (40 мин)</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: 'grey.200', borderRadius: 1, opacity: 0.6 }} />
          <Typography variant="body2" color="text.disabled">Занято</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TimeSlotSelector; 