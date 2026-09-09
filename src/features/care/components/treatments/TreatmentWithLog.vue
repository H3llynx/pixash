<script setup lang="ts">
import { ChevronDown, Ellipsis, MessageCircleWarning, NotepadText } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import ProgressBar from '../../../../components/ProgressBar.vue';
import { getLabel, tsToDate } from '../../../../utils.ts';
import PetTag from '../../../pets/components/PetTag.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import type { PetExtended } from '../../../pets/types.ts';
import { useAllPetsView } from '../../composables/useAllPetsView.ts';
import { useTreatments } from '../../composables/useTreatments.ts';
import { MED_FREQUENCY } from '../../config.ts';
import type { TreatmentExtended } from '../../types.ts';
import { getMedicationProgress, getTreatmentBackground, getTreatmentColor, getTreatmentProgress } from '../../utils.ts';
import LogHistory from './LogHistory.vue';
import MissedDoses from './MissedDoses.vue';
import TreatmentLogs from './TreatmentLogs.vue';

const { selectTreatment, pets, treatmentLoading, selectedTreatment } = usePets();
const { getDailyMissedDoses, getMissedDosesHistory } = useTreatments();
const { petViewed } = useAllPetsView();
const { t } = useI18n();

const props = withDefaults(defineProps<{
    treatment: TreatmentExtended;
    colorIndex: number;
    tag?: boolean
}>(), { tag: false });

const progress = computed(() => getTreatmentProgress(props.treatment));
const color = computed(() => getTreatmentColor(props.colorIndex));
const pet = computed(() => pets.value.find(pet => pet.id === props.treatment.petId));
</script>

<template>
    <div :class="{ 'animate-pulse': treatmentLoading && selectedTreatment?.id === treatment.id, 'card card-border': true }"
        v-if="pet">
        <div class="flex gap-1 justify-between">
            <h3 class="text-base">{{ treatment.name }}</h3>
            <PetTag v-if="tag && !petViewed" class="ml-auto"
                :pet="pets.find((pet: PetExtended) => pet.id === treatment.petId)!" :color="false" />
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
            class="rounded-xl text-sm flex flex-col mt-0.5 p-0.25 overflow-hidden"
            :style="{ backgroundColor: getTreatmentBackground(colorIndex) }">
            <summary class="flex flex-wrap items-center justify-between cursor-pointer p-0.5 md:p-0.75"
                :aria-label="t('health.treatment.summaryLabel')">
                <p class="font-medium">{{ medication.name }}</p>
                <span class="tag bg-bg-rgba border border-border text-text-softer ml-auto">{{
                    t(getLabel(medication.frequency, MED_FREQUENCY)) }}</span>
                <span v-if="getDailyMissedDoses(pet, treatment, medication)"
                    class="flex w-1.5 h-1.5 rounded-full bg-error text-white items-center justify-center ml-0.5"
                    role="img" :aria-label="t('health.treatment.missedDoseToday')"> ! </span>
                <ChevronDown class="chevron default-transition ml-1" />
            </summary>
            <div class="px-0.5 pb-0.75">
                <p v-if="medication.instructions"
                    class="font-light italic flex gap-0.25 items-center my-0.5 p-0.5 rounded-xl">
                    <MessageCircleWarning :size="20" />{{ medication.instructions }}
                </p>
                <ProgressBar
                    v-if="medication.endDate && (!treatment.endDate || medication.endDate.toDate() < new Date())"
                    :progress="getMedicationProgress(treatment, medication)!" :color="color" />
                <TreatmentLogs :pet="pet" :colorIndex="colorIndex" :treatment="treatment" :medication="medication" />
            </div>
            <MissedDoses v-if="getMissedDosesHistory(pet, treatment, medication).length" :pet="pet"
                :missedDoses="getMissedDosesHistory(pet, treatment, medication)" :treatment="treatment" />
            <LogHistory :medication="medication" />
        </details>
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