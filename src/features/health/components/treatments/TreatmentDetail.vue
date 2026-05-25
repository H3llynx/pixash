<script setup lang="ts">
import { ChevronDown, Edit2, NotepadText } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { getLabel, tsToDate } from '../../../../utils';
import { usePets } from '../../../pets/composables/usePets';
import { MED_FREQUENCY } from '../../config';
import type { TreatmentExtended } from '../../types';
import { getMedicationProgress, getTreatmentProgress } from '../../utils';
import ProgressBar from './ProgressBar.vue';
import TreatmentLogs from './TreatmentLogs.vue';

const { selectTreatment, pets } = usePets();
const { t } = useI18n();
const props = defineProps<{ treatment: TreatmentExtended; color: string }>();
const progress = computed(() => getTreatmentProgress(props.treatment));
const pet = computed(() => pets.value.find(pet => pet.id === props.treatment.petId));
</script>

<template>
    <div class="card" v-if="pet">
        <div class="flex gap-1 justify-between">
            <h3 class="text-base">{{ treatment.name }}</h3>
            <Button variant="ghost" size="xs" @click="selectTreatment(treatment)"
                :aria-label="t('health.cta.editTreatment')">
                <Edit2 :size="15" />
            </Button>
        </div>
        <div class="text-sm text-text-secondary">
            <div class="text-xs">
                <span v-if="!treatment.endDate">{{ t("health.treatment.started") }}</span>
                <span>{{ tsToDate(treatment.startDate, "date") }}</span>
                <span v-if="treatment.endDate"> - {{ tsToDate(treatment.endDate, "date") }}</span>
                <span v-else class="inline ml-0.5 float-right tag bg-separator text-text-secondary">{{
                    t("health.treatment.ongoing")
                }}</span>
            </div>
            <ProgressBar v-if="progress" :progress="progress" :color="color" />
        </div>
        <p v-if="treatment.notes" class="text-sm italic flex gap-0.5 items-center my-0.5">
            <NotepadText />
            {{ treatment.notes }}
        </p>
        <details v-for="medication in treatment.medication"
            class="bg-bg-rgba rounded-xl border border-border text-sm flex flex-col mt-0.5 overflow-hidden">
            <summary class="flex items-center justify-between cursor-pointer p-0.75"
                :aria-label="t('health.treatment.summaryLabel')">
                <p>{{ medication.name }}</p>
                <p class="flex gap-1">
                    <span class="tag bg-bg-3 border border-border text-xs">{{
                        t(getLabel(medication.frequency, MED_FREQUENCY)) }}</span>
                    <ChevronDown class="chevron default-transition" />
                </p>
            </summary>
            <div class="px-0.5 pb-0.75">
                <ProgressBar v-if="!treatment.endDate && medication.endDate"
                    :progress="getMedicationProgress(treatment, medication)!" :color="color" />
                <TreatmentLogs :pet="pet" :color="color" :treatment="treatment" :medication="medication" />
            </div>
        </details>
    </div>
</template>

<style scoped>
details[open] summary .chevron {
    transform: rotate(180deg);
}
</style>