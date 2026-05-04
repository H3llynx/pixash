<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import WeightChart from '../../health/components/charts/WeightChart.vue';
import EventList from '../../health/components/events/EventList.vue';
import { useEvents } from '../../health/composables/useEvents';
import { usePets } from '../composables/usePets';

const { selectedPet, logs } = usePets();
const { petUpcomingEvents } = useEvents();
const { t } = useI18n();

const weightLogs = computed(() => {
    if (!selectedPet.value) return [];
    return logs.value
        .filter(log => log.petId === selectedPet.value!.id)
        .filter(log => log.type === "weight")
});
</script>

<template>
    <div class="flex flex-col gap-1.5 p-0 h-full md:px-1.5 lg:h-full">
        <EventList :title="t('dashboard.title.upcoming')" :events="petUpcomingEvents" />
        <WeightChart v-if="selectedPet" :logs="weightLogs" :pet="selectedPet" />
    </div>
</template>