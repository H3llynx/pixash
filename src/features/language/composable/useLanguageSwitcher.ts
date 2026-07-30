import { useI18n } from "vue-i18n";
import { detectBrowserLanguage, STORED_LANGUAGE, SUPPORTED_LANGUAGES } from "../../../config/i18n";

export const useLanguageSwitcher = () => {
    const { locale } = useI18n({ useScope: "global" });

    const setLanguage = (newLocale: string) => {
        if (!SUPPORTED_LANGUAGES.includes(newLocale)) return;

        locale.value = newLocale;
        if (newLocale === detectBrowserLanguage()) {
            localStorage.removeItem(STORED_LANGUAGE);
        } else {
            localStorage.setItem(STORED_LANGUAGE, newLocale);
        }
    }

    return {
        locale,
        setLanguage
    };
}