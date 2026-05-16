<script setup lang="ts">
import { MinusCircle } from '@lucide/vue';
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
    <div v-if="medicineList?.length" v-for="(_med, index) in medicineList" :key="index" class="relative">
        <MedicineBox :index="index + 1" v-model="medicineList[index]" />
        <Button v-if="medicineList?.length > 1" variant="ghost" size="xs"
            @click="medicineList = medicineList.filter((_m, i) => i !== index)"
            class="absolute top-px right-px bg-transparent" :aria-label="t('health.medicine.delete')">
            <MinusCircle />
        </Button>
    </div>
    <Button type="button" variant="add" @click="medicineList?.push(defaultMedData)">{{ t("health.medicine.cta")
        }}</Button>
</template>