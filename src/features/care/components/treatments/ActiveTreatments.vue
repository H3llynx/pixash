<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useAllPetsView } from '../../composables/useAllPetsView.ts';
import { useTreatments } from '../../composables/useTreatments.ts';
import TreatmentWithLog from './TreatmentWithLog.vue';

const { t } = useI18n();
const { loading, selectedPet } = usePets();
const { activeTreatments } = useTreatments();
const { petViewed } = useAllPetsView();

const props = withDefaults(defineProps<{ viewAll?: boolean }>(), { viewAll: false });

const treatments = computed(() => props.viewAll
    ? petViewed.value ? activeTreatments.value.filter(t => t.petId === petViewed.value) : activeTreatments.value
    : activeTreatments.value.filter(t => t.petId === selectedPet.value?.id));
</script>

<template>
    <article class="pet-section">
        <h2>{{ t("dashboard.title.activeTreatments") }}</h2>
        <div class="grid grid-cols-1 gap-1">
            <TreatmentWithLog v-if="treatments.length" v-for="(treatment, index) in treatments" :key="treatment.id"
                :treatment="treatment" :colorIndex="index" />
            <p v-else-if="!loading" class="text-text-secondary text-sm">{{ t("common.text.noActiveTreatment") }}</p>
        </div>
    </article>
</template>