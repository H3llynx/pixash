<script setup lang="ts">
import { History } from '@lucide/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import type { PetExtended } from '../../../pets/types.ts';
import type { MedicationLogExtended, MedicineDb, TreatmentExtended } from '../../types.ts';
import ViewLogs from './modals/ViewLogs.vue';

const { t } = useI18n();

const props = defineProps<{
    pet: PetExtended
    treatment: TreatmentExtended
    medication: MedicineDb
    logs: MedicationLogExtended[]
}>();

const isViewing = ref<boolean>(false);
</script>


<template>
    <Button variant="ghost" size="xxs" @click="isViewing = true">
        <History :size="20" />
        {{ t("health.treatment.viewMedLog") }}
    </Button>
    <ViewLogs v-model="isViewing" :pet="pet" :treatment="treatment" :medication="medication" :logs="logs" />
</template>

<style scoped>
button {
    background: transparent;
    justify-content: start;

    &:not(:hover) {
        color: var(--color-text-secondary);
    }
}
</style>