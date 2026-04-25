<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/Header.vue';
import DashboardSkeleton from '../components/loading/DashboardSkeleton.vue';
import VetSummary from '../features/health/components/VetSummary.vue';
import { usePets } from '../features/pets/composables/usePet';

const { loading, selectedVet } = usePets();

onBeforeRouteLeave(() => {
    selectedVet.value = null;
});
</script>

<template>
    <Header />
    <main>
        <DashboardSkeleton v-if="loading" />
        <template v-else>
            <VetSummary />
        </template>
        <AddButton vet />
    </main>
</template>