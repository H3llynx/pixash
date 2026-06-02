<script setup lang="ts">
import { useMedia } from '../../../composables/useMedia';
import ActiveTreatments from '../../health/components/treatments/ActiveTreatments.vue';
import { usePets } from '../composables/usePets';
import InsuranceSection from './InsuranceSection.vue';
import NextDueSection from './NextDueSection.vue';
import PetSelector from './PetSelector.vue';
import ProfileSection from './ProfileSection.vue';

const { selectedPet } = usePets();
const { isMd } = useMedia();
</script>

<template>
    <div v-if="selectedPet" class="flex flex-col gap-1.5 md:mb-1">
        <PetSelector v-if="!isMd" />
        <NextDueSection />
        <ProfileSection />
        <ActiveTreatments />
        <InsuranceSection />
    </div>
</template>