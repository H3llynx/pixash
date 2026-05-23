<script setup lang="ts">
import { Pill } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Loading from '../../../../components/loading/Loading.vue';
import { tsToDate } from '../../../../utils';
import PetTag from '../../../pets/components/PetTag.vue';
import { usePets } from '../../../pets/composables/usePets';
import { useEvents } from '../../composables/useEvents';
import { getTreatmentProgress } from '../../utils';
import ProgressBar from './ProgressBar.vue';

const { selectTreatment, healthLoading, selectedTreatment, pets } = usePets();
const { filteredMonthTreatments } = useEvents();
const { t } = useI18n();
</script>

<template>
    <article class="pet-section" v-if="filteredMonthTreatments.length">
        <h2>{{ t("dashboard.title.activeTreatments") }}</h2>
        <div class="grid grid-cols-1 gap-1">
            <Button v-for="treatment in filteredMonthTreatments" variant="ghost" size="sm"
                @click="selectTreatment(treatment)" :aria-label="t('health.cta.editTreatment')"
                class="w-full h-full md:max-w-md border border-border">
                <div class="rounded-xl w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
                    <Loading v-if="healthLoading && (selectedTreatment === treatment)" />
                    <Pill v-else />
                </div>
                <div class="text-left w-full text-sm py-0.25">
                    <div class="flex gap-1 justify-between mb-0.25 items-end">
                        <h4>{{ treatment.name }}</h4>
                        <PetTag :pet="pets.find(pet => pet.id === treatment.petId)!" :color="false" />
                    </div>
                    <span class="text-text-secondary italic text-xs">{{ t("health.treatment.started") }} {{
                        tsToDate(treatment.startDate, "date") }}</span>
                    <span v-if="treatment.endDate" class="text-text-secondary italic text-xs inline"> - {{
                        tsToDate(treatment.endDate, "date") }}</span>
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
}
</style>