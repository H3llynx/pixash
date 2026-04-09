<script setup lang="ts">
import { Calendar, History, LayoutGrid, MapPin } from '@lucide/vue';
import { RouterLink } from 'vue-router';
import { ROUTES } from '../router/config';
import Logo from './Logo.vue';
</script>

<template>
    <nav class="bg-bg-2 w-screen flex justify-between items-center p-1 gap-2 fixed bottom-0 h-5
        md:h-screen md:w-15 md:flex-col md:items-start md:justify-start md:bg-bg-nav">
        <Logo class="hidden md:flex pb-1" />
        <RouterLink :to="ROUTES.dashboard" tabindex="0">
            <LayoutGrid />Home
        </RouterLink>
        <RouterLink to="/" tabindex="0">
            <Calendar />Calendar
        </RouterLink>
        <RouterLink to="/" tabindex="0">
            <MapPin />Vet
        </RouterLink>
        <RouterLink to="/" tabindex="0">
            <History />History
        </RouterLink>
    </nav>
</template>

<style scoped>
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
