<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../../components/Button.vue';
import FreeModal from '../../../../../components/FreeModal.vue';
import Input from '../../../../../components/Input.vue';
import { useToast } from '../../../../../composables/useToast.ts';
import { tsFromInput } from '../../../../../utils.ts';
import { usePets } from '../../../../pets/composables/usePets.ts';
import type { PetExtended } from '../../../../pets/types.ts';
import { useTreatments } from '../../../composables/useTreatments.ts';
import type { Log, MedicineDb, TreatmentExtended } from '../../../types.ts';

const { careError, addNewLog } = usePets();
const { loading } = useTreatments();
const { show } = useToast();
const { t } = useI18n();

const props = defineProps<{
    treatment: TreatmentExtended
    pet: PetExtended
    medication: MedicineDb
    date: Date
}>();

const isAdding = defineModel<boolean>();

const formatDateTimeLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const dateTimeData = ref<string>("");

const minMedicationDate = computed(() => {
    return formatDateTimeLocal(props.treatment.startDate.toDate());
});

const maxMedicationDate = computed(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);
    const endDate = props.medication?.endDate?.toDate();
    const max = endDate && endDate < yesterday ? endDate : yesterday;
    return formatDateTimeLocal(max);
});

const logDose = async () => {
    loading.value = true;
    const log: Log = {
        type: "medication",
        treatmentId: props.treatment.id,
        medicineId: props.medication.id,
        givenAt: tsFromInput(dateTimeData.value)
    };
    try {
        await addNewLog(log, props.pet.id);
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
    } finally {
        loading.value = false;
        isAdding.value = false;
    }
};

watch(() => isAdding.value, (adding) => {
    if (adding) {
        const now = new Date();
        const logDate = new Date(props.date);
        logDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
        dateTimeData.value = formatDateTimeLocal(logDate);
    }
});
</script>

<template>
    <FreeModal v-model="isAdding">
        <form class="flex flex-col gap-1 mini-form" @submit.prevent="logDose">
            <h3 class="font-title">{{ t("health.treatment.editMedTime", {
                medication: medication.name, name: pet.name
            }) }}
            </h3>
            <Input v-model="dateTimeData" type="datetime-local" id="medication-log" :min="minMedicationDate"
                :max="maxMedicationDate" />
            <Button :disabled="loading">{{ t("common.button.confirm") }}</Button>
            <Button :disabled="loading" type="button" variant="ghost" @click="isAdding = false;">{{
                t("common.button.cancel")
            }}</Button>
        </form>
    </FreeModal>
</template>