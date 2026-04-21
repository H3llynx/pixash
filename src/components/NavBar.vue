<script setup lang="ts">
import { Calendar, History, LayoutGrid, MapPin } from '@lucide/vue';
import { LottieAnimation } from 'lottie-web-vue';
import { RouterLink } from 'vue-router';
import happyDog from '../assets/animations/happy-dog.json';
import kitty from '../assets/animations/kitty.json';
import { useMedia } from '../composables/useMedia';
import { ROUTES } from '../router/config';
import Logo from './Logo.vue';

const { isMd } = useMedia();
</script>

<template>
    <nav class="bg-bg-2 w-screen flex justify-between items-center p-1 gap-2 fixed bottom-0 h-5
        md:h-screen md:w-18 md:flex-col md:items-start md:justify-start md:bg-nav">
        <Logo class="hidden md:flex pb-1" />
        <RouterLink :to="ROUTES.dashboard" tabindex="0">
            <LayoutGrid />Home
        </RouterLink>
        <RouterLink :to="ROUTES.calendar" tabindex="0">
            <Calendar />Calendar
        </RouterLink>
        <RouterLink :to="ROUTES.vet" tabindex="0">
            <MapPin />Vet
        </RouterLink>
        <RouterLink to="/" tabindex="0">
            <History />History
        </RouterLink>

        <div v-if="isMd" class="absolute bottom-0 left-0">
            <LottieAnimation :animationData="happyDog" :loop="true" :autoplay="true" :speed="1" class="dog" />
            <LottieAnimation :animationData="kitty" :loop="true" :autoplay="true" :speed="1" class="cat" />
        </div>
    </nav>
</template>

<style scoped>
.dog {
    position: absolute;
    bottom: 0;
    width: 100%;
}

.cat {
    width: 80%;
}

nav {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

nav a {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    color: var(--color-text-secondary);
    font-size: small;

    &:not(.router-link-exact-active) {
        opacity: 0.8
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
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
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
