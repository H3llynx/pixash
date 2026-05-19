<script setup lang="ts">
import { Edit2 } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { getLabel, tsToDate } from '../../../../utils';
import { usePets } from '../../../pets/composables/usePets';
import { MED_FREQUENCY } from '../../config';
import type { TreatmentExtended } from '../../types';
import { getDoseButtons, getMedicationProgress, getTreatmentProgress } from '../../utils';
import ProgressBar from './ProgressBar.vue';

const { selectTreatment } = usePets();
const { t } = useI18n();

const props = defineProps<{ treatment: TreatmentExtended; color: string }>();

const progress = computed(() => getTreatmentProgress(props.treatment));
</script>

<template>
    <div class="card">
        <div class="flex gap-1 justify-between">
            <h3 class="text-base">{{ treatment.name }}</h3>
            <Button variant="ghost" size="xs" @click="selectTreatment(treatment)"
                :aria-label="t('health.cta.editTreatment')">
                <Edit2 :size="15" />
            </Button>
        </div>
        <p v-if="treatment.notes" class="text-text-secondary">{{ treatment.notes }}</p>
        <div class="text-sm text-text-secondary">
            <div class="text-xs">
                <span v-if="!treatment.endDate">{{ t("health.treatment.started") }}</span>
                <span>{{ tsToDate(treatment.startDate, "date") }}</span>
                <span v-if="treatment.endDate"> - {{ tsToDate(treatment.endDate, "date") }}</span>
                <span v-else class="inline ml-0.5 float-right tag bg-separator text-text-secondary">{{
                    t("health.treatment.ongoing")
                }}</span>
            </div>
            <ProgressBar v-if="progress" :progress="progress" :color="color" />
        </div>
        <div v-for="medication in treatment.medication" class="text-sm flex flex-col gap-0.25 mt-0.5">
            <p>{{ medication.name }}</p>
            <p class="italic font-medium text-text-secondary text-xs">{{
                t(getLabel(medication.frequency,
                    MED_FREQUENCY))
            }}</p>
            <ProgressBar v-if="!treatment.endDate && medication.endDate"
                :progress="getMedicationProgress(treatment, medication)!" :color="color" />
            <div class="flex gap-0.5">
                <Button v-for="(_dose, index) in getDoseButtons(medication.frequency)" variant="ghost" size="xs"
                    @click="console.log(treatment)" class="bg-separator w-full hover:text-white border border-border"
                    :style="{ '--custom-color': color }">
                    {{ t("health.cta.logDose") }} {{ getDoseButtons(medication.frequency) > 1 ? index + 1 : ""
                    }}</Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
button:hover {
    background-color: var(--custom-color);
}
</style>