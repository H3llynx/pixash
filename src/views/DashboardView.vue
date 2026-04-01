<script setup lang="ts">
import { onMounted } from 'vue';
import DashboardSkeleton from '../components/DashboardSkeleton.vue';
import Header from '../components/Header.vue';
import NavBar from '../components/NavBar.vue';
import PetForm from '../features/pets/components/PetForm.vue';
import PetSummary from '../features/pets/components/PetSummary.vue';
import { usePets } from '../features/pets/composable/usePet';

const { loading, hasPets, startAdding, isAdding, fetchUserPets } = usePets();

onMounted(async () => {
  await fetchUserPets();
  if (!hasPets.value) startAdding();
});
</script>

<template>
  <Header dashboard />
  <main class="pb-5">
    <DashboardSkeleton v-if="loading" />
    <PetSummary v-else-if="hasPets" />
    <template v-else>
      <section class="flex flex-col items-center gap-2 mt-2 text-center">
        <div>
          <h2 class="font-title text-title text-2xl">Your pet care starts here</h2>
          <p class="text-text-secondary">You haven't added any pets yet.</p>
        </div>
        <p>Add your first furry (or scaly!) friend to start tracking care, appointments,
          and milestones.
        </p>
      </section>
    </template>
    <PetForm v-if="isAdding" />
  </main>
  <NavBar />
</template>