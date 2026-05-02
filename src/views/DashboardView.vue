<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/Header.vue';
import DashboardSkeleton from '../components/loading/DashboardSkeleton.vue';
import { useMedia } from '../composables/useMedia';
import EventList from '../features/health/components/events/EventList.vue';
import { useEvents } from '../features/health/composables/useEvents';
import PetSummary from '../features/pets/components/PetSummary.vue';
import { usePets } from '../features/pets/composables/usePets';
import { resetState } from '../utils';

const { loading, hasPets, isAddingPet, isAddingHealth, isUpdatingPet, selectVaccine, selectVisit } = usePets();
const { upcomingEvents, petUpcomingEvents } = useEvents();
const { t } = useI18n();
const { isMd } = useMedia();

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
  <main>
    <DashboardSkeleton v-if="loading" />
    <template v-else-if="hasPets">
      <PetSummary />
      <EventList :title="t('events.upcoming')" :events="isMd ? upcomingEvents : petUpcomingEvents" />
      <AddButton />
    </template>
  </main>
</template>