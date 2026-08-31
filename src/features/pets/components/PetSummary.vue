<script setup lang="ts">
import { usePets } from '../composables/usePets';
import InsuranceSection from './InsuranceSection.vue';
import NextDueSection from './NextDueSection.vue';
import ProfileSection from './ProfileSection.vue';

const { selectedPet } = usePets();
</script>

<template>
    <div v-if="selectedPet" class="flex flex-col gap-1.5 md:mb-1">
        <NextDueSection />
        <ProfileSection />
        <InsuranceSection />
    </div>
</template>