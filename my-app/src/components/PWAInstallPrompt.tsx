// src/components/PWAInstallPrompt.tsx
import { type FC, useState, useEffect } from 'react';
import './PWAInstallPrompt.css';

// Тип для BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      // Предотвращаем автоматическое отображение браузерного промпта
      e.preventDefault();
      // Сохраняем событие для использования позже
      setDeferredPrompt(e);
      // Показываем наш кастомный промпт
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);

    // Проверяем, установлено ли уже приложение
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Приложение запущено в standalone режиме');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Показываем браузерный промпт установки
    deferredPrompt.prompt();

    // Ждем выбора пользователя
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Пользователь принял установку PWA');
    } else {
      console.log('Пользователь отклонил установку PWA');
    }

    // Очищаем сохраненное событие
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-content">
        <div className="pwa-install-icon">⚗️</div>
        <div className="pwa-install-text">
          <h3>Установить приложение</h3>
          <p>Установите "Производство аспирина" для быстрого доступа и работы оффлайн</p>
        </div>
        <div className="pwa-install-buttons">
          <button 
            className="pwa-install-btn primary"
            onClick={handleInstallClick}
          >
            Установить
          </button>
          <button 
            className="pwa-install-btn secondary"
            onClick={handleDismiss}
          >
            Позже
          </button>
        </div>
      </div>
    </div>
  );
};