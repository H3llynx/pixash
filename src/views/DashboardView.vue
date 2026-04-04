<script setup lang="ts">
import { onMounted } from 'vue';
import DashboardSkeleton from '../components/DashboardSkeleton.vue';
import Header from '../components/Header.vue';
import NavBar from '../components/NavBar.vue';
import VaccineForm from '../features/health/components/VaccineForm.vue';
import PetForm from '../features/pets/components/PetForm.vue';
import PetSummary from '../features/pets/components/PetSummary.vue';
import { usePets } from '../features/pets/composables/usePet';

const { loading, hasPets, fetchUserPets } = usePets();

onMounted(async () => {
  await fetchUserPets();
});
</script>

<template>
  <Header dashboard />
  <main>
    <DashboardSkeleton v-if="loading" />
    <PetSummary v-else-if="hasPets" />
    <PetForm />
    <VaccineForm />
  </main>
  <NavBar />
</template>