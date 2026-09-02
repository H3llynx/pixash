<script setup lang="ts">
import { Calendar, History, LayoutGrid, MapPin } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { useMedia } from '../composables/useMedia';
import { usePets } from '../features/pets/composables/usePets';
import { ROUTES } from '../router/config';

const { isMd } = useMedia();
const { hasPets } = usePets();
const { t } = useI18n();
</script>

<template>
    <nav
        class="bg-bg-2 w-screen p-1 md:py-5 fixed bottom-0 h-5 md:min-h-screen overflow-y-scroll md:w-max flex md:flex-col justify-between md:justify-start gap-2">
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
.dog {
    position: absolute;
    bottom: 0;
    width: 110%;
    left: -5%;
}

.cat {
    width: 90%;
}

nav {
    box-shadow: 0 4px 30px var(--color-border);

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

    &:not(.router-link-exact-active) {
        opacity: 0.5
    }

    &:focus-visible {
        outline: none;
        color: var(--color-gold);
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
