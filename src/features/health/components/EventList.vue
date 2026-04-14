<script setup lang="ts">
import type { VaccineExtended } from '../types';
import EventCard from './EventCard.vue';

defineProps<{
    title: string
    events: VaccineExtended[]
}>();
</script>

<template>
    <section class="pet-section md:w-max">
        <h2>{{ title }}</h2>
        <EventCard v-for="event in events" :event="event" />
    </section>
</template>