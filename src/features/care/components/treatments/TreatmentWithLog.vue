<script setup lang="ts">
import { ChevronDown, Ellipsis, MessageCircleWarning, NotepadText, TriangleAlert } from '@lucide/vue';
import { computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { getLabel, tsToDate } from '../../../../utils.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useTreatments } from '../../composables/useTreatments.ts';
import { MED_FREQUENCY } from '../../config.ts';
import type { MedicineDb, TreatmentExtended } from '../../types.ts';
import { getMedicationProgress, getTreatmentBackground, getTreatmentColor, getTreatmentProgress } from '../../utils.ts';
import AddMissedLog from './AddMissedLog.vue';
import ProgressBar from './ProgressBar.vue';
import TreatmentLogs from './TreatmentLogs.vue';

const { selectTreatment, pets, treatmentLoading, selectedTreatment } = usePets();
const { getDailyMissedDoses, getMissedDosesHistory, isAdding, selectedMedication, medicationDate } = useTreatments();
const { t } = useI18n();

const props = defineProps<{ treatment: TreatmentExtended; colorIndex: number }>();
const progress = computed(() => getTreatmentProgress(props.treatment));
const color = computed(() => getTreatmentColor(props.colorIndex));

const pet = computed(() => pets.value.find(pet => pet.id === props.treatment.petId));

const addMissedLog = async (medication: MedicineDb, date: Date) => {
    selectedMedication.value = medication;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const clickedDate = date.toISOString().split("T")[0];
    medicationDate.value = `${clickedDate}T${h}:${min}`;
    await nextTick();
    isAdding.value = true;
    console.log(medicationDate.value)
}


</script>

<template>
    <div :class="{ 'animate-pulse': treatmentLoading && selectedTreatment?.id === treatment.id, 'card card-border': true }"
        v-if="pet">
        <div class="flex gap-1 justify-between">
            <h3 class="text-base">{{ treatment.name }}</h3>
            <Button variant="ghost" size="xs" @click="selectTreatment(treatment)"
                :aria-label="t('health.cta.viewTreatment')">
                <Ellipsis :size="18" />
            </Button>
        </div>
        <div class="text-sm text-text-secondary">
            <div class="flex gap-[5px] mb-0.25 items-center">
                <span>📆</span>
                <span>{{ tsToDate(treatment.startDate, "date") }}</span>
                <span v-if="treatment.endDate"> - {{ tsToDate(treatment.endDate, "date") }}</span>
                <span v-else class="ml-auto tag border border-border bg-border-light text-text-softer">{{
                    t("health.treatment.ongoing")
                    }}</span>
            </div>
            <ProgressBar v-if="progress" :progress="progress" :color="color" />
        </div>
        <p v-if="treatment.notes" class="text-sm italic flex gap-0.5 items-center my-0.5">
            <NotepadText />
            {{ treatment.notes }}
        </p>
        <details v-for="medication in treatment.medication" :key="medication.id"
            class="rounded-xl text-sm flex flex-col mt-0.5 p-0.5 overflow-hidden"
            :style="{ backgroundColor: getTreatmentBackground(colorIndex) }">
            <summary class="flex flex-wrap items-center justify-between cursor-pointer p-0.75"
                :aria-label="t('health.treatment.summaryLabel')">
                <p class="font-medium">{{ medication.name }}</p>
                <span class="tag bg-bg-rgba border border-border text-text-softer ml-auto">{{
                    t(getLabel(medication.frequency, MED_FREQUENCY)) }}</span>
                <span class="tag bg-error text-white ml-0.5"
                    v-if="getDailyMissedDoses(pet, treatment, medication)">!</span>
                <ChevronDown class="chevron default-transition ml-1" />
            </summary>
            <div class="px-0.5 pb-0.75">
                <p v-if="medication.instructions"
                    class="font-light italic flex gap-0.25 items-center my-0.5 p-0.5 rounded-xl">
                    <MessageCircleWarning :size="20" />{{ medication.instructions }}
                </p>
                <ProgressBar v-if="!treatment.endDate && medication.endDate"
                    :progress="getMedicationProgress(treatment, medication)!" :color="color" />
                <TreatmentLogs :pet="pet" :colorIndex="colorIndex" :treatment="treatment" :medication="medication" />
            </div>
            <div v-if="getMissedDosesHistory(pet, treatment, medication).length" class="p-1 flex flex-col gap-0.5">
                <div class="inline-flex gap-0.5 mb-0.5 font-medium uppercase text-text-secondary">
                    <TriangleAlert :size="20" />
                    <h4>{{ t('health.treatment.missedDoses') }}</h4>
                </div>
                <div v-for="missed in getMissedDosesHistory(pet, treatment, medication)"
                    :key="`${treatment.id}-${medication.id}-${missed.date}`"
                    class="inline-flex items-center gap-1 w-full p-0.75 rounded-xl bg-error-rgba border-l-3 border-error">
                    <span>{{ missed.date.toLocaleDateString() }}</span>
                    <span class="flex w-1.5 h-1.5 rounded-full bg-error text-white items-center justify-center">{{
                        missed.count
                    }}</span>
                    <button @click="addMissedLog(medication, missed.date)"
                        class="rounded-full border border-error-text text-error-text px-1 py-[3px] ml-auto hover:bg-error hover:text-white hover:border-error-border">Log</button>
                </div>
            </div>
        </details>
        <AddMissedLog v-if="selectedMedication && medicationDate" v-model="isAdding" :treatment="treatment"
            :medication="selectedMedication" :pet="pet" :date="medicationDate" />
    </div>
</template>

<style scoped>
details[open] summary {
    border-bottom: 1px solid var(--color-border-light);

    .chevron {
        transform: rotate(180deg);
    }
}
</style>