<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ActiveTreatments from '../../health/components/ActiveTreatments.vue';
import WeightChart from '../../health/components/charts/WeightChart.vue';
import EventList from '../../health/components/events/EventList.vue';
import LogWeightModal from '../../health/components/LogWeightModal.vue';
import { useEvents } from '../../health/composables/useEvents';
import { usePets } from '../composables/usePets';

const { selectedPet } = usePets();
const { petUpcomingEvents } = useEvents();
const { t } = useI18n();

const weightLogs = computed(() => selectedPet.value?.logs.filter(log => log.type === "weight") ?? []);
</script>

<template>
    <div class="flex flex-col gap-1.5 md:mb-3 md:default-padding lg:px-1.5">
        <ActiveTreatments v-if="selectedPet?.treatments.length" :pet="selectedPet" />
        <EventList :title="t('dashboard.title.upcoming')" :events="petUpcomingEvents" class="md:px-0" />
        <WeightChart v-if="selectedPet" :logs="weightLogs" :pet="selectedPet" />
    </div>
    <LogWeightModal v-if="selectedPet" :pet="selectedPet" />
</template>