<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { usePets } from '../composables/usePet';
import PetProfile from './PetProfile.vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMd = breakpoints.greaterOrEqual("md");

const { selectedPet, pets } = usePets();
const { t } = useI18n();
</script>

<template>
    <section class="pet-section md:pr-0">
        <template v-if="selectedPet && !isMd">
            <h2>{{ t("dashboard.title.petProfile", { name: selectedPet.name }) }}</h2>
            <PetProfile :pet="selectedPet" />
        </template>

        <template v-else>
            <h2>{{ t("dashboard.title.petProfiles") }}</h2>
            <div class="pet-selector pl-0">
                <PetProfile v-for="pet in pets" :pet="pet" />
            </div>
        </template>
    </section>
</template>