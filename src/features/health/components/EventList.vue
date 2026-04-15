<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { VaccineExtended } from '../types';
import EventCard from './EventCard.vue';

withDefaults(defineProps<{
    title: string
    events: VaccineExtended[]
    location?: "dashboard" | "calendar"
}>(), { location: "dashboard" });

const { t } = useI18n();
</script>

<template>
    <section :class="{ 'md:px-0': location === 'calendar', 'pet-section mb-4 md:mb-1': true }">
        <h2 :class="{ 'md:hidden': location === 'calendar' }">{{ title }}</h2>
        <EventCard v-if="events.length" v-for="event in events" :event="event" />
        <p v-else class="text-text-secondary text-sm">{{ t("common.text.noEventText") }}</p>
    </section>
</template>