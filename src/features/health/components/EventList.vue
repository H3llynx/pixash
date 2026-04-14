<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { VaccineExtended } from '../types';
import EventCard from './EventCard.vue';

const { t } = useI18n();

defineProps<{ events: VaccineExtended[] }>();
</script>

<template>
    <section class="pet-section md:w-max">
        <h2>{{ t("dashboard.title.upcoming") }}</h2>
        <EventCard v-for="event in events" :event="event" />
    </section>
</template>