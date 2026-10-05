import { defaultLocale, locales } from '@play-badminton-nx/i18n';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales,
  defaultLocale,
});
