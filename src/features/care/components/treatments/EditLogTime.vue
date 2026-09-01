<script setup lang="ts">
import { Timestamp } from 'firebase/firestore';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import FreeModal from '../../../../components/FreeModal.vue';
import Input from '../../../../components/Input.vue';
import { tsToDate } from '../../../../utils.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import type { PetExtended } from '../../../pets/types.ts';
import type { Log, MedicationLogExtended, MedicineDb } from '../../types.ts';

const { updateSelectedLog, selectLog } = usePets();
const { t } = useI18n();

const props = defineProps<{
    medication: MedicineDb
    pet: PetExtended
    log: MedicationLogExtended
}>();

const isEditing = defineModel<boolean>();
const timeData = ref<string>("");

const resetLog = () => {
    isEditing.value = false;
    selectLog(null);
    timeData.value = "";
};

const handleSubmit = async () => {
    if (!timeData.value) return;
    const [hourStr, minuteStr = "0", secondStr = "0"] = timeData.value.split(":");
    const hours = Number(hourStr);
    const minutes = Number(minuteStr);
    const seconds = Number(secondStr);
    const date = props.log.givenAt.toDate();
    date.setHours(hours, minutes, seconds, 0);
    const updatedLog: Log = {
        type: props.log.type,
        treatmentId: props.log.treatmentId,
        medicineId: props.medication.id,
        givenAt: Timestamp.fromDate(date)
    };
    resetLog();
    await updateSelectedLog(props.log, props.pet.id, updatedLog);
};

watch(() => isEditing.value, (editing) => {
    if (editing) {
        const loggedTime = tsToDate(props.log.givenAt, "datetime") as string;
        if (loggedTime) timeData.value = loggedTime.split("T")[1].slice(0, 5);
    }
});
</script>

<template>
    <FreeModal v-model="isEditing">
        <form class="flex flex-col gap-1 mini-form" @submit.prevent="handleSubmit">
            <h3 class="font-title">{{ t("health.treatment.editMedTime", { medication: medication.name, name: pet.name })
                }}
            </h3>
            <div class="flex gap-0.5">
                <Input v-model="timeData" type="time" id="medication-time-log" class="text-base" />
            </div>
            <Button>{{ t("common.button.confirm") }}</Button>
            <Button type="button" variant="ghost" @click="resetLog">{{
                t("common.button.cancel")
            }}</Button>
        </form>
    </FreeModal>
</template>