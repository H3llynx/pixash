<script setup lang="ts">
import { Calendar, Pill } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import ProgressBar from '../../../../components/ProgressBar.vue';
import { tsToDate } from '../../../../utils.ts';
import PetTag from '../../../pets/components/PetTag.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useAllPetsView } from '../../composables/useAllPetsView.ts';
import { getTreatmentProgress } from '../../utils.ts';
import DateTag from '../events/DateTag.vue';
import TreatmentWithLog from './TreatmentWithLog.vue';

const { selectTreatment, treatmentLoading, selectedTreatment, pets } = usePets();
const { filteredMonthTreatments, petViewed } = useAllPetsView();
const { t } = useI18n();
</script>

<template>
    <article class="pet-section" v-if="filteredMonthTreatments.length">
        <h2>{{ t("health.treatment.treatments") }}</h2>
        <div class="grid grid-cols-1 gap-1">
            <TreatmentWithLog v-for="(treatment, index) in filteredMonthTreatments.filter(t => t.isActive)"
                :key="treatment.id" :treatment="treatment" :colorIndex="index" tag />
            <Button v-for="treatment in filteredMonthTreatments.filter(t => !t.isActive)" variant="card" size="card"
                :key="treatment.id" @click="selectTreatment(treatment)" :aria-label="t('health.cta.viewTreatment')"
                :class="{ 'animate-pulse': treatmentLoading && selectedTreatment?.id === treatment.id, 'opacity-60': treatment.isPast }">
                <div class="rounded-xl w-4 h-4 bg-border text-4xl flex shrink-0 justify-center items-center">
                    <Pill />
                </div>
                <div class="text-left w-full text-sm py-0.25">
                    <div class="flex gap-1 justify-between mb-0.25 items-end">
                        <h4>{{ treatment.name }}</h4>
                        <PetTag v-if="!petViewed" :pet="pets.find(pet => pet.id === treatment.petId)!" :color="false" />
                    </div>
                    <p class="flex items-center gap-[5px] mt-0.5 text-text-secondary italic text-xs">
                        <Calendar :size="18" />
                        <span>
                            {{ tsToDate(treatment.startDate, "date") }}
                        </span>
                        <span v-if="treatment.endDate"> - {{
                            tsToDate(treatment.endDate, "date") }}</span>
                    </p>
                    <DateTag v-if="!treatment.isPast" :date="treatment.startDate" class="inline float-right ml-0.5" />
                    <ProgressBar v-else :progress="getTreatmentProgress(treatment)!"
                        color="var(--color-text-secondary)" />
                </div>
            </Button>
        </div>
    </article>
</template>