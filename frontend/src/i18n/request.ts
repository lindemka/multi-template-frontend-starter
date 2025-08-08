import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, type Locale } from './config';

export default getRequestConfig(async () => {
  // For static export, we'll use the default locale on the server
  // Client-side locale switching will be handled by the LanguageSwitcher component
  const locale = defaultLocale as Locale;

  return {
    locale,
    timeZone: 'Europe/Berlin',
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});