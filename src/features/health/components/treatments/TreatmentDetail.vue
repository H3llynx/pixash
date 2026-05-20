<script setup lang="ts">
import { Edit2, X } from '@lucide/vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { useToast } from '../../../../composables/useToast';
import { getLabel, tsToDate } from '../../../../utils';
import { usePets } from '../../../pets/composables/usePets';
import { MED_FREQUENCY } from '../../config';
import type { Log, LogExtended, MedicationLogExtended, MedicineDb, TreatmentExtended } from '../../types';
import { getDailyDose, getMedicationProgress, getTreatmentProgress } from '../../utils';
import ProgressBar from './ProgressBar.vue';

const { selectTreatment, addNewLog, pets, deleteSelectedLog, healthError } = usePets();
const { t, locale } = useI18n();
const { show } = useToast();

const props = defineProps<{ treatment: TreatmentExtended; color: string }>();
const progress = computed(() => getTreatmentProgress(props.treatment));
const loading = ref<boolean>(false);
const pet = computed(() => pets.value.find(pet => pet.id === props.treatment.petId));

const getLoggedList = (medication: MedicineDb) => {
    if (!pet.value || !medication) return [];
    const today = new Date().toLocaleDateString();
    return pet.value.logs.filter(log =>
        log.type === "medication" &&
        log.treatmentId === props.treatment.id &&
        log.medicineId === medication.id &&
        log.givenAt &&
        log.givenAt.toDate().toLocaleDateString() === today
    ) as MedicationLogExtended[];
};

const getDoseButtons = (medication: MedicineDb) => {
    const loggedList = getLoggedList(medication) || [];
    const dailyDose = getDailyDose(medication.frequency);
    return dailyDose !== undefined ? dailyDose - loggedList.length : 1;
};

const getLogStyle = () => {
    return {
        "rounded-xl w-full px-1.5": true,
        "opacity-60 animate-pulse": loading.value
    }
}

const logDose = async (medication: MedicineDb) => {
    if (!pet.value) return;
    loading.value = true;
    const log: Log = {
        type: "medication",
        treatmentId: props.treatment.id,
        medicineId: medication.id
    };
    try {
        await addNewLog(log, pet.value.id);
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
    } finally { loading.value = false; }
};

const deleteDose = async (log: LogExtended) => {
    if (!pet.value) return;
    loading.value = true;
    try {
        await deleteSelectedLog(log, pet.value.id);
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
    } finally { loading.value = false; }
}
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
        <div v-for="medication in treatment.medication" class="text-sm flex flex-col mt-0.5">
            <p>{{ medication.name }}</p>
            <p class="italic font-medium text-text-secondary text-xs">{{
                t(getLabel(medication.frequency,
                    MED_FREQUENCY))
            }}</p>
            <ProgressBar v-if="!treatment.endDate && medication.endDate"
                :progress="getMedicationProgress(treatment, medication)!" :color="color" />
            <div class="flex gap-0.5 mt-0.5 flex-wrap" :style="{ '--custom-color': color }">
                <div v-for="log in getLoggedList(medication)" :key="log.id"
                    class="log text-xs relative border border-separator py-0.5 text-center rounded-xl flex items-center justify-center"
                    :style="{ color: color }">
                    <p :class="getLogStyle()">{{ log.givenAt.toDate().toLocaleString(locale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    }) }}</p>
                    <Button :disabled="loading" variant="ghost" size="xxs" :aria-label="t('health.cta.cancelLog')"
                        @click="deleteDose(log)"
                        class="cancel absolute p-[3px] -top-[6px] -right-[5px] border border-separator bg-bg-rgba hover:bg-error hover:text-white">
                        <X :size="13" />
                    </Button>
                </div>
                <Button :disabled="loading" v-for="number in getDoseButtons(medication)" :key="number" variant="ghost"
                    size="xs" @click="logDose(medication)" class="dose bg-separator border border-border">
                    {{ t("health.cta.logDose") }} {{ getDoseButtons(medication) > 1 ? number : "" }}</Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dose,
.log {
    flex: 1;
    min-width: 48%;
    min-height: 3rem;
}

.log {
    border: 1px solid var(--custom-color);
}

.dose:not(:disabled):hover {
    background-color: var(--custom-color);
    color: var(--color-white);
}

.cancel {
    border-radius: 8px;
}

@media (width >=48rem) {

    .dose,
    .log {
        min-width: 32%;
    }
}
</style>