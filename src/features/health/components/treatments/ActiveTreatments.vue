<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { usePets } from '../../../pets/composables/usePets';
import { useEvents } from '../../composables/useEvents';
import { getTreatmentColor } from '../../utils';
import TreatmentDetail from './TreatmentDetail.vue';

const { t } = useI18n();
const { loading, selectedPet } = usePets();
const { activeTreatments } = useEvents();
</script>

<template>
    <article class="pet-section default-padding">
        <h2>{{ t("dashboard.title.activeTreatments") }}</h2>
        <div class="grid grid-cols-1 gap-1">
            <TreatmentDetail v-if="activeTreatments.length" v-for="(treatment, index) in activeTreatments"
                :key="treatment.id" :treatment="treatment" :color="getTreatmentColor(index)" />
            <p v-else-if="!loading" class="text-text-secondary text-sm">{{ t("common.text.noActiveTreatment", {
                name: selectedPet?.name
            }) }}</p>
        </div>
    </article>
</template>