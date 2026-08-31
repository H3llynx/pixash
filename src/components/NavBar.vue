<script setup lang="ts">
import { Calendar, History, LayoutGrid, MapPin } from '@lucide/vue';
import { LottieAnimation } from 'lottie-web-vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import happyDog from '../assets/animations/happy-dog.json';
import kitty from '../assets/animations/kitty.json';
import { useMedia } from '../composables/useMedia';
import { usePets } from '../features/pets/composables/usePets';
import { ROUTES } from '../router/config';
import Logo from './Logo.vue';

const { isMd } = useMedia();
const { hasPets } = usePets();
const { t } = useI18n();
</script>

<template>
    <nav
        class="bg-bg-2 w-screen p-1 fixed bottom-0 h-5 md:min-h-screen overflow-y-scroll md:w-18 md:bg-nav flex md:flex-col justify-between gap-2">
        <Logo class="hidden md:flex mb-1" />
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
        <div v-if="isMd" class="relative mt-auto">
            <LottieAnimation :animationData="happyDog" :loop="true" :autoplay="true" :speed="1" class="dog" />
            <LottieAnimation :animationData="kitty" :loop="true" :autoplay="true" :speed="1" class="cat" />
        </div>
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
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);

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
        opacity: 0.8
    }

    &:focus-visible {
        outline: none;
        color: var(--color-gold);
    }
}

nav a.router-link-exact-active {
    color: var(--color-brand);

    &:focus-visible {
        outline: none;
    }
}

@media (width >=48rem) {
    nav {
        box-shadow: 0 20px rgba(0, 0, 0, 0.4);
    }

    nav a {
        flex-direction: row;
        padding-left: 1rem;
        color: var(--color-text-nav);
    }

    nav a.router-link-exact-active {
        color: var(--color-text-nav-active);
    }
}
</style>
