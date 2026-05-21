<script setup lang="ts">
import { Timestamp } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import FreeModal from '../../../../components/FreeModal.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import { tsToDate } from '../../../../utils';
import { usePets } from '../../../pets/composables/usePets';
import type { PetExtended } from '../../../pets/types';
import type { Log, MedicationLogExtended, MedicineDb } from '../../types';

const { updateSelectedLog, selectLog } = usePets();
const { t } = useI18n();

const props = defineProps<{
    medication: MedicineDb
    pet: PetExtended
    log: MedicationLogExtended
}>();

const isEditing = defineModel<boolean>();
const loading = ref<boolean>(false);
const timeData = ref<string>("");

const handleSubmit = async () => {
    if (!timeData.value || !props.log) return;
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
    await updateSelectedLog(props.log, props.pet.id, updatedLog);
    loading.value = false;
    isEditing.value = false;
};

const handleCancel = () => {
    isEditing.value = false;
    selectLog(null, "medication");
    timeData.value = "";
};

onMounted(() => {
    const loggedTime = tsToDate(props.log.givenAt, "datetime") as string;
    if (loggedTime) timeData.value = loggedTime.split("T")[1].slice(0, 5);
});
</script>

<template>
    <FreeModal v-model="isEditing">
        <LoadingPuppy v-if="loading" class="max-w-xs" />
        <form v-else-if="log" class="flex flex-col gap-1 mini-form" @submit.prevent="handleSubmit">
            <h3 class="font-title">When did you give {{ medication.name }} to {{ pet.name }}?</h3>
            <div class="flex gap-0.5">
                <Input v-model="timeData" type="time" id="medication-time-log" class="text-base" />
            </div>
            <Button>{{ t("common.button.confirm") }}</Button>
            <Button type="button" variant="ghost" @click="handleCancel">{{
                t("common.button.cancel")
            }}</Button>
        </form>
    </FreeModal>
</template>