<script setup lang="ts">
import AddButton from '../components/AddButton.vue';
import Header from '../components/Header.vue';
import DashboardSkeleton from '../components/loading/DashboardSkeleton.vue';
import { usePets } from '../features/pets/composables/usePet';

const { loading, hasPets } = usePets();
</script>

<template>
    <Header />
    <main>
        <DashboardSkeleton v-if="loading" />
        <template v-else-if="hasPets">
            <AddButton vet />
        </template>
    </main>
</template>