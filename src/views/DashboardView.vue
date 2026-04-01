<script setup lang="ts">
import { onMounted, watch } from 'vue';
import DashboardSkeleton from '../components/DashboardSkeleton.vue';
import Header from '../components/Header.vue';
import NavBar from '../components/NavBar.vue';
import { useToast } from '../composables/useToast';
import PetForm from '../features/pets/components/PetForm.vue';
import PetSummary from '../features/pets/components/PetSummary.vue';
import { usePets } from '../features/pets/composable/usePet';

const { selectedPet, loading, error, hasPets, fetchUserPets } = usePets();
const { show } = useToast();

onMounted(async () => {
  await fetchUserPets();
});

watch(error, (newError) => {
  if (newError) {
    show("error", newError, "Failed to load pets");
  }
});
</script>

<template>
  <Header dashboard />
  <main :class="`flex flex-col pb-5 ${!hasPets && 'my-auto'}`">
    <DashboardSkeleton v-if="loading" />
    <PetSummary v-else-if="hasPets && selectedPet" :pet="selectedPet" />
    <template v-else>
      <section class="flex flex-col items-center gap-2 text-center">
        <div>
          <h2 class="font-title text-title text-2xl">Your pet care starts here</h2>
          <p class="text-text-secondary">You haven't added any pets yet.</p>
        </div>
        <p>Add your first furry (or scaly!) friend to start tracking care, appointments,
          and milestones.
        </p>
        <PetForm />
      </section>
    </template>
  </main>
  <NavBar />
</template>
