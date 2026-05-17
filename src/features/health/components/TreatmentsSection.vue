<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PetIndicator from '../../pets/components/PetIndicator.vue';
import { usePets } from '../../pets/composables/usePets';
import TreatmentProgress from './TreatmentProgress.vue';

const { treatments, pets } = usePets();
const { t } = useI18n();
</script>

<template>
    <article class="pet-section">
        <h2>{{ t("dashboard.title.activeTreatments") }}</h2>
        <div class="grid grid-cols-1 gap-1 auto-rows-fr">
            <div v-for="treatment in treatments" :key="treatment.id" class="flex gap-0.5">
                <PetIndicator :pet="pets.find(pet => pet.id === treatment.petId)!" />
                <TreatmentProgress :treatment="treatment" />
            </div>
        </div>
    </article>
</template>