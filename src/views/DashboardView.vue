<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/header/Header.vue';
import DashboardSkeleton from '../components/loading/DashboardSkeleton.vue';
import PetMonitoring from '../features/pets/components/PetMonitoring.vue';
import PetSummary from '../features/pets/components/PetSummary.vue';
import { usePets } from '../features/pets/composables/usePets';
import { resetState } from '../utils';

const { loading, hasPets, isAddingPet, isAddingHealth, isUpdatingPet, selectVaccine, selectVisit } = usePets();

onBeforeRouteLeave(() => {
  isAddingPet.value = false;
  isUpdatingPet.value = false;
  resetState(isAddingHealth);
  selectVaccine(null);
  selectVisit(null);
});
</script>

<template>
  <Header />
  <DashboardSkeleton v-if="loading" />
  <main v-else-if="hasPets" class="lg:grid lg:grid-cols-[55%_40%]">
    <PetSummary />
    <PetMonitoring />
    <AddButton />
  </main>
</template>