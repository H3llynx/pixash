<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import HealthCard from '../../health/components/HealthCard.vue';
import { usePets } from '../composables/usePet';
import PetSelector from './PetSelector.vue';
import ProfileSection from './ProfileSection.vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMd = breakpoints.greaterOrEqual("md");

const { selectedPet, pets } = usePets();
const { t } = useI18n();

const nextPetDue = pets.value
    .filter(pet => pet.nextVaccine?.dueOn)
    .sort((a, b) => a.nextVaccine!.dueOn!.seconds - b.nextVaccine!.dueOn!.seconds)[0];
</script>

<template>
    <div class="flex flex-col gap-1.5 flex-1">
        <PetSelector v-if="selectedPet && !isMd" />
        <div v-if="selectedPet?.nextVaccine && !isMd" class="flex gap-1 default-padding">
            <HealthCard :pet="selectedPet" :data="selectedPet.nextVaccine"
                :title="t('pet.profile.label.nextVaccine')" />
        </div>
        <div v-else-if="isMd" class="flex gap-1 default-padding">
            <HealthCard :pet="nextPetDue" :data="nextPetDue.nextVaccine!" :title="t('pet.profile.label.nextVaccine')" />
        </div>
        <ProfileSection />
    </div>
</template>