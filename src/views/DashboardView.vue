<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/Header.vue';
import DashboardSkeleton from '../components/loading/DashboardSkeleton.vue';
import { useMedia } from '../composables/useMedia.ts';
import LumpMonitoring from '../features/care/components/lumps/LumpMonitoring.vue';
import NextDue from '../features/pets/components/NextDue.vue';
import PetMonitoring from '../features/pets/components/PetMonitoring.vue';
import PetProfile from '../features/pets/components/PetProfile.vue';
import PetSelector from '../features/pets/components/PetSelector.vue';
import { usePets } from '../features/pets/composables/usePets';

const { resetPetActions, loading, hasPets } = usePets();
const { isLg } = useMedia();

onBeforeRouteLeave(() => {
  resetPetActions();
});
</script>

<template>
  <Header />
  <DashboardSkeleton v-if="loading" />
  <main v-else-if="hasPets">
    <div class="lg:lg-grid">
      <div :class="{ 'overlay': isLg }">
        <PetSelector />
      </div>
      <NextDue v-if="isLg" />
    </div>
    <div class="flex flex-col gap-2 lg:lg-grid">
      <div class="flex flex-col gap-2 md:pb-3">
        <PetProfile />
        <LumpMonitoring />
      </div>
      <PetMonitoring />
      <AddButton />
    </div>
  </main>
</template>