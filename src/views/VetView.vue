<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import AddButton from '../components/AddButton.vue';
import Header from '../components/Header.vue';
import DashboardSkeleton from '../components/loading/DashboardSkeleton.vue';
import VetForm from '../features/health/components/VetForm.vue';
import VetSummary from '../features/health/components/VetSummary.vue';
import { usePets } from '../features/pets/composables/usePets';

const { loading, selectedVet, hasVets } = usePets();

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
            <AddButton vet />
        </template>
    </main>
    <VetForm />
</template>