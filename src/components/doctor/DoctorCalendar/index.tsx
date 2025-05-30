import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface DoctorCalendarProps {
  doctorId: string;
}

interface TimeSlot {
  id: number;
  date: string;
  start_time: string;
  is_available: boolean;
}

export const DoctorCalendar: React.FC<DoctorCalendarProps> = ({ doctorId }) => {
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear] = useState(currentDate.getFullYear());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await fetch(
          `/api/doctors/${doctorId}/available-slots?month=${selectedMonth + 1}&year=${selectedYear}`
        );
        const data = await response.json();
        setAvailableSlots(data);
      } catch (error) {
        console.error('Error fetching available slots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [doctorId, selectedMonth, selectedYear]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateAvailable = (date: number) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return availableSlots.some(slot => slot.date === dateStr && slot.is_available);
  };

  const isDateSelectable = (date: number) => {
    const selectedDate = new Date(selectedYear, selectedMonth, date);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days from now
    return selectedDate >= currentDate && selectedDate <= maxDate;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.dayCell} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isAvailable = isDateAvailable(day);
      const selectable = isDateSelectable(day);
      days.push(
        <div
          key={day}
          className={`${styles.dayCell} ${
            isAvailable && selectable ? styles.available : ''
          } ${!selectable ? styles.disabled : ''}`}
          onClick={() => {
            if (isAvailable && selectable) {
              // Handle date selection
              console.log(`Selected date: ${selectedYear}-${selectedMonth + 1}-${day}`);
            }
          }}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  if (loading) return <div>Loading calendar...</div>;

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <h3>{new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
        <div className={styles.monthSelector}>
          <button
            onClick={() => setSelectedMonth(selectedMonth - 1)}
            disabled={selectedMonth === currentDate.getMonth()}
          >
            Previous
          </button>
          <button
            onClick={() => setSelectedMonth(selectedMonth + 1)}
            disabled={selectedMonth === currentDate.getMonth() + 1}
          >
            Next
          </button>
        </div>
      </div>
      
      <div className={styles.weekDays}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className={styles.weekDay}>{day}</div>
        ))}
      </div>
      
      <div className={styles.days}>
        {renderCalendar()}
      </div>
    </div>
  );
}; 