<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getLabel, tsToDate } from '../../../../utils';
import PetTag from '../../../pets/components/PetTag.vue';
import { usePets } from '../../../pets/composables/usePets';
import { MED_FREQUENCY } from '../../config';
import type { TreatmentExtended } from '../../types';
import { getMedicationProgress, getProgressColor } from '../../utils';
import DateTag from '../events/DateTag.vue';
import ProgressBar from './ProgressBar.vue';

const { pets } = usePets();
const { t } = useI18n();

defineProps<{ treatment: TreatmentExtended }>();
</script>

<template>
    <div class="card cursor-pointer p-1 w-full md:max-w-md border border-border gap-1">
        <div class="flex gap-1 justify-between w-full items-start">
            <div>
                <h4 class="font-medium">{{ treatment.name }}</h4>
                <p class="text-xs italic text-text-secondary">{{ t("health.treatment.started") }}{{
                    tsToDate(treatment.startDate, "date") }}</p>
            </div>
            <PetTag :pet="pets.find(pet => pet.id === treatment.petId)!" :color="false" />
        </div>
        <div v-for="(medication, index) in treatment.medication" class="text-sm">
            <span>{{ medication.name }}</span>
            <span class="italic font-medium text-brand text-xs ml-0.5">{{
                t(getLabel(medication.frequency,
                    MED_FREQUENCY))
            }}</span>
            <DateTag v-if="treatment.endDate" :date="medication.endDate" class="inline float-right ml-0.5" />
            <ProgressBar v-if="medication.endDate" :progress="getMedicationProgress(treatment, medication)!"
                :color="getProgressColor(index)" class="w-full my-0.25" />
            <span v-else class="tag bg-separator text-text-secondary inline float-right">{{
                t("health.treatment.ongoing")
            }}</span>
        </div>
    </div>
</template>