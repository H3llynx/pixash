<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { PetEvent } from '../types';
import EventCard from './EventCard.vue';

withDefaults(defineProps<{
    title: string
    events: PetEvent[]
    mdLocation?: "bottom" | "right"
}>(), { mdLocation: "bottom" });

const { t } = useI18n();
</script>

<template>
    <section :class="{ 'md:px-0': mdLocation === 'right', 'pet-section mb-4 md:mb-1': true }">
        <h2>{{ title }}</h2>
        <EventCard v-if="events.length" v-for="event in events" :event="event" :key="event.id" />
        <p v-else class="text-text-secondary text-sm">{{ t("common.text.noEventText") }}</p>
    </section>
</template>