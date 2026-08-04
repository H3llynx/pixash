<script setup lang="ts">
import { Calendar, Ellipsis, Hospital } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Button from '../../../../components/Button.vue';
import { ROUTES } from '../../../../router/config.ts';
import { getLabel, tsToDate } from '../../../../utils.ts';
import PetTag from '../../../pets/components/PetTag.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import type { PetExtended } from '../../../pets/types.ts';
import { MED_FREQUENCY } from '../../config.ts';
import type { TreatmentExtended } from '../../types.ts';
import { getMedicationProgress, getTreatmentColor } from '../../utils.ts';
import DateTag from '../events/DateTag.vue';
import ProgressBar from './ProgressBar.vue';

const { pets, vets, selectTreatment, treatmentLoading, selectedTreatment } = usePets();
const { t } = useI18n();
const route = useRoute();

const props = defineProps<{ treatment: TreatmentExtended }>();

const isRegisteredVet = computed(() => vets.value?.find(vet => vet.id === props.treatment.vet));
const vet = computed(() => isRegisteredVet.value?.name ?? props.treatment.vet);
</script>

<template>
    <div
        :class="{ 'animate-pulse': treatmentLoading && selectedTreatment?.id === treatment.id, 'card p-1 w-full md:max-w-md border border-border gap-1': true }">
        <div>
            <div class="flex gap-0.5 w-full justify-between items-start">
                <h4 class="font-medium inline">{{ treatment.name }}</h4>
                <PetTag class="ml-auto" :pet="pets.find((pet: PetExtended) => pet.id === treatment.petId)!"
                    :color="false" />
                <Button variant="ghost" size="xs" class="inline ml-0.25 py-0.25" @click="selectTreatment(treatment)"
                    :aria-label="t('health.cta.viewTreatment')">
                    <Ellipsis :size="18" />
                </Button>
            </div>
            <div class="flex gap-0.5 w-full justify-between my-0.5 text-xs">
                <p class="flex items-center gap-[5px] italic text-text-secondary">
                    <Calendar :size="18" />
                    {{ tsToDate(treatment.startDate, "date") }}
                </p>
                <p class="text-brand flex items-center gap-[5px]">
                    <Hospital :size="16" class="shrink-0" /> {{ vet }}
                </p>
            </div>
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