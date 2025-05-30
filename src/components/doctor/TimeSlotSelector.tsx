import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, styled } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TimeSlot } from '../../types';

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

const TimeSlotButton = styled(Box)(({ theme }) => ({
  padding: '8px 16px',
  backgroundColor: theme.palette.grey[50],
  borderRadius: '20px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  '&.examination': {
    borderLeft: `3px solid ${theme.palette.info.main}`,
  },
  '&.treatment': {
    borderLeft: `3px solid ${theme.palette.warning.main}`,
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

  // Получение временных слотов для выбранной даты
  const fetchTimeSlots = async (date: Date) => {
    setLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await fetch(
        `http://127.0.0.1:8000/api/doctors/${doctorId}/available-slots/?date=${formattedDate}`
      );
      if (!response.ok) throw new Error('Failed to fetch slots');
      const data = await response.json();
      setTimeSlots(data);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Обработчики навигации по неделям
  const handlePrevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const handleNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));

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
      const rowIndex = Math.floor(index / 5);
      if (!acc[rowIndex]) acc[rowIndex] = [];
      acc[rowIndex].push(slot);
      return acc;
    }, []);
  };

  // Форматирование времени для отображения
  const formatTime = (time: string) => {
    return time.substring(0, 5); // Обрезаем секунды
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', p: 2 }}>
      {/* Заголовок с месяцем и навигацией */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        mb: 2,
        position: 'relative'
      }}>
        <IconButton 
          onClick={handlePrevWeek}
          sx={{ position: 'absolute', left: 0, padding: '4px' }}
          size="small"
        >
          <ChevronLeft fontSize="small" />
        </IconButton>
        
        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
          {format(currentWeek, 'LLLL', { locale: ru })}
        </Typography>

        <IconButton 
          onClick={handleNextWeek}
          sx={{ position: 'absolute', right: 0, padding: '4px' }}
          size="small"
        >
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>

      {/* Дни недели */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 2,
        gap: 0.5
      }}>
        {getWeekDays().map((date) => (
          <WeekDayButton
            key={date.toISOString()}
            onClick={() => handleDateSelect(date)}
            className={selectedDate && isSameDay(date, selectedDate) ? 'selected' : ''}
          >
            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
              {format(date, 'EEEEEE', { locale: ru })}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
              {format(date, 'd')}
            </Typography>
          </WeekDayButton>
        ))}
      </Box>

      {/* Временные слоты */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {formatTimeSlots().map((row, rowIndex) => (
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
                onClick={() => onSlotSelect(slot)}
                className={slot.slot_type}
                sx={{
                  opacity: slot.is_available ? 1 : 0.5,
                  pointerEvents: slot.is_available ? 'auto' : 'none',
                }}
              >
                <Typography variant="body2">
                  {formatTime(slot.start_time)}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                  {slot.duration} мин
                </Typography>
              </TimeSlotButton>
            ))}
          </Box>
        ))}
      </Box>

      {/* Легенда */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 3, 
        mt: 4,
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            backgroundColor: 'info.main', 
            borderRadius: 1 
          }} />
          <Typography variant="caption">Обследование</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            backgroundColor: 'warning.main',
            borderRadius: 1
          }} />
          <Typography variant="caption">Лечение</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TimeSlotSelector; 