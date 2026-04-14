<script setup lang="ts">
import { computed } from 'vue';
import DashboardSkeleton from '../components/DashboardSkeleton.vue';
import Header from '../components/Header.vue';
import UpcomingEvents from '../features/health/components/EventList.vue';
import VaccineForm from '../features/health/components/VaccineForm.vue';
import PetForm from '../features/pets/components/PetForm.vue';
import PetSummary from '../features/pets/components/PetSummary.vue';
import { usePets } from '../features/pets/composables/usePet';
import { tsToDate } from '../utils';

const { loading, hasPets, vaccines } = usePets();
const upcomingEvents = computed(() => vaccines.value
  .filter(vaccine => tsToDate(vaccine.dueOn, "isUpcoming"))
  .sort((a, b) => a.dueOn!.seconds - b.dueOn!.seconds))
</script>

<template>
  <Header type="dashboard" />
  <main>
    <DashboardSkeleton v-if="loading" />
    <template v-else-if="hasPets">
      <PetSummary />
      <UpcomingEvents :events="upcomingEvents" />
    </template>
    <PetForm />
    <VaccineForm />
  </main>
</template>