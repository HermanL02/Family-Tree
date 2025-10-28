import { getRequestConfig } from 'next-intl/server';

// List of all supported locales
export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Use default locale if the incoming locale is not valid
  const validLocale: string = (locale && locales.includes(locale as Locale)) ? locale : 'zh';

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});
