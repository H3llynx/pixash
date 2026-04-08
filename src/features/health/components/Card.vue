<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { tsToDate } from '../../../utils';
import { usePets } from '../../pets/composables/usePet';
import type { VaccineExtended } from '../types';

defineProps<{ data: VaccineExtended }>();

const { selectedPet } = usePets();
const { t } = useI18n();
</script>

<template>
    <div v-if="selectedPet" class="p-1 rounded-xl border border-border bg-bg-2 w-1/2 max-w-3xs">
        <h3>{{ t("pet.profile.label.nextVaccine") }}</h3>
        <p class="text-lg font-medium">{{ tsToDate(data.dueOn, "date") }}</p>
        <p class="text-xs text-brand-light">{{ tsToDate(data.dueOn, "daysUntil") }}</p>
    </div>
</template>

<style scoped>
h3 {
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 5px;
    letter-spacing: 1px;
    font-size: smaller;
}
</style>