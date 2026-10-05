import type { Locale, Messages } from '@play-badminton-nx/i18n';

// Type-safe locales and message keys for next-intl.
declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
