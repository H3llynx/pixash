<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/Header.vue';
import DashboardSkeleton from '../components/loading/DashboardSkeleton.vue';
import EventList from '../features/health/components/EventList.vue';
import PetSummary from '../features/pets/components/PetSummary.vue';
import { usePets } from '../features/pets/composables/usePet';
import { resetState, tsToDate } from '../utils';

const { loading, hasPets, vaccines, vetVisits, isAddingPet, isAddingHealth, isUpdatingPet, selectVaccine, selectVisit } = usePets();
const { t } = useI18n();

const upcomingEvents = computed(() => [
  ...vaccines.value.filter(vaccine => tsToDate(vaccine.dueOn, "isUpcoming")),
  ...vetVisits.value.filter(visit => tsToDate(visit.date, "isUpcoming"))
].sort((a, b) => a.ts.seconds - b.ts.seconds));

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
      <EventList :title="t('dashboard.title.upcoming')" :events="upcomingEvents" />
      <AddButton />
    </template>
  </main>
</template>