<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { PetExtended } from '../../../pets/types';
import { getTreatmentColor } from '../../utils';
import TreatmentDetail from './TreatmentDetail.vue';

const { t } = useI18n();
defineProps<{ pet: PetExtended }>();
</script>

<template>
    <article class="pet-section">
        <template v-if="pet.treatments.length">
            <h2>{{ t("dashboard.title.activeTreatments") }}</h2>
            <div class="grid grid-cols-1 gap-1">
                <TreatmentDetail v-for="(treatment, index) in pet.treatments" :key="treatment.id" :treatment="treatment"
                    :color="getTreatmentColor(index)" />
            </div>
        </template>
    </article>
</template>