<script setup lang="ts">
import { computed } from 'vue';
import Header from '../components/header/Header.vue';
import { useMedia } from '../composables/useMedia';
import EventList from '../features/health/components/events/EventList.vue';
import { useEvents } from '../features/health/composables/useEvents';
import PetSelector from '../features/pets/components/PetSelector.vue';
import { usePets } from '../features/pets/composables/usePets';

const { history } = useEvents();
const { selectedPet } = usePets();
const { isMd } = useMedia();

const petHistory = computed(() => history.value.filter(h => h.petId === selectedPet.value?.id))
</script>

<template>
    <Header />
    <main>
        <PetSelector v-if="!isMd" />
        <EventList :events="petHistory" history />
    </main>
</template>