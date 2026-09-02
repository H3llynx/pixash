<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/header/Header.vue';
import DashboardSkeleton from '../components/loading/DashboardSkeleton.vue';
import PetMonitoring from '../features/pets/components/PetMonitoring.vue';
import PetProfile from '../features/pets/components/PetProfile.vue';
import { usePets } from '../features/pets/composables/usePets';

const { resetPetActions, loading, hasPets } = usePets();

onBeforeRouteLeave(() => {
  resetPetActions();
});
</script>

<template>
  <Header />
  <DashboardSkeleton v-if="loading" />
  <main v-else-if="hasPets" class="lg-grid lg:gap-0">
    <PetProfile />
    <PetMonitoring />
    <AddButton />
  </main>
</template>