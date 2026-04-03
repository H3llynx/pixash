<script setup lang="ts">
import { onMounted } from 'vue';
import DashboardSkeleton from '../components/DashboardSkeleton.vue';
import Header from '../components/Header.vue';
import NavBar from '../components/NavBar.vue';
import PetForm from '../features/pets/components/PetForm.vue';
import PetSummary from '../features/pets/components/PetSummary.vue';
import { usePets } from '../features/pets/composable/usePet';

const { loading, hasPets, isAdding, fetchUserPets } = usePets();

onMounted(async () => {
  await fetchUserPets();
  if (!hasPets.value) isAdding.value = true;
});
</script>

<template>
  <Header dashboard />
  <main class="flex flex-col gap-1.5">
    <DashboardSkeleton v-if="loading" />
    <PetSummary v-else-if="hasPets" />
    <PetForm />
  </main>
  <NavBar />
</template>