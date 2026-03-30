import { ref } from "vue";

type Theme = "light" | "dark";

const getSystemPreference = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const theme = ref(localStorage.getItem("theme") || getSystemPreference());

const applyTheme = (theme: Theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
};

applyTheme(theme.value as Theme);

const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    applyTheme(newTheme);
}

export const useTheme = () => { return { theme, setTheme } };