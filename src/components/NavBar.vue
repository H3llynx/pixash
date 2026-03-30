<script setup lang="ts">
import { Calendar, History, LayoutGrid, MapPin } from '@lucide/vue';
import { RouterLink } from 'vue-router';
import { ROUTES } from '../router/config';

</script>

<template>
    <nav class="bg-bg-2 w-screen flex justify-between p-1 fixed bottom-0">
        <RouterLink :to="ROUTES.dashboard">
            <LayoutGrid />Home
        </RouterLink>
        <RouterLink to="/">
            <Calendar />Calendar
        </RouterLink>
        <RouterLink to="/">
            <MapPin />Vet
        </RouterLink>
        <RouterLink to="/">
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
}

nav a.router-link-exact-active {
    color: var(--color-brand);
}
</style>
