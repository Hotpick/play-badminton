import type en from './messages/en.json';

export const locales = ['en', 'pl'] as const;
export const defaultLocale = 'en' satisfies Locale;

export type Locale = (typeof locales)[number];
export type Messages = typeof en;

const loaders: Record<Locale, () => Promise<{ default: Messages }>> = {
  en: () => import('./messages/en.json', { with: { type: 'json' } }),
  pl: () => import('./messages/pl.json', { with: { type: 'json' } }),
};

export async function loadMessages(locale: Locale): Promise<Messages> {
  return (await loaders[locale]()).default;
}
