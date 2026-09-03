<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useMedia } from '../../../composables/useMedia.ts';
import { usePets } from '../composables/usePets.ts';
import InsuranceSection from './InsuranceSection.vue';
import NextDue from './NextDue.vue';
import PetCard from './PetCard.vue';

const { selectedPet } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();
</script>

<template>
    <div v-if="selectedPet" class="flex flex-col gap-2 md:pb-3">
        <section class="pet-section">
            <h2>{{ t("dashboard.title.petProfile", { name: selectedPet.name }) }}</h2>
            <PetCard :pet="selectedPet" />
            <NextDue v-if="!isMd" />
        </section>
        <InsuranceSection />
    </div>
</template>