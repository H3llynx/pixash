import { useLocalStorage } from "@vueuse/core";

type Theme = "light" | "dark";

const getSystemPreference = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const theme = useLocalStorage<Theme>("theme", getSystemPreference())

const applyTheme = (theme: Theme) => {
    document.documentElement.dataset.theme = theme;
};

applyTheme(theme.value as Theme);

const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    applyTheme(newTheme);
}

export const useTheme = () => { return { theme, setTheme } };