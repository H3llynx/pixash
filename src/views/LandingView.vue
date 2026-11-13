<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Header from '../components/Header.vue';
import Calendar from '../features/landing/components/Calendar.vue';
import Hero from '../features/landing/components/Hero.vue';
import OtherFeatures from '../features/landing/components/OtherFeatures.vue';
import Treatments from '../features/landing/components/Treatments.vue';
import { useTheme } from '../features/theme/composables/useTheme.ts';

const { theme } = useTheme();
const { t } = useI18n();
</script>

<template>
    <Header class="sticky top-0 bg-bg-rgba filter-blur z-1 shadow-lg shadow-border/15" />
    <Hero />
    <Calendar />
    <Treatments />
    <OtherFeatures />
    <footer :class="{
        'default-padding py-2 flex flex-col md:flex-row md:gap-2 md:justify-between text-text-secondary text-center': true, 'bg-bg-2': theme === 'light'
    }">
        <span>© 2026 Pixash</span>
        <span>{{ t('landing.footer') }}</span>
    </footer>
</template>

<style scoped>
:deep(h2) {
    font-family: var(--font-main);
    font-size: small;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 1px;
    color: var(--color-accent);
}

:deep(h1) {
    color: var(--color-text);
    font-weight: bold;
}
</style>