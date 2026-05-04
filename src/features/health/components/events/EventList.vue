<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { PetEvent } from '../../types';
import EventCard from './EventCard.vue';

defineProps<{
    title: string
    events: PetEvent[]
}>();

const { t } = useI18n();
</script>

<template>
    <section class="pet-section md:px-0">
        <h2>{{ title }}</h2>
        <div class="grid grid-cols-1 gap-1 auto-rows-fr">
            <EventCard v-if="events.length" v-for="event in events" :event="event" :key="event.id" />
            <p v-else class="text-text-secondary text-sm">{{ t("common.text.noEventText") }}</p>
        </div>
    </section>
</template>