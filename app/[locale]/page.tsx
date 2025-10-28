"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

export default function Home() {
  const t = useTranslations("home");

  return (
    <main className="min-h-screen p-8 vintage-texture flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <div className="absolute top-6 right-6">
          <LanguageSwitcher />
        </div>
        <div className="bg-vintage-light border-4 border-vintage-border rounded-lg p-12 vintage-shadow">
          <h1 className="text-6xl font-vintage text-vintage-sepia text-center mb-6 text-shadow-vintage">
            {t("title")}
          </h1>
          <p className="text-center text-vintage-dark text-xl mb-8">
            {t("subtitle")}
          </p>
          <p className="text-center text-vintage-dark mb-8">
            {t("description")}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-3 bg-vintage-sepia text-vintage-paper rounded-lg
                       hover:bg-vintage-dark transition-colors border-2 border-vintage-dark vintage-shadow
                       font-medium"
            >
              {t("getStarted")}
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-3 bg-vintage-border text-vintage-paper rounded-lg
                       hover:bg-vintage-dark transition-colors border-2 border-vintage-dark
                       font-medium"
            >
              {t("signIn")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
