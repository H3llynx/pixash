<script setup lang="ts">
import { watch } from 'vue';
import Header from '../components/Header.vue';
import NavBar from '../components/NavBar.vue';
import { useToast } from '../composables/useToast';
import PetForm from '../features/pets/components/PetForm.vue';
import { usePets } from '../features/pets/composable/usePet';

const { error, hasPets, pets } = usePets();
const { show } = useToast();

watch(error, (newError) => {
  if (newError) {
    show("error", newError, "Failed to load pets");
  }
});
</script>

<template>
  <Header dashboard />
  <main class="pb-5 m-auto">
    <template v-if="hasPets">
      <section aria-label="Pet selector">
        <RouterLink v-for="pet in pets" to="/">{{ pet.name }}</RouterLink>
        <!-- Pet chips -->
      </section>
      <section aria-label="Pet summary">
        <!-- stat cards, pet switcher -->
      </section>
      <section aria-label="Upcoming events">
        <!-- events list -->
      </section>
    </template>

    <template v-else>
      <section class="flex flex-col items-center gap-2 text-center">
        <h2 class="font-title text-title text-2xl">Your pet care starts here</h2>
        <p class="text-text-secondary">You haven’t added any pets yet.</p>
        <p>Add your first furry (or scaly!) friend to start tracking care, appointments,
          and milestones.
        </p>
        <PetForm />
      </section>
    </template>
  </main>
  <NavBar />
</template>
