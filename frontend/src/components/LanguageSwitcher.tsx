'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { locales, localeNames, localeFlags, type Locale, defaultLocale } from '@/i18n/config';
import { useLocaleContext } from '@/providers/LocaleProvider';

export function LanguageSwitcher() {
  // Handle case where component is rendered during static export
  let currentLocale, setLocale, isLoading;
  try {
    const context = useLocaleContext();
    currentLocale = context.locale;
    setLocale = context.setLocale;
    isLoading = context.isLoading;
  } catch (error) {
    // Fallback for server-side rendering during static export
    currentLocale = defaultLocale;
    setLocale = async () => {};
    isLoading = false;
  }

  const handleLocaleChange = async (newLocale: Locale) => {
    if (newLocale === currentLocale || isLoading) return;
    
    try {
      await setLocale(newLocale);
    } catch (error) {
      console.error('Failed to change locale:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 px-0"
          disabled={isLoading}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`cursor-pointer ${locale === currentLocale ? 'bg-accent' : ''}`}
          >
            <span className="mr-2">{localeFlags[locale]}</span>
            <span>{localeNames[locale]}</span>
            {locale === currentLocale && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}