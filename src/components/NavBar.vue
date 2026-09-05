<script setup lang="ts">
import { Calendar, History, LayoutGrid, MapPin } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { usePets } from '../features/pets/composables/usePets';
import { ROUTES } from '../router/config';

const { hasPets } = usePets();
const { t } = useI18n();
</script>

<template>
    <nav
        class="bg-bg-2 w-screen p-0.5 md:py-5 fixed bottom-0 h-5 md:min-h-screen overflow-y-scroll md:w-max flex md:flex-col justify-evenly md:justify-start gap-2 md:gap-1">
        <RouterLink :to="ROUTES.dashboard" tabindex="0">
            <LayoutGrid />{{ t("common.navbar.home") }}
        </RouterLink>
        <RouterLink :to="ROUTES.calendar" :tabindex="hasPets ? 0 : -1" :aria-disabled="!hasPets"
            :class="{ 'animate-pulse pointer-events-none': !hasPets }" @click="!hasPets && $event.preventDefault()">
            <Calendar />{{ t("common.navbar.calendar") }}
        </RouterLink>
        <RouterLink :to="ROUTES.vet" :tabindex="hasPets ? 0 : -1" :aria-disabled="!hasPets"
            :class="{ 'animate-pulse pointer-events-none': !hasPets }" @click="!hasPets && $event.preventDefault()">
            <MapPin />{{ t("common.navbar.vet") }}
        </RouterLink>
        <RouterLink :to="ROUTES.history" :tabindex="hasPets ? 0 : -1" :aria-disabled="!hasPets"
            :class="{ 'animate-pulse pointer-events-none': !hasPets }" @click="!hasPets && $event.preventDefault()">
            <History />{{ t("common.navbar.history") }}
        </RouterLink>
    </nav>
</template>

<style scoped>
nav {
    box-shadow: 0 18px 30px var(--color-charcoal-rgba);

    &::-webkit-scrollbar {
        display: none;
    }
}

nav a {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    font-size: small;
    padding: 0.5rem;
    aspect-ratio: 1/1;

    &:not(.router-link-exact-active) {
        opacity: 0.5
    }

    &:focus-visible {
        outline: none;
        background: var(--color-accent-rgba);
    }
}

nav a.router-link-exact-active {
    color: var(--color-text);

    &:focus-visible {
        outline: none;
    }
}

@media (width >=48rem) {
    nav {
        box-shadow: 0 0px 2px var(--color-border);
    }
}
</style>
