<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/header/Header.vue';
import LoadingPuppy from '../components/loading/LoadingPuppy.vue';
import VetSkeleton from '../components/loading/VetSkeleton.vue';
import VetForm from '../features/health/components/forms/VetForm.vue';
import TreatmentsSection from '../features/health/components/TreatmentsSection.vue';
import VetSummary from '../features/health/components/vet/VetSummary.vue';
import { usePets } from '../features/pets/composables/usePets';

const { loading, selectedVet, healthLoading, hasVets, isUpdatingVet, selectedPet } = usePets();

onBeforeRouteLeave(() => {
    isUpdatingVet.value = false;
    selectedVet.value = null;
});
</script>

<template>
    <Header />
    <VetSkeleton v-if="loading || healthLoading" />
    <LoadingPuppy v-else-if="healthLoading && !hasVets" />
    <main v-else class="lg:gap-0 lg:grid lg:grid-cols-[60%_40%]">
        <VetSummary />
        <section
            class="flex flex-col gap-1.5 pb-1 lg:px-1.5 lg:bg-bg-rgba lg:pt-1.5 lg:border-l lg:border-border lg:h-full">
            <TreatmentsSection v-if="selectedPet" :pet="selectedPet" />
            <AddButton vet />
        </section>
    </main>

    <VetForm />
</template>