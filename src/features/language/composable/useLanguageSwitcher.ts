import { useI18n } from "vue-i18n";
import { detectBrowserLanguage, SUPPORTED_LANGUAGES } from "../config/i18n";

export const useLanguageSwitcher = () => {
    const { locale } = useI18n({ useScope: "global" });

    const setLanguage = (newLanguage: string) => {
        const isSupportedLanguage = SUPPORTED_LANGUAGES.some(({ id }) => id === newLanguage);
        if (!isSupportedLanguage) return;
        locale.value = newLanguage;
        if (newLanguage === detectBrowserLanguage()) {
            localStorage.removeItem("language");
        } else {
            localStorage.setItem("language", newLanguage);
        }
    }

    return { setLanguage, locale };
}