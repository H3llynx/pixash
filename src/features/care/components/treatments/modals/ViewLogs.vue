<script setup lang="ts">
import { X } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../../components/Button.vue';
import FreeModal from '../../../../../components/FreeModal.vue';
import { formatDateRange } from '../../../../../utils.ts';
import type { PetExtended } from '../../../../pets/types.ts';
import { useTreatments } from '../../../composables/useTreatments.ts';
import type { LogExtended, MedicineDb, TreatmentExtended } from '../../../types.ts';

const { getMissedDosesHistory } = useTreatments();
const { t } = useI18n();

const props = defineProps<{
    pet: PetExtended
    treatment: TreatmentExtended
    medication: MedicineDb
    logs: LogExtended[]
}>();

const isViewing = defineModel<boolean>();

const missed = computed(() => getMissedDosesHistory(props.pet, props.treatment, props.medication).reduce((sum, m) => sum + m.count, 0));
</script>

<template>
    <FreeModal v-model="isViewing">
        <div class="flex justify-between gap-1 px-1 pt-1 pb-0.5">
            <div>
                <h3>{{ medication.name }}</h3>
                <p class="text-sm text-text-secondary">
                    <span>{{ treatment.name }} · {{ pet.name }}</span>
                </p>
            </div>
            <Button variant="ghost" size="min" @click="isViewing = false" :aria-label="t('common.button.close')">
                <X :size="18" />
            </Button>
        </div>
        <div class="flex gap-2 p-1 border-t border-b border-border">
            <div>
                <p class="text-xl font-bold">{{ logs.length }}</p>
                <p class="text-sm tracking-wide uppercase text-text-secondary">{{
                    t("health.treatment.historyModal.logged") }}</p>
            </div>
            <div>
                <p class="text-xl font-bold">{{ missed }}</p>
                <p class="text-sm tracking-wide uppercase text-text-secondary">{{
                    t("health.treatment.historyModal.missed") }}</p>
            </div>
            <div>
                <p class="text-xl font-bold">{{
                    formatDateRange(treatment.startDate.toDate(),
                        new Date()) }}</p>
                <p class="text-sm tracking-wide uppercase text-text-secondary">{{
                    t("health.treatment.historyModal.window") }}</p>
            </div>
        </div>
        <p class="p-1 border-t border-border text-sm text-text-secondary">{{
            t("health.treatment.historyModal.bottomText") }}</p>
    </FreeModal>
</template>

<style scoped>
dialog {
    max-width: 500px;
}

:deep(.dialog-box) {
    padding: 0;
    background: var(--color-bg);
}
</style>