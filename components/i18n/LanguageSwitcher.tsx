"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

export default function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const switchLanguage = (newLocale: string) => {
    startTransition(() => {
      // Remove current locale from pathname if it exists
      const pathnameWithoutLocale = pathname.replace(/^\/(zh|en)/, "") || "/";

      // Add new locale prefix if not default
      const newPath = newLocale === "zh"
        ? pathnameWithoutLocale
        : `/${newLocale}${pathnameWithoutLocale}`;

      router.push(newPath);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="px-3 py-2 bg-vintage-light border-2 border-vintage-border rounded
                   hover:bg-vintage-paper transition-colors flex items-center gap-2
                   disabled:opacity-50"
        aria-label={t("language")}
      >
        <span>{currentLanguage?.flag}</span>
        <span className="text-sm font-medium text-vintage-dark">
          {currentLanguage?.name}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-vintage-light border-2 border-vintage-border rounded-lg vintage-shadow z-20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                disabled={locale === lang.code}
                className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-vintage-paper transition-colors first:rounded-t-lg last:rounded-b-lg
                  ${locale === lang.code ? "bg-vintage-sepia text-vintage-paper font-semibold" : "text-vintage-dark"}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {locale === lang.code && (
                  <span className="ml-auto">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
