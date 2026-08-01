<script setup lang="ts">
import Dropdown from "../../../components/Dropdown.vue";
import { useLanguageSwitcher } from "../composable/useLanguageSwitcher";
import { SUPPORTED_LANGUAGES } from "../config/i18n.ts";
const { locale, setLanguage } = useLanguageSwitcher();

const changeLanguage = (e: Event) => {
    const language = (e.target as HTMLSelectElement)?.value;
    if (language) setLanguage(language);
}
</script>

<template>
    <Dropdown v-model="locale" @change="changeLanguage"
        class="ml-0.5 w-max shrink-0 text-sm md:text-base border-0 bg-transparent">
        <option v-for="lang in SUPPORTED_LANGUAGES" :key="lang.id" :value="lang.id" aria-label="lang.label">
            {{ lang.id.toUpperCase() }}
        </option>
    </Dropdown>
</template>