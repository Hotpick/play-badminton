# @play-badminton-nx/i18n

Shared translations for Play Badminton apps.

- `src/messages/<locale>.json` — message catalogs (`en` is the source of truth for keys and types).
- `locales`, `defaultLocale`, `Locale`, `Messages` — supported locales and types.
- `loadMessages(locale)` — lazily loads one locale's catalog.
- `@play-badminton-nx/i18n/messages/<locale>.json` — direct JSON import (e.g. in tests).

To add a locale: add `src/messages/<locale>.json`, then add it to `locales` and `loaders` in `src/index.ts`.
