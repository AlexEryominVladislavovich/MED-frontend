import React from 'react';
// Импортируем компоненты роутинга из react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Импортируем страницы приложения
import HomePage from './pages/HomePage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import SlotSelectionPage from './pages/SlotSelectionPage';

// Главный компонент приложения
const App: React.FC = () => (
  // Router обеспечивает работу маршрутизации в приложении
  <Router>
    {/* Routes содержит все маршруты приложения */}
    <Routes>
      {/* Главная страница */}
      <Route path="/" element={<HomePage />} />
      
      {/* Детальная страница врача */}
      <Route path="/doctors/:id" element={<DoctorDetailPage />} />
      
      {/* Выбор слота для записи к врачу */}
      <Route path="/doctor/:id/slots" element={<SlotSelectionPage />} />
    </Routes>
  </Router>
);

export default App;
