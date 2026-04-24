<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/Header.vue';
import DashboardSkeleton from '../components/loading/DashboardSkeleton.vue';
import { useMedia } from '../composables/useMedia';
import EventList from '../features/health/components/EventList.vue';
import PetSummary from '../features/pets/components/PetSummary.vue';
import { usePets } from '../features/pets/composables/usePet';
import { resetState, tsToDate } from '../utils';

const { loading, hasPets, selectedPet, vaccines, vetVisits, isAddingPet, isAddingHealth, isUpdatingPet, selectVaccine, selectVisit } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();

const upcomingEvents = computed(() => [
  ...vaccines.value.filter(vaccine => tsToDate(vaccine.dueOn, "upcoming")),
  ...vetVisits.value.filter(visit => tsToDate(visit.date, "upcoming"))
].sort((a, b) => a.ts.seconds - b.ts.seconds));

const petUpcomingEvents = computed(() => {
  if (!selectedPet.value) return [];
  return upcomingEvents.value.filter(e => e.petId === selectedPet.value!.id);
});

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