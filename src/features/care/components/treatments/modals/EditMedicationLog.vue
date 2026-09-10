<script setup lang="ts">
import { Timestamp } from 'firebase/firestore';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../../components/Button.vue';
import FreeModal from '../../../../../components/FreeModal.vue';
import Input from '../../../../../components/Input.vue';
import { useToast } from '../../../../../composables/useToast.ts';
import { tsToDate } from '../../../../../utils.ts';
import { usePets } from '../../../../pets/composables/usePets.ts';
import { useTreatments } from '../../../composables/useTreatments.ts';
import type { Log } from '../../../types.ts';

const { pets, updateSelectedLog, careError } = usePets();
const { isEditing, editedLog, savingLogIds, logMedication } = useTreatments();
const { show } = useToast();
const { t } = useI18n();

const timeData = ref<string>("");

const pet = computed(() => pets.value.find(pet => pet.id === editedLog.value?.petId));

const handleCancel = () => {
    isEditing.value = false;
    editedLog.value = null;
    logMedication.value = null;
    timeData.value = "";
};

const handleSubmit = async () => {
    if (!timeData.value || !editedLog.value) return;
    const log = editedLog.value;
    const [hourStr, minuteStr = "0", secondStr = "0"] = timeData.value.split(":");
    const date = log.givenAt.toDate();
    date.setHours(Number(hourStr), Number(minuteStr), Number(secondStr), 0);
    const updatedLog: Log = {
        type: log.type,
        treatmentId: log.treatmentId,
        medicineId: log.medicineId,
        givenAt: Timestamp.fromDate(date)
    };
    isEditing.value = false;
    timeData.value = "";
    savingLogIds.add(log.id);
    try {
        await updateSelectedLog(log, updatedLog);
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
    } finally {
        savingLogIds.delete(log.id);
        if (editedLog.value?.id === log.id) editedLog.value = null;
    }
};

watch(() => isEditing.value, (editing) => {
    if (editing && editedLog.value) {
        const loggedTime = tsToDate(editedLog.value.givenAt, "datetime") as string;
        if (loggedTime) timeData.value = loggedTime.split("T")[1].slice(0, 5);
    }
});
</script>

<template>
    <FreeModal v-model="isEditing">
        <form class="flex flex-col gap-1 mini-form" @submit.prevent="handleSubmit">
            <h3 class="font-title">{{ t("health.treatment.editMedTime", {
                medication: logMedication?.name, name:
                    pet?.name
            })
                }}
            </h3>
            <Input v-model="timeData" type="time" id="medication-time-log" />
            <Button :disabled="!!editedLog && savingLogIds.has(editedLog.id)">{{ t("common.button.confirm")
            }}</Button>
            <Button :disabled="!!editedLog && savingLogIds.has(editedLog.id)" type=" button" variant="ghost"
                @click="handleCancel">{{
                    t("common.button.cancel")
                }}</Button>
        </form>
    </FreeModal>
</template>