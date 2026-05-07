<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { PetEvent } from '../../types';
import EventCard from './EventCard.vue';
import HistoryCard from './HistoryCard.vue';

withDefaults(defineProps<{
    title?: string
    events: PetEvent[]
    history?: boolean
}>(), { history: false });

const { t } = useI18n();
</script>

<template>
    <section class="pet-section">
        <h2 v-if="title">{{ title }}</h2>
        <div class="grid grid-cols-1 gap-1 auto-rows-fr">
            <template v-if="history">
                <HistoryCard v-if="events.length" v-for="event in events" :event="event" :key="event.id" />
                <p v-else class="text-text-secondary text-sm">{{ t("common.text.noHistoryText") }}</p>
            </template>
            <template v-else>
                <EventCard v-if="events.length" v-for="event in events" :event="event" :key="event.id" />
                <p v-else class="text-text-secondary text-sm">{{ t("common.text.noEventText") }}</p>
            </template>
        </div>
    </section>
</template>