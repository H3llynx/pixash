<script setup lang="ts">
import { useMedia } from '../../../composables/useMedia';
import { usePets } from '../composables/usePets';
import NextDueSection from './NextDueSection.vue';
import PetSelector from './PetSelector.vue';
import ProfileSection from './ProfileSection.vue';

const { selectedPet } = usePets();
const { isMd } = useMedia();
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <PetSelector v-if="selectedPet && !isMd" />
        <NextDueSection />
        <ProfileSection />
    </div>
</template>