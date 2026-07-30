import { createI18n } from "vue-i18n";
import en from "./locales/en";
import es from "./locales/es";

export const SUPPORTED_LANGUAGES = ["en", "es"];
export const STORED_LANGUAGE = "locale";

export const detectBrowserLanguage = () => {
  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const lang of browserLanguages) {
    const short = lang.toLowerCase().split("-")[0];
    if (SUPPORTED_LANGUAGES.includes(short)) {
      return short;
    }
  }

  return "en";
}

export const resolveInitialLanguage = () => {
  const stored = localStorage.getItem(STORED_LANGUAGE);
  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    return stored;
  }
  return detectBrowserLanguage();
}

export const i18n = createI18n({
  legacy: false,
  locale: resolveInitialLanguage(),
  fallbackLocale: "en",
  messages: { en, es },
});