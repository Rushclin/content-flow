import { useRouter } from "next/router";
import { useEffect, useCallback, ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

const LANGUAGES = {
  en: { full: "English", short: "EN", flag: "🇬🇧" },
  fr: { full: "Français", short: "FR", flag: "🇫🇷" },
};

export default function LanguageSwitcher({ className = "" }) {
  const router = useRouter();

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale");
    if (savedLocale && savedLocale !== router.locale) {
      router.push(
        {
          pathname: router.pathname,
          query: router.query,
        },
        router.asPath,
        { locale: savedLocale, scroll: false }
      );
    }
  }, [router]);

  const updateUserLanguage = useCallback(async (lang: string) => {
    console.log("New language => ", lang);
  }, []);

  const onChange = useCallback(
    async (e: ChangeEvent<HTMLSelectElement>) => {
      const newLocale = e.target.value;
      localStorage.setItem("locale", newLocale);

      router.push(
        {
          pathname: router.pathname,
          query: router.query,
        },
        router.asPath,
        { locale: newLocale, scroll: false }
      );

      updateUserLanguage(newLocale);
    },
    [router, updateUserLanguage]
  );

  return (
    <div
      className={twMerge(
        "fixed bottom-20 right-5 z-[30] overflow-hidden rounded-md bg-white shadow-md p-1 lg:bottom-5",
        className
      )}
    >
      <label className="sr-only hidden" htmlFor="language-switcher-desktop">
        Choose your language
      </label>
      <select
        id="language-switcher-desktop"
        className="hidden cursor-pointer border-none text-center text-sm transition-colors hover:bg-gray-50 lg:inline-block"
        onChange={onChange}
        value={router.locale}
      >
        {Object.entries(LANGUAGES).map(([key, { full, flag }]) => (
          <option key={key} value={key}>
            {flag} {full}
          </option>
        ))}
      </select>

      <select
        id="language-switcher-mobile"
        className="inline-block cursor-pointer border-none text-center text-sm transition-colors hover:bg-gray-50 lg:hidden"
        onChange={onChange}
        value={router.locale}
      >
        {Object.entries(LANGUAGES).map(([key, { short, flag }]) => (
          <option key={key} value={key}>
            {flag} {short}
          </option>
        ))}
      </select>
    </div>
  );
}
