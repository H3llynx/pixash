<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AddButton from '../components/AddButton.vue';
import DashboardSkeleton from '../components/DashboardSkeleton.vue';
import Header from '../components/Header.vue';
import EventList from '../features/health/components/EventList.vue';
import VaccineForm from '../features/health/components/VaccineForm.vue';
import VetVisitForm from '../features/health/components/VetVisitForm.vue';
import PetForm from '../features/pets/components/PetForm.vue';
import PetSummary from '../features/pets/components/PetSummary.vue';
import { usePets } from '../features/pets/composables/usePet';
import { tsToDate } from '../utils';

const { loading, hasPets, vaccines, vetVisits } = usePets();
const { t } = useI18n();

const upcomingEvents = computed(() => [
  ...vaccines.value.filter(vaccine => tsToDate(vaccine.dueOn, "isUpcoming")).map(v => ({ ...v, ts: v.dueOn!, eventType: "vaccine" })),
  ...vetVisits.value.filter(visit => tsToDate(visit.date, "isUpcoming")).map(v => ({ ...v, ts: v.date!, eventType: "visit" })),
].sort((a, b) => a.ts.seconds - b.ts.seconds));
</script>

<template>
  <Header type="dashboard" />
  <main>
    <DashboardSkeleton v-if="loading" />
    <template v-else-if="hasPets">
      <PetSummary />
      <EventList :title="t('dashboard.title.upcoming')" :events="upcomingEvents" />
      <AddButton />
    </template>
    <VaccineForm />
    <VetVisitForm />
    <PetForm />
  </main>
</template>