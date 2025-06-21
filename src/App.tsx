import React from 'react';
// Импортируем компоненты роутинга из react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Импортируем страницы приложения
import HomePage from './pages/HomePage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import SlotSelectionPage from './pages/SlotSelectionPage';
import AppointmentConfirmationPage from './pages/AppointmentConfirmationPage';
import AppointmentSuccessPage from './pages/AppointmentSuccessPage';
import LanguageSwitcher from './components/LanguageSwitcher';

// Главный компонент приложения
const App: React.FC = () => (
  // Router обеспечивает работу маршрутизации в приложении
  <Router>
    {/* Шапка с переключателем языка */}
    <header style={{ padding: 16, borderBottom: '1px solid #eee', marginBottom: 24, display: 'flex', justifyContent: 'flex-end' }}>
      <LanguageSwitcher />
    </header>
    {/* Routes содержит все маршруты приложения */}
    <Routes>
      {/* Главная страница */}
      <Route path="/" element={<HomePage />} />
      
      {/* Детальная страница врача */}
      <Route path="/doctors/:id" element={<DoctorDetailPage />} />
      
      {/* Выбор слота для записи к врачу */}
      <Route path="/doctor/:id/slots" element={<SlotSelectionPage />} />

      {/* Подтверждение записи */}
      <Route path="/appointment-confirmation/:doctorId/:slotId" element={<AppointmentConfirmationPage />} />

      {/* Страница успешной записи */}
      <Route path="/appointment-success/:doctorId" element={<AppointmentSuccessPage />} />
    </Routes>
  </Router>
);

export default App;
