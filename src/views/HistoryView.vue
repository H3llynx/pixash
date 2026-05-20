<script setup lang="ts">
import { computed } from 'vue';
import Header from '../components/header/Header.vue';
import HistorySkeleton from '../components/loading/HistorySkeleton.vue';
import { useMedia } from '../composables/useMedia';
import EventList from '../features/health/components/events/EventList.vue';
import { useEvents } from '../features/health/composables/useEvents';
import type { PetEvent } from '../features/health/types';
import PetSelector from '../features/pets/components/PetSelector.vue';
import { usePets } from '../features/pets/composables/usePets';

const { history } = useEvents();
const { selectedPet, loading, hasPets } = usePets();
const { isMd } = useMedia();

const petHistory = computed(() => history.value.filter(h => h.petId === selectedPet.value?.id) as PetEvent[])
</script>

<template>
    <Header />
    <HistorySkeleton v-if="loading" />
    <main v-else-if="hasPets">
        <PetSelector v-if="!isMd" />
        <EventList :events="petHistory" history />
    </main>
</template>