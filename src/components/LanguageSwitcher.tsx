import React from 'react';

const LANGUAGES = [
  { code: 'ru', label: 'Русский' },
  { code: 'ky', label: 'Кыргызча' },
];

const getCurrentLang = (): string => {
  return localStorage.getItem('lang') || 'ru';
};

const setLang = (lang: string) => {
  localStorage.setItem('lang', lang);
  
  // Создаем кастомное событие для уведомления компонентов о смене языка
  const languageChangeEvent = new CustomEvent('languageChanged', { 
    detail: { language: lang } 
  });
  window.dispatchEvent(languageChangeEvent);
};

const LanguageSwitcher: React.FC = () => {
  const currentLang = getCurrentLang();

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          disabled={currentLang === code}
          style={{
            fontWeight: currentLang === code ? 'bold' : 'normal',
            opacity: currentLang === code ? 0.7 : 1,
            cursor: currentLang === code ? 'default' : 'pointer',
            borderRadius: 4,
            border: '1px solid #ccc',
            padding: '4px 12px',
            background: currentLang === code ? '#e0e0e0' : '#fff',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher; 