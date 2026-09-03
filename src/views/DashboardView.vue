<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/Header.vue';
import DashboardSkeleton from '../components/loading/DashboardSkeleton.vue';
import { useMedia } from '../composables/useMedia.ts';
import NextDue from '../features/pets/components/NextDue.vue';
import PetMonitoring from '../features/pets/components/PetMonitoring.vue';
import PetProfile from '../features/pets/components/PetProfile.vue';
import PetSelector from '../features/pets/components/PetSelector.vue';
import { usePets } from '../features/pets/composables/usePets';

const { resetPetActions, loading, hasPets } = usePets();
const { isMd } = useMedia();

onBeforeRouteLeave(() => {
  resetPetActions();
});
</script>

<template>
  <Header />
  <DashboardSkeleton v-if="loading" />
  <main v-else-if="hasPets">
    <div class="lg-grid">
      <PetSelector />
      <NextDue v-if="isMd" class="pl-1.5" />
    </div>
    <div class="lg-grid">
      <PetProfile />
      <PetMonitoring />
      <AddButton />
    </div>
  </main>
</template>