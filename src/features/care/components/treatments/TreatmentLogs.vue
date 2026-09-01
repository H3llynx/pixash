<script setup lang="ts">
import { Pen, X } from '@lucide/vue';
import { nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { useToast } from '../../../../composables/useToast.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import type { PetExtended } from '../../../pets/types.ts';
import { useTreatmentTracking } from '../../composables/useTreatmentTracking.ts';
import type { Log, MedicationLogExtended, MedicineDb, TreatmentExtended } from '../../types.ts';
import { getDailyDose } from '../../utils.ts';
import EditLogTime from './EditLogTime.vue';

const props = defineProps<{
    pet: PetExtended
    medication: MedicineDb
    treatment: TreatmentExtended
    color: string
}>();

const { addNewLog, selectLog, deleteSelectedLog, careError, selectedMedicationLog } = usePets();
const { getTodayLoggedList, getDosesToLog, getMissedDoses, loading, isEditing } = useTreatmentTracking();
const { t, locale } = useI18n();
const { show } = useToast();

const logDose = async (medication: MedicineDb) => {
    loading.value = true;
    const log: Log = {
        type: "medication",
        treatmentId: props.treatment.id,
        medicineId: medication.id
    };
    try {
        await addNewLog(log, props.pet.id);
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
    } finally { loading.value = false; }
};

const deleteDose = async (log: MedicationLogExtended) => {
    loading.value = true;
    try {
        await deleteSelectedLog(log, props.pet.id);
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
    } finally { loading.value = false; }
}

const editLogTime = async (log: MedicationLogExtended) => {
    selectLog(log);
    await nextTick();
    isEditing.value = true;
}

const getSortedLoggedList = (pet: PetExtended, treatment: TreatmentExtended, medication: MedicineDb) =>
    [...getTodayLoggedList(pet, treatment, medication)].sort((a, b) => a.givenAt.toMillis() - b.givenAt.toMillis());
</script>

<template>
    <div class="flex gap-0.5 mt-0.75 flex-wrap" :style="{ '--custom-color': color }">
        <div v-for="log in getSortedLoggedList(props.pet, props.treatment, medication)" :key="log.id"
            :class="{ 'log text-xs relative border border-separator py-0.5 text-center rounded-xl flex items-center justify-center': true, 'opacity-40 animate-pulse': loading && selectedMedicationLog?.id === log.id }"
            :style="{ color: color }">
            <p class="rounded-xl w-full px-1.5">
                {{ log.givenAt.toDate().toLocaleString(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: '2-digit',
                    minute: '2-digit'
                }) }}</p>
            <div class="absolute -top-[10px] -right-[5px] flex gap-0.25">
                <Button :disabled="loading && selectedMedicationLog?.id === log.id" variant="ghost" size="xxs"
                    :aria-label="t('health.cta.editMedTime')" @click="editLogTime(log)"
                    class="log-btn hover:bg-green-pale">
                    <Pen :size="13" />
                </Button>
                <Button :disabled="loading && selectedMedicationLog?.id === log.id" variant="ghost" size="xxs"
                    :aria-label="t('common.button.delete')" @click="deleteDose(log)" class="log-btn hover:bg-error">
                    <X :size="13" />
                </Button>
            </div>
        </div>
        <Button :disabled="loading" v-for="number in getDosesToLog(props.pet, props.treatment, medication)"
            :key="number" variant="ghost" size="xs" @click="logDose(medication)"
            :class="{ 'dose border border-border': true, 'missed': getMissedDoses(pet, treatment, medication) && number === 1 }">
            {{ t("health.cta.logDose") }} {{ getDailyDose(medication.frequency) !== undefined ? number +
                getTodayLoggedList(props.pet, props.treatment, medication).length
                : "" }}
        </Button>
    </div>
    <EditLogTime v-if="selectedMedicationLog" v-model="isEditing" :medication="medication" :log="selectedMedicationLog"
        :pet="pet" />
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

.log-btn {
    border-radius: 8px;
    padding: 3px;
    border: 1px solid var(--color-border-light);
}

button.missed {
    background: var(--color-error);
    color: white;
}

@media (width >=48rem) {

    .dose,
    .log {
        min-width: 32%;
    }

    .dose {
        background: var(--color-border-light);
        color: var(--color-text);
    }
}

@media (hover: hover) and (pointer: fine) {
    .dose:not(:disabled):hover {
        background-color: var(--custom-color);
        color: var(--color-white);
    }

    .log-btn:hover {
        color: var(--color-white);
    }
}
</style>