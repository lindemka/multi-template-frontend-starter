'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale, type Locale } from '@/i18n/config';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  messages: Record<string, unknown>;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

interface LocaleProviderProps {
  children: ReactNode;
  initialMessages: Record<string, unknown>;
}

export function LocaleProvider({ children, initialMessages }: LocaleProviderProps) {
  const timeZone = 'Europe/Berlin'
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const setLocale = useCallback(async (newLocale: Locale): Promise<void> => {
    if (newLocale === locale || isLoading) return;

    setIsLoading(true);

    try {
      // Load new messages with error handling
      let newMessages;
      try {
        newMessages = (await import(`../../messages/${newLocale}.json`)).default;
      } catch (importError) {
        console.warn(`Failed to load messages for ${newLocale}, using fallback`);
        newMessages = initialMessages; // Use initial messages as fallback
      }

      // Update state atomically
      setLocaleState(newLocale);
      setMessages(newMessages);

      // Save to cookie with error handling
      try {
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
      } catch (cookieError) {
        console.warn('Failed to save locale to cookie:', cookieError);
      }
    } catch (error) {
      console.error('Failed to change locale:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [locale, isLoading, initialMessages]);

  // Load locale from cookie on mount with better error handling
  useEffect(() => {
    if (isInitialized) return;

    try {
      const savedLocale = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];

      if (savedLocale && (savedLocale === 'en' || savedLocale === 'de')) {
        setLocale(savedLocale as Locale).catch((error) => {
          console.error('Failed to restore saved locale:', error);
        });
      }
    } catch (error) {
      console.error('Failed to read locale from cookie:', error);
    } finally {
      setIsInitialized(true);
    }
  }, [setLocale, isInitialized]);

  // Prevent rendering until initialized to avoid hydration mismatches
  if (!isInitialized) {
    return (
      <NextIntlClientProvider locale={defaultLocale} messages={initialMessages} timeZone={timeZone}>
        {children}
      </NextIntlClientProvider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, messages, isLoading }}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleContext must be used within LocaleProvider');
  }
  return context;
}