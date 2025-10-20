import { useRouter } from "next/router";
import { useEffect, useCallback } from "react";
import { twMerge } from "tailwind-merge";

const LANGUAGES = {
  en: { full: "English", short: "EN", flag: "🇬🇧" },
  fr: { full: "Français", short: "FR", flag: "🇫🇷" },
};

const LanguageSwitcher = ({ className = "" }) => {
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
        { locale: savedLocale, scroll: false },
      );
    }
  }, []);

  const onChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLocale = e.target.value;
      localStorage.setItem("locale", newLocale);

      router.push(
        {
          pathname: router.pathname,
          query: router.query,
        },
        router.asPath,
        { locale: newLocale, scroll: false },
      );

    },
    [router],
  );

  return (
    <div
      className={twMerge(
        "fixed bottom-20 right-5 z-[30] overflow-hidden  bg-white shadow-md lg:bottom-5",
        className,
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

export default LanguageSwitcher