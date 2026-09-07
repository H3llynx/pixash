<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import FreeModal from '../../../../components/FreeModal.vue';
import Input from '../../../../components/Input.vue';
import { useToast } from '../../../../composables/useToast.ts';
import { tsFromInput } from '../../../../utils.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import type { PetExtended } from '../../../pets/types.ts';
import { useTreatments } from '../../composables/useTreatments.ts';
import type { Log, TreatmentExtended } from '../../types.ts';

const { careError, addNewLog } = usePets();
const { loading, medicationDate, selectedMedication } = useTreatments();
const { show } = useToast();
const { t } = useI18n();

const props = defineProps<{
    treatment: TreatmentExtended
    pet: PetExtended
}>();

const isAdding = defineModel<boolean>();

const handleCancel = () => {
    isAdding.value = false;
    medicationDate.value = "";
    selectedMedication.value = null
};

const logDose = async () => {
    if (!medicationDate.value || !selectedMedication.value) return;
    console.log(medicationDate.value)
    loading.value = true;
    const log: Log = {
        type: "medication",
        treatmentId: props.treatment.id,
        medicineId: selectedMedication.value!.id,
        givenAt: tsFromInput(medicationDate.value)
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
</script>

<template>
    <FreeModal v-model="isAdding">
        <form class="flex flex-col gap-1 mini-form" @submit.prevent="logDose">
            <h3 class="font-title">{{ t("health.treatment.editMedTime", {
                medication: selectedMedication!.name, name:
                    pet.name
            })
            }}
            </h3>
            <Input v-model="medicationDate" type="datetime-local" id="medication-log" />
            <Button :disabled="loading">{{ t("common.button.confirm") }}</Button>
            <Button :disabled="loading" type="button" variant="ghost" @click="handleCancel">{{
                t("common.button.cancel")
            }}</Button>
        </form>
    </FreeModal>
</template>