<script setup lang="ts">
import { Calendar, Pill } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { tsToDate } from '../../../../utils.ts';
import PetTag from '../../../pets/components/PetTag.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useEvents } from '../../composables/useEvents.ts';
import { getTreatmentProgress } from '../../utils.ts';
import ProgressBar from './ProgressBar.vue';

const { selectTreatment, treatmentLoading, selectedTreatment, pets } = usePets();
const { filteredMonthTreatments } = useEvents();
const { t } = useI18n();
</script>

<template>
    <article class="pet-section" v-if="filteredMonthTreatments.length">
        <h2>{{ t("events.treatments") }}</h2>
        <div class="grid grid-cols-1 gap-1">
            <Button v-for="treatment in filteredMonthTreatments" variant="ghost" size="sm"
                @click="selectTreatment(treatment)" :aria-label="t('health.cta.editTreatment')"
                :class="{ 'animate-pulse': treatmentLoading && selectedTreatment?.id === treatment.id, 'w-full h-full md:max-w-md border border-border': true }">
                <div class="rounded-xl w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
                    <Pill />
                </div>
                <div class="text-left w-full text-sm py-0.25">
                    <div class="flex gap-1 justify-between mb-0.25 items-end">
                        <h4>{{ treatment.name }}</h4>
                        <PetTag :pet="pets.find(pet => pet.id === treatment.petId)!" :color="false" />
                    </div>
                    <p class="flex items-center gap-[5px] mt-0.5 text-text-secondary italic text-xs">
                        <Calendar :size="18" />
                        <span>
                            {{ tsToDate(treatment.startDate, "date") }}
                        </span>
                        <span v-if="treatment.endDate"> - {{
                            tsToDate(treatment.endDate, "date") }}</span>
                    </p>
                    <ProgressBar v-if="treatment.endDate" :progress="getTreatmentProgress(treatment)!"
                        :color="treatment.color" />
                    <span v-else class="inline ml-0.5 float-right tag bg-separator text-text-secondary">{{
                        t("health.treatment.ongoing")
                        }}</span>
                </div>
            </Button>
        </div>
    </article>
</template>


<style scoped>
button {
    background: var(--color-bg-2);
    gap: 1rem;
}
</style>