<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue';
import { nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PetExtended } from '../../../pets/types.ts';
import type { MedicineDb, MissedDoseRecord, TreatmentExtended } from '../../types';
import AddMissedLog from './modals/AddMissedLog.vue';

const { t } = useI18n();

defineProps<{
    pet: PetExtended
    treatment: TreatmentExtended
    missedDoses: MissedDoseRecord[]
}>();

const isAdding = ref<boolean>(false);
const selectedMedication = ref<MedicineDb | null>(null);
const missedLogDate = ref<Date | null>(null);

const addMissedLog = async (medication: MedicineDb, date: Date) => {
    selectedMedication.value = medication;
    missedLogDate.value = date;
    await nextTick();
    isAdding.value = true;
};
</script>

<template>
    <div class="p-1 flex flex-col gap-0.5">
        <div class="inline-flex gap-0.5 mb-0.5 font-medium uppercase text-text-secondary">
            <TriangleAlert :size="20" />
            <h4>{{ t('health.treatment.missedDoses') }}</h4>
        </div>
        <div v-for="missed in missedDoses" :key="`${treatment.id}-${missed.medication.id}-${missed.date}`"
            class="inline-flex items-center gap-1 w-full p-0.75 rounded-xl bg-error-rgba border-l-3 border-error">
            <span>{{ missed.date.toLocaleDateString() }}</span>
            <span class="flex w-1.5 h-1.5 rounded-full bg-error text-white items-center justify-center">{{
                missed.count
            }}</span>
            <button @click="addMissedLog(missed.medication, missed.date)"
                class="rounded-full border border-error-text text-error-text px-1 py-[3px] ml-auto hover:bg-error hover:text-white hover:border-error-border">Log</button>
        </div>
    </div>
    <AddMissedLog v-if="selectedMedication && missedLogDate" v-model="isAdding" :treatment="treatment"
        :medication="selectedMedication" :pet="pet" :date="missedLogDate" />
</template>