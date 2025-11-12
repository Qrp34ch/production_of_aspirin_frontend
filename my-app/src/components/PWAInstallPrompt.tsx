import { type FC, useState, useEffect } from 'react';
import './PWAInstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Приложение запущено в standalone режиме');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Пользователь принял установку PWA');
    } else {
      console.log('Пользователь отклонил установку PWA');
    }

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