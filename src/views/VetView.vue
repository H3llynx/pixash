<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/header/Header.vue';
import VetSkeleton from '../components/loading/VetSkeleton.vue';
import VetForm from '../features/care/components/forms/VetForm.vue';
import ActiveTreatments from '../features/care/components/treatments/ActiveTreatments.vue';
import TreatmentList from '../features/care/components/treatments/TreatmentList.vue';
import VetSummary from '../features/care/components/vet/VetSummary.vue';
import { useEvents } from '../features/care/composables/useEvents.ts';
import { useHistory } from '../features/care/composables/useHistory.ts';
import { usePets } from '../features/pets/composables/usePets';

const { loading, selectedVet, vetLoading, isUpdatingVet } = usePets();
const { t } = useI18n();
const { activeTreatments } = useEvents();
const { finishedTreatments } = useHistory();

onBeforeRouteLeave(() => {
    isUpdatingVet.value = false;
    selectedVet.value = null;
});
</script>

<template>
    <Header />
    <VetSkeleton v-if="loading || vetLoading" />
    <main v-else class="mt-1 md:mt-0 lg:gap-0 lg:grid lg:grid-cols-[55%_45%] xl:grid-cols-[65%_1fr]">
        <VetSummary />
        <section class="px-0 flex flex-col gap-1.5 pb-1 lg:bg-bg-rgba lg:pt-1.5 lg:border-l lg:border-border lg:h-full">
            <ActiveTreatments v-if="activeTreatments" class="default-padding lg:px-1.5" />
            <TreatmentList v-if="finishedTreatments" :treatments="finishedTreatments" opaque
                :title="t('events.pastTreatments')" history class="default-padding lg:px-1.5" />
            <AddButton vet />
        </section>
    </main>
    <VetForm />
</template>