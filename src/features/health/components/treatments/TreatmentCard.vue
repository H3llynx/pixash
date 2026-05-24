<script setup lang="ts">
import { Eye } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Button from '../../../../components/Button.vue';
import { ROUTES } from '../../../../router/config';
import { getLabel, tsToDate } from '../../../../utils';
import PetTag from '../../../pets/components/PetTag.vue';
import { usePets } from '../../../pets/composables/usePets';
import { MED_FREQUENCY } from '../../config';
import type { TreatmentExtended } from '../../types';
import { getMedicationProgress, getTreatmentColor } from '../../utils';
import DateTag from '../events/DateTag.vue';
import ProgressBar from './ProgressBar.vue';

const { pets, selectTreatment } = usePets();
const { t } = useI18n();
const route = useRoute();

defineProps<{ treatment: TreatmentExtended }>();
</script>

<template>
    <div class="card p-1 w-full md:max-w-md border border-border gap-1">
        <div class="flex gap-1 justify-between w-full items-start">
            <div class="flex gap-0.5 items-start">
                <div>
                    <h4 class="font-medium">{{ treatment.name }}</h4>
                    <p class="text-xs italic text-text-secondary">{{ t("health.treatment.started") }}{{
                        tsToDate(treatment.startDate, "date") }}</p>
                </div>
                <Button variant="ghost" size="xs" @click="selectTreatment(treatment)"
                    :aria-label="t('health.cta.editTreatment')">
                    <Eye :size="15" />
                </Button>
            </div>
            <PetTag :pet="pets.find(pet => pet.id === treatment.petId)!" :color="false" />
        </div>
        <div v-for="(medication, index) in treatment.medication" class="text-sm">
            <div class="flex gap-1 justify-between items-center">
                <div>
                    <p>{{ medication.name }}</p>
                    <span class="italic font-medium text-brand text-xs">{{ t(getLabel(medication.frequency,
                        MED_FREQUENCY))
                        }}</span>
                    <span v-if="medication.endDate" class="italic font-medium text-text-secondary text-xs ml-0.5">
                        <span v-if="route.path === ROUTES.history">{{ t("health.treatment.ended") }}</span>
                        <span v-else>{{ t("health.treatment.until") }}</span>
                        {{ tsToDate(medication.endDate, "date") }}</span>
                </div>
                <DateTag v-if="treatment.endDate" :date="medication.endDate" class="inline float-right ml-0.5" />
            </div>
            <template v-if="route.path !== ROUTES.history">
                <ProgressBar v-if="medication.endDate" :progress="getMedicationProgress(treatment, medication)!"
                    :color="getTreatmentColor(index)" class="w-full my-0.25" />
                <span v-else class="tag bg-separator text-text-secondary inline float-right">{{
                    t("health.treatment.ongoing")
                }}</span>
            </template>
        </div>
    </div>
</template>