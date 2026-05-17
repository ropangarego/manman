import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(available: boolean) => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener(Boolean(deferredPrompt)));
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyListeners();
  });
}

export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(Boolean(deferredPrompt));

  useEffect(() => {
    listeners.add(setCanInstall);
    setCanInstall(Boolean(deferredPrompt));

    return () => {
      listeners.delete(setCanInstall);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return 'unavailable' as const;
    }

    const prompt = deferredPrompt;
    deferredPrompt = null;
    notifyListeners();
    await prompt.prompt();
    const choice = await prompt.userChoice;

    return choice.outcome;
  };

  return { canInstall, promptInstall };
}
