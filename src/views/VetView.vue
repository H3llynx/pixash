<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/header/Header.vue';
import LoadingPuppy from '../components/loading/LoadingPuppy.vue';
import VetSkeleton from '../components/loading/VetSkeleton.vue';
import ActiveTreatments from '../features/health/components/ActiveTreatments.vue';
import VetForm from '../features/health/components/forms/VetForm.vue';
import VetSummary from '../features/health/components/VetSummary.vue';
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
    <main v-else class="lg:grid lg:grid-cols-[55%_45%] lg:gap-0">
        <VetSummary />
        <ActiveTreatments v-if="selectedPet" :pet="selectedPet" />
        <AddButton vet />
    </main>
    <VetForm />
</template>