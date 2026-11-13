<script setup lang="ts">
import Header from '../components/Header.vue';
import Calendar from '../features/landing/components/Calendar.vue';
import Hero from '../features/landing/components/Hero.vue';
import OtherFeatures from '../features/landing/components/OtherFeatures.vue';
import Treatments from '../features/landing/components/Treatments.vue';
</script>

<template>
    <Header class="sticky top-0 bg-bg z-1" />
    <Hero />
    <Calendar />
    <Treatments />
    <OtherFeatures />
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