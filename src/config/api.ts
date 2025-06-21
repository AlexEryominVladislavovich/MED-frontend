export const API_URL = 'http://127.0.0.1:8000';

// Type definitions
type IdParam = string | number;

// Helper function to ensure ID is valid
const validateId = (id: IdParam): IdParam => {
  if (id === undefined || id === null) {
    throw new Error('Invalid ID parameter');
  }
  return id;
};

// Get current language from localStorage
export const getCurrentLanguage = (): string => {
  return localStorage.getItem('lang') || 'ru';
};

// Create API request with language support
export const createApiRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const currentLang = getCurrentLanguage();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept-Language': currentLang,
  };

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  return fetch(url, requestOptions);
};

// Hook for language changes (moved here to avoid circular imports)
import { useState, useEffect } from 'react';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    // Слушаем событие смены языка
    window.addEventListener('languageChanged', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  return currentLanguage;
};

export const API_ENDPOINTS = {
  doctors: {
    list: `${API_URL}/api/doctors/doctors/`,
    detail: (id: IdParam) => `${API_URL}/api/doctors/doctors/${validateId(id)}/`,
    availableSlots: (id: IdParam) => `${API_URL}/api/doctors/doctors/${validateId(id)}/available-slots/`,
    createAppointment: (id: IdParam) => `${API_URL}/api/doctors/doctors/${validateId(id)}/create-appointment/`,
  },
  timeSlots: {
    detail: (id: IdParam) => `${API_URL}/api/doctors/time-slots/${validateId(id)}/`,
  }
}; 