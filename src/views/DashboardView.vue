<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/header/Header.vue';
import DashboardSkeleton from '../components/loading/DashboardSkeleton.vue';
import PetMonitoring from '../features/pets/components/PetMonitoring.vue';
import PetSummary from '../features/pets/components/PetSummary.vue';
import { usePets } from '../features/pets/composables/usePets';

const { resetPetActions, loading, hasPets } = usePets();

onBeforeRouteLeave(() => {
  resetPetActions();
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