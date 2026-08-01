import { createI18n } from "vue-i18n";
import en from "./locales/en";
import es from "./locales/es";

export const SUPPORTED_LANGUAGES = [{ id: "en", label: "english" }, { id: "es", label: "español" }];
export const SUPPORTED_LANGUAGES_IDS = SUPPORTED_LANGUAGES.map(({ id }) => id);

export const detectBrowserLanguage = () => {
  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const lang of browserLanguages) {
    const short = lang.toLowerCase().split("-")[0];
    if (SUPPORTED_LANGUAGES_IDS.includes(short)) {
      return short;
    }
  }

  return "en";
};

export const resolveInitialLanguage = () => {
  const stored = localStorage.getItem("language");
  if (stored && SUPPORTED_LANGUAGES_IDS.includes(stored)) {
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