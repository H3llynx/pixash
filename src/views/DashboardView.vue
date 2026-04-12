<script setup lang="ts">
import DashboardSkeleton from '../components/DashboardSkeleton.vue';
import Header from '../components/Header.vue';
import UpcomingEvents from '../features/health/components/UpcomingEvents.vue';
import VaccineForm from '../features/health/components/VaccineForm.vue';
import PetForm from '../features/pets/components/PetForm.vue';
import PetSummary from '../features/pets/components/PetSummary.vue';
import { usePets } from '../features/pets/composables/usePet';

const { loading, hasPets } = usePets();
</script>

<template>
  <Header type="dashboard" />
  <main>
    <DashboardSkeleton v-if="loading" />
    <template v-else-if="hasPets">
      <PetSummary />
      <UpcomingEvents />
    </template>
    <PetForm />
    <VaccineForm />
  </main>
</template>