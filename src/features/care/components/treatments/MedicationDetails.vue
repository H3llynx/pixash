<script setup lang="ts">
import { ChevronDown, MessageCircleWarning } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ProgressBar from '../../../../components/ProgressBar.vue';
import { getLabel } from '../../../../utils.ts';
import type { PetExtended } from '../../../pets/types.ts';
import { useTreatments } from '../../composables/useTreatments.ts';
import { MED_FREQUENCY } from '../../config.ts';
import type { MedicineDb, TreatmentExtended } from '../../types.ts';
import { getMedicationProgress, getTreatmentBackground, getTreatmentColor } from '../../utils.ts';
import LogHistory from './LogHistory.vue';
import MissedDoses from './MissedDoses.vue';
import TreatmentLogs from './TreatmentLogs.vue';

const props = defineProps<{
    pet: PetExtended
    treatment: TreatmentExtended
    colorIndex: number
}>()

const { getDailyMissedDoses, getMissedDosesHistory, isMedicationEnded } = useTreatments();
const { t } = useI18n();

const color = computed(() => getTreatmentColor(props.colorIndex));
const colorBg = computed(() => getTreatmentBackground(props.colorIndex));
const progress = computed(() => (medication: MedicineDb) => getMedicationProgress(props.treatment, medication));
const dailyMissed = computed(() => (medication: MedicineDb) => getDailyMissedDoses(props.pet, props.treatment, medication));
const missedHistory = computed(() => (medication: MedicineDb) => getMissedDosesHistory(props.pet, props.treatment, medication));
const medicationLogs = computed(() => (medication: MedicineDb) =>
    props.pet.logs.filter((log: any) =>
        log.type === "medication" &&
        log.treatmentId === props.treatment.id &&
        log.medicineId === medication.id));

</script>

<template>
    <details v-for="medication in treatment.medication" :key="medication.id"
        class="rounded-xl flex flex-col mt-0.5 p-0.25 overflow-hidden bg-grey-mid"
        :style="{ backgroundColor: colorBg }">
        <summary class="flex flex-wrap items-center justify-between cursor-pointer p-0.5 md:p-0.75"
            :aria-label="t('health.treatment.summaryLabel')">
            <h4>{{ medication.name }}</h4>
            <span class="tag bg-bg-rgba border border-border text-text-softer ml-auto">{{
                t(getLabel(medication.frequency, MED_FREQUENCY)) }}</span>
            <span v-if="dailyMissed(medication)"
                class="flex w-1.5 h-1.5 rounded-full bg-error text-white items-center justify-center ml-0.5" role="img"
                :aria-label="t('health.treatment.missedDoseToday')"> ! </span>
            <ChevronDown class="chevron default-transition ml-1" />
        </summary>
        <div class="p-0.5 flex flex-col gap-1">
            <p v-if="medication.instructions"
                class="font-light italic flex gap-0.25 items-center my-0.5 p-0.5 rounded-xl">
                <MessageCircleWarning :size="20" />{{ medication.instructions }}
            </p>
            <ProgressBar v-if="medication.endDate && (!treatment.endDate || isMedicationEnded(medication))"
                :progress="progress(medication)!" :color="color" />
            <TreatmentLogs :pet="pet" :colorIndex="colorIndex" :treatment="treatment" :medication="medication" />
            <MissedDoses v-if="missedHistory(medication).length" :pet="pet" :treatment="treatment"
                :missedDoses="missedHistory(medication)" />
            <LogHistory v-if="medicationLogs(medication).length" :pet="pet" :treatment="treatment"
                :medication="medication" :logs="medicationLogs(medication)" />
        </div>
    </details>
</template>