<script setup lang="ts">
import { ChevronDown, MessageCircleWarning } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import ProgressBar from '../../../../components/ProgressBar.vue';
import { getLabel } from '../../../../utils.ts';
import type { PetExtended } from '../../../pets/types.ts';
import { useTreatments } from '../../composables/useTreatments.ts';
import { MED_FREQUENCY } from '../../config.ts';
import type { TreatmentExtended } from '../../types.ts';
import { getMedicationProgress, getTreatmentBackground, getTreatmentColor } from '../../utils.ts';
import LogHistory from './LogHistory.vue';
import MissedDoses from './MissedDoses.vue';
import TreatmentLogs from './TreatmentLogs.vue';

const props = defineProps<{
    pet: PetExtended
    treatment: TreatmentExtended
    colorIndex: number
}>()

const { getDailyMissedDoses, getMissedDosesHistory, isMedicationEnded, getTotalLogs } = useTreatments();
const { t } = useI18n();
</script>

<template>
    <details v-for="medication in treatment.medication" :key="medication.id"
        class="rounded-xl flex flex-col mt-0.5 p-0.25 overflow-hidden bg-grey-mid text-sm"
        :style="{ backgroundColor: getTreatmentBackground(props.colorIndex) }">
        <summary class="flex flex-wrap items-center justify-between cursor-pointer p-0.5 md:p-0.75"
            :aria-label="t('health.treatment.summaryLabel')">
            <h5>{{ medication.name }}</h5>
            <span class="tag bg-bg-rgba border border-border text-text-softer ml-auto">{{
                t(getLabel(medication.frequency, MED_FREQUENCY)) }}</span>
            <span v-if="getDailyMissedDoses(props.pet, props.treatment, medication)"
                class="flex w-1.5 h-1.5 rounded-full bg-error text-white items-center justify-center ml-0.5" role="img"
                :aria-label="t('health.treatment.missedDoseToday')"> ! </span>
            <ChevronDown class="chevron default-transition ml-1" />
        </summary>
        <div class="p-1 flex flex-col gap-1">
            <p v-if="medication.instructions" class="font-light italic flex gap-0.5 items-center text-text-softer">
                <MessageCircleWarning :size="20" />{{ medication.instructions }}
            </p>
            <ProgressBar v-if="medication.endDate && (!treatment.endDate || isMedicationEnded(medication))"
                :progress="getMedicationProgress(props.treatment, medication)!"
                :color="getTreatmentColor(props.colorIndex)" />
            <TreatmentLogs :pet="pet" :colorIndex="colorIndex" :treatment="treatment" :medication="medication" />
            <MissedDoses v-if="getMissedDosesHistory(props.pet, props.treatment, medication).length" :pet="pet"
                :treatment="treatment" :missedDoses="getMissedDosesHistory(props.pet, props.treatment, medication)" />
            <LogHistory v-if="getTotalLogs(props.pet, props.treatment, medication).length" :pet="pet"
                :treatment="treatment" :medication="medication"
                :logs="getTotalLogs(props.pet, props.treatment, medication)" />
        </div>
    </details>
</template>