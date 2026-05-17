<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { PetExtended } from '../../pets/types';
import TreatmentProgress from './TreatmentProgress.vue';

const { t } = useI18n();
defineProps<{ pet: PetExtended }>();
</script>

<template>
    <section class="pet-section">
        <template v-if="pet.treatments.length">
            <h2>{{ t("dashboard.title.activeTreatments") }}</h2>
            <TreatmentProgress v-for="treatment in pet.treatments" :key="treatment.id" :treatment="treatment" />
        </template>
    </section>
</template>