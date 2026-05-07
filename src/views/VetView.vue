<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/header/Header.vue';
import LoadingPuppy from '../components/loading/LoadingPuppy.vue';
import VetSkeleton from '../components/loading/VetSkeleton.vue';
import VetForm from '../features/health/components/forms/VetForm.vue';
import VetSummary from '../features/health/components/VetSummary.vue';
import { usePets } from '../features/pets/composables/usePets';

const { loading, selectedVet, healthLoading, hasVets, isUpdatingVet } = usePets();

onBeforeRouteLeave(() => {
    isUpdatingVet.value = false;
    selectedVet.value = null;
});
</script>

<template>
    <Header />
    <main>
        <VetSkeleton v-if="loading || healthLoading" />
        <LoadingPuppy v-else-if="healthLoading && !hasVets" />
        <template v-else>
            <VetSummary />
            <AddButton vet />
        </template>
    </main>
    <VetForm />
</template>