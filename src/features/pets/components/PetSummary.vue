<script setup lang="ts">
import { computed } from 'vue';
import { useMedia } from '../../../composables/useMedia';
import WeightChart from '../../health/components/charts/WeightChart.vue';
import { usePets } from '../composables/usePets';
import NextDueSection from './NextDueSection.vue';
import PetSelector from './PetSelector.vue';
import ProfileSection from './ProfileSection.vue';

const { selectedPet } = usePets();
const { isMd } = useMedia();

const weightLogs = computed(() => selectedPet.value?.logs.filter(log => log.type === "weight") ?? []);
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <PetSelector v-if="selectedPet && !isMd" />
        <NextDueSection />
        <ProfileSection />
        <WeightChart v-if="selectedPet" :logs="weightLogs" :pet="selectedPet" />
    </div>
</template>