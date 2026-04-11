<script setup lang="ts">
import Card from '../../health/components/Card.vue';
import { usePets } from '../composables/usePet';
import PetProfile from './PetProfile.vue';
import PetSelector from './PetSelector.vue';

const { selectedPet } = usePets();
</script>

<template>
    <div class="flex flex-col gap-1.5 flex-1 pb-6">
        <PetSelector />
        <div v-if="selectedPet?.nextVaccine" class="flex gap-1 default-padding">
            <Card :data="selectedPet.nextVaccine" />
        </div>
        <PetProfile />
    </div>
</template>