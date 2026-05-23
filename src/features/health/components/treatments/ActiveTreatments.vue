<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePets } from '../../../pets/composables/usePets';
import type { PetExtended } from '../../../pets/types';
import { getTreatmentColor } from '../../utils';
import TreatmentDetail from './TreatmentDetail.vue';

const { t } = useI18n();
const { loading } = usePets();

const props = defineProps<{ pet: PetExtended }>();

const activeTreatments = computed(() => {
    const now = new Date();
    return props.pet.treatments.filter(t => t.startDate.toDate() <= now &&
        (!t.endDate || t.endDate.toDate() >= now))
}); 
</script>

<template>
    <article class="pet-section">
        <template v-if="pet.treatments.length">
            <h2>{{ t("dashboard.title.activeTreatments") }}</h2>
            <div class="grid grid-cols-1 gap-1">
                <TreatmentDetail v-if="activeTreatments.length" v-for="(treatment, index) in activeTreatments"
                    :key="treatment.id" :treatment="treatment" :color="getTreatmentColor(index)" />
                <p v-else-if="!loading" class="text-text-secondary text-sm">{{ t("common.text.noActiveTreatment") }}</p>
            </div>
        </template>
    </article>
</template>