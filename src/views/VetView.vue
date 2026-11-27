<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Button from '../components/Button.vue';
import Header from '../components/Header.vue';
import VetSkeleton from '../components/loading/VetSkeleton.vue';
import { useMedia } from '../composables/useMedia.ts';
import EventList from '../features/care/components/events/EventList.vue';
import VetForm from '../features/care/components/forms/VetForm.vue';
import ActiveTreatments from '../features/care/components/treatments/ActiveTreatments.vue';
import TreatmentList from '../features/care/components/treatments/TreatmentList.vue';
import VetSection from '../features/care/components/vet/VetSection.vue';
import { useAllPetsView } from '../features/care/composables/useAllPetsView.ts';
import { useEvents } from '../features/care/composables/useEvents.ts';
import PetSelector from '../features/pets/components/PetSelector.vue';
import { usePets } from '../features/pets/composables/usePets';
import { tsToDate } from '../utils.ts';

const { loading, selectedVet, vetLoading, isUpdatingVet, handleAdd } = usePets();
const { eventsInTs } = useEvents();
const { t } = useI18n();
const { is2xl } = useMedia();
const { petViewed, filteredScheduledTreatments } = useAllPetsView();

const upcomingVisits = computed(() => {
    const upcoming = eventsInTs.value
        .filter(event => tsToDate(event.ts, "next3month"))
        .filter(event => event.eventType === "visit");
    return petViewed.value
        ? upcoming.filter(e => e.petId === petViewed.value)
        : upcoming
});

onBeforeRouteLeave(() => {
    isUpdatingVet.value = false;
    selectedVet.value = null;
});
</script>

<template>
    <Header />
    <VetSkeleton v-if="loading || vetLoading" />
    <main v-else class="mt-1 md:mt-0 lg:gap-0 lg:lg-grid xl:xl-grid">
        <div class="pb-1.5">
            <div class="pb-1 md:flex lg:block xl:flex justify-between items-center">
                <div class="default-padding w-sm">
                    <h2 class="text-2xl md:text-3xl">{{ t("common.header.vetH2") }}</h2>
                    <span class="tracking-wide font-extralight">{{ t("common.header.vetSpan") }}</span>
                </div>
                <PetSelector stacked viewAll />
            </div>
            <VetSection />
        </div>
        <section
            class="flex flex-col gap-2.5 pb-1.5 h-full lg:flex-col lg:px-1.5 md:pt-1.5 lg:bg-bg-3 lg:border-l lg:border-border lg:border-dashed lg:h-full">
            <div class="flex flex-col gap-1">
                <EventList :title="t('dashboard.title.upcoming')" :events="upcomingVisits" :itemsPerPage="is2xl ? 6 : 4"
                    :noEventText="t('events.noUpcomingVisit')" />
                <Button v-if="!upcomingVisits.length" variant="add" size="lg" class="md:max-w-xs"
                    @click="handleAdd('visit')">
                    <Plus /> {{ t("health.title.addVetVisit") }}
                </Button>
            </div>
            <ActiveTreatments viewAll />
            <TreatmentList v-if="filteredScheduledTreatments" :treatments="filteredScheduledTreatments"
                :title="t('health.treatment.scheduledTreatments')" />
            <AddButton vet />
        </section>
    </main>
    <VetForm />
</template>