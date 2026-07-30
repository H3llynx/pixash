<script setup lang="ts">
import Dropdown from "../../../components/Dropdown.vue";
import { SUPPORTED_LANGUAGES } from "../../../config/i18n";
import { useLanguageSwitcher } from "../composable/useLanguageSwitcher";
const { locale, setLanguage } = useLanguageSwitcher();

console.log(locale.value);

const labels: Record<string, string> = {
    en: "EN",
    es: "ES",
};

const changeLanguage = (e: Event) => {
    const val = (e.target as HTMLSelectElement)?.value;
    if (val) setLanguage(val);
}
</script>

<template>
    <Dropdown v-model="locale" @change="changeLanguage" class="ml-0.5">
        <option v-for="lang in SUPPORTED_LANGUAGES" :key="lang" :value="lang">
            {{ labels[lang] }}
        </option>
    </Dropdown>
</template>