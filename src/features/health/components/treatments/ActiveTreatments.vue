<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { PetExtended } from '../../../pets/types';
import { getProgressColor } from '../../utils';
import TreatmentProgress from './TreatmentProgress.vue';

const { t } = useI18n();
defineProps<{ pet: PetExtended }>();
</script>

<template>
    <article class="pet-section">
        <template v-if="pet.treatments.length">
            <h2>{{ t("dashboard.title.activeTreatments") }}</h2>
            <div class="grid grid-cols-1 gap-1 auto-rows-fr">
                <TreatmentProgress v-for="(treatment, index) in pet.treatments" :key="treatment.id"
                    :treatment="treatment" :color="getProgressColor(index)" />
            </div>
        </template>
    </article>
</template>