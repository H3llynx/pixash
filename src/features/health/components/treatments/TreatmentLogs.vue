<script setup lang="ts">
import { Pen, X } from '@lucide/vue';
import { nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { useToast } from '../../../../composables/useToast';
import { usePets } from '../../../pets/composables/usePets';
import type { PetExtended } from '../../../pets/types';
import type { Log, LogExtended, MedicationLogExtended, MedicineDb, TreatmentExtended } from '../../types';
import { getDailyDose } from '../../utils';
import EditLogTime from './EditLogTime.vue';

const props = defineProps<{
    pet: PetExtended
    medication: MedicineDb
    treatment: TreatmentExtended
    color: string
}>();

const { addNewLog, deleteSelectedLog, healthError, selectLog, selectedLog } = usePets();
const { t, locale } = useI18n();
const { show } = useToast();
const loading = ref<boolean>(false);
const isEditing = ref<boolean>(false);

const getLoggedList = (medication: MedicineDb) => {
    if (!medication) return [];
    const today = new Date().toLocaleDateString();
    return props.pet.logs.filter(log =>
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
    loading.value = true;
    const log: Log = {
        type: "medication",
        treatmentId: props.treatment.id,
        medicineId: medication.id
    };
    try {
        await addNewLog(log, props.pet.id);
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
    } finally { loading.value = false; }
};

const deleteDose = async (log: LogExtended) => {
    loading.value = true;
    try {
        await deleteSelectedLog(log, props.pet.id);
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
    } finally { loading.value = false; }
}

const editLogTime = async (log: MedicationLogExtended) => {
    selectLog(log, "medication");
    await nextTick();
    isEditing.value = true;
}
</script>

<template>
    <div class="flex gap-0.5 mt-0.75 flex-wrap" :style="{ '--custom-color': color }">
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
            <div class="absolute -top-[10px] -right-[5px] flex gap-0.25">
                <Button :disabled="loading" variant="ghost" size="xxs" :aria-label="t('health.cta.editMedTime')"
                    @click="editLogTime(log)" v-model="isEditing" class="log-btn hover:bg-green-pale">
                    <Pen :size="13" />
                </Button>
                <Button :disabled="loading" variant="ghost" size="xxs" :aria-label="t('health.cta.cancelLog')"
                    @click="deleteDose(log)" class="log-btn hover:bg-error">
                    <X :size="13" />
                </Button>
            </div>
        </div>
        <Button :disabled="loading" v-for="number in getDoseButtons(medication)" :key="number" variant="ghost" size="xs"
            @click="logDose(medication)" class="dose border border-border">
            {{ t("health.cta.logDose") }} {{ getDailyDose(medication.frequency) !== undefined ? number +
                getLoggedList(medication).length
                : "" }}</Button>
    </div>
    <EditLogTime v-if="selectedLog.medication" v-model="isEditing" :medication="medication"
        :log="selectedLog.medication" :pet="pet" />
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
    border: 1px solid var(--color-separator);
}

@media (width >=48rem) {

    .dose,
    .log {
        min-width: 32%;
    }

    .dose {
        background: var(--color-separator);
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