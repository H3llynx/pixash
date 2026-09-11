<script setup lang="ts">
import { Timestamp } from 'firebase/firestore';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../../components/Button.vue';
import FreeModal from '../../../../../components/FreeModal.vue';
import Input from '../../../../../components/Input.vue';
import { formatDateTimeLocal, tsFromInput, tsToDate } from '../../../../../utils.ts';
import { usePets } from '../../../../pets/composables/usePets.ts';
import { useTreatments } from '../../../composables/useTreatments.ts';
import type { Log } from '../../../types.ts';

const { pets } = usePets();
const { isModalOpen, closeModal, modalState, editLogTime, logDose, editedLog, editedTreatment, savingLogIds, savingNewLog, missedDate, logMedication, getDailyDosesToLog } = useTreatments();
const { t } = useI18n();

const timeData = ref<string>("");
const inputType = computed(() => isToday.value ? "time" : "datetime-local");

const pet = computed(() => pets.value.find(p => p.id === editedTreatment.value?.petId));
const isToday = computed(() => {
    if (!editedLog.value) return false;
    return editedLog.value.givenAt.toDate().toLocaleDateString() === new Date().toLocaleDateString();
});

const dosesRemainingToday = computed(() => {
    console.log(pet.value, editedTreatment.value, logMedication.value, pet.value);
    if (!pet.value || !editedTreatment.value || !logMedication.value) return null;
    return getDailyDosesToLog(pet.value, editedTreatment.value, logMedication.value);
});

const minMedicationDate = computed(() =>
    editedTreatment.value ? formatDateTimeLocal(editedTreatment.value.startDate.toDate()) : undefined
);

const maxMedicationDate = computed(() => {
    console.log(modalState.value, dosesRemainingToday.value)
    const now = new Date();
    const endDate = logMedication.value?.endDate?.toDate();
    let max = now;
    if (dosesRemainingToday.value !== null && dosesRemainingToday.value <= 0) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(23, 59, 59, 999);
        if (yesterday < max) max = yesterday;
    }
    if (endDate) {
        const endOfMedicationDay = new Date(endDate);
        endOfMedicationDay.setHours(23, 59, 59, 999);
        if (endOfMedicationDay < max) max = endOfMedicationDay;
    }
    return formatDateTimeLocal(max);
});

const maxTime = computed(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
});

const handleCancel = () => {
    closeModal();
    timeData.value = "";
};

const handleSubmit = async () => {
    if (!timeData.value) return;

    if (modalState.value === "edit") {
        const log = editedLog.value;
        if (!log) return;

        let newGivenAt: Timestamp;
        if (isToday.value) {
            const [hourStr, minuteStr = "0", secondStr = "0"] = timeData.value.split(":");
            const date = log.givenAt.toDate();
            date.setHours(Number(hourStr), Number(minuteStr), Number(secondStr), 0);
            newGivenAt = Timestamp.fromDate(date);
        } else {
            newGivenAt = tsFromInput(timeData.value)!;
        }
        const updatedLog: Log = {
            type: log.type,
            treatmentId: log.treatmentId,
            medicineId: log.medicineId,
            givenAt: newGivenAt
        };

        closeModal();
        timeData.value = "";
        await editLogTime(log, updatedLog);
    }
    else if (modalState.value === "add") {
        if (!editedTreatment.value || !logMedication.value) return;
        const treatment = editedTreatment.value;
        const medication = logMedication.value;
        const date = timeData.value;

        closeModal();
        timeData.value = "";
        await logDose(treatment, medication, date);
    }
};

watch(() => modalState.value, (state) => {
    if (!state) return;
    if (state === "edit" && editedLog.value) {
        if (isToday.value) {
            const loggedTime = tsToDate(editedLog.value.givenAt, "datetime") as string;
            if (loggedTime) timeData.value = loggedTime.split("T")[1].slice(0, 5);
        } else {
            timeData.value = tsToDate(editedLog.value.givenAt, "datetime") as string;
        }
    } else if (state === "add" && missedDate.value) {
        const now = new Date();
        const logDate = new Date(missedDate.value);
        logDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
        timeData.value = formatDateTimeLocal(logDate);
    }
});
</script>

<template>
    <FreeModal v-model="isModalOpen">
        <form class="flex flex-col gap-1 mini-form" @submit.prevent="handleSubmit">
            <h3 class="font-title">{{ t("health.treatment.modalTitle", {
                medication: logMedication?.name, name:
                    pet?.name
            })
            }}
            </h3>
            <Input v-model="timeData" :type="inputType" id="medication-time-log"
                :min="inputType === 'datetime-local' ? minMedicationDate : undefined"
                :max="inputType === 'datetime-local' ? maxMedicationDate : maxTime" />
            <Button :disabled="modalState === 'add' ? savingNewLog : (!!editedLog && savingLogIds.has(editedLog.id))">
                {{ t("common.button.confirm")
                }}
            </Button>
            <Button :disabled="modalState === 'add' ? savingNewLog : (!!editedLog && savingLogIds.has(editedLog.id))"
                type="button" variant="ghost" @click="handleCancel">{{
                    t("common.button.cancel")
                }}</Button>
        </form>
    </FreeModal>
</template>