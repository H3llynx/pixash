<script setup lang="ts">
import type { VaccineExtended } from '../types';
import EventCard from './EventCard.vue';

withDefaults(defineProps<{
    title: string
    events: VaccineExtended[]
    location?: "dashboard" | "calendar"
}>(), { location: "dashboard" });
</script>

<template>
    <section :class="{ 'md:px-0': location === 'calendar', 'pet-section mb-1': true }">
        <h2 :class="{ 'md:hidden': location === 'calendar' }">{{ title }}</h2>
        <EventCard v-for="event in events" :event="event" />
    </section>
</template>