<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { useTreatmentForm } from '../../composables/useTreatmentForm';
import type { Medicine } from '../../types';
import MedicineBox from './MedicineBox.vue';

const { t } = useI18n();
const { defaultMedData } = useTreatmentForm();

const medicineList = defineModel<Medicine[]>();
</script>

<template>
    <MedicineBox v-if="medicineList?.length" v-for="(_med, index) in medicineList" :key="index" :index="index + 1"
        v-model="medicineList[index]" />
    <Button type="button" variant="add" @click="medicineList?.push(defaultMedData)">{{ t("health.medicine.cta")
    }}</Button>
</template>