<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/header/Header.vue';
import LoadingPuppy from '../components/loading/LoadingPuppy.vue';
import VetSkeleton from '../components/loading/VetSkeleton.vue';
import VetForm from '../features/health/components/forms/VetForm.vue';
import TreatmentList from '../features/health/components/treatments/TreatmentList.vue';
import VetSummary from '../features/health/components/vet/VetSummary.vue';
import { usePets } from '../features/pets/composables/usePets';

const { loading, selectedVet, healthLoading, hasVets, isUpdatingVet, treatments } = usePets();
const { t } = useI18n();

const activeTreatments = computed(() => {
    const now = new Date();
    return treatments.value.filter(t => t.startDate.toDate() <= now &&
        (!t.endDate || t.endDate.toDate() >= now))
});

onBeforeRouteLeave(() => {
    isUpdatingVet.value = false;
    selectedVet.value = null;
});
</script>

<template>
    <Header />
    <VetSkeleton v-if="loading || healthLoading" />
    <LoadingPuppy v-else-if="healthLoading && !hasVets" />
    <main v-else class="mt-1 md:mt-0 lg:gap-0 lg:grid lg:grid-cols-[55%_45%] xl:grid-cols-[65%_1fr]">
        <VetSummary />
        <section
            class="flex flex-col gap-1.5 pb-1 lg:px-1.5 lg:bg-bg-rgba lg:pt-1.5 lg:border-l lg:border-border lg:h-full">
            <TreatmentList v-if="activeTreatments" :treatments="activeTreatments"
                :title="t('dashboard.title.activeTreatments')" />
            <AddButton vet />
        </section>
    </main>
    <VetForm />
</template>