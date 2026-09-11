<script setup lang="ts">
import { Pen, X } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../../components/Button.vue';
import FreeModal from '../../../../../components/FreeModal.vue';
import { formatDateRange, tsToDate } from '../../../../../utils.ts';
import type { PetExtended } from '../../../../pets/types.ts';
import { useTreatments } from '../../../composables/useTreatments.ts';
import type { MedicationLogExtended, MedicineDb, TreatmentExtended } from '../../../types.ts';

const { getMissedDosesHistory, deleteDose, savingLogIds, openModal } = useTreatments();
const { t, locale } = useI18n();

const props = defineProps<{
    pet: PetExtended
    treatment: TreatmentExtended
    medication: MedicineDb
    logs: MedicationLogExtended[]
}>();

const isViewing = defineModel<boolean>();

const missed = computed(() => getMissedDosesHistory(props.pet, props.treatment, props.medication).reduce((sum, m) => sum + m.count, 0));
</script>

<template>
    <FreeModal v-model="isViewing" class="list-modal">
        <div class="scroll-container">
            <div class="flex justify-between gap-1 px-1.5 py-1">
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
            <div class="flex gap-2 px-1.5 py-1 border-t border-b border-border flex-wrap">
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
            <div :class="{ 'flex justify-between items-center px-1.5 py-1 text-sm border-b border-border': true, 'opacity-40 animate-pulse': savingLogIds.has(log.id) }"
                v-for="log in logs" :key="log.id">
                <div>
                    <h4>{{ tsToDate(log.givenAt, "date") }}</h4>
                    <p class="text-sm tracking-wide uppercase text-text-secondary">
                        {{ log.givenAt.toDate().toLocaleString(locale, {
                            hour: '2-digit',
                            minute: '2-digit'
                        }) }}
                    </p>
                </div>
                <span class="py-[5px] px-0.5 rounded-lg bg-orange-rgba text-orange font-medium uppercase text-xs"
                    v-if="log.givenAt < treatment.startDate">{{
                        t("health.treatment.historyModal.beforeStart") }}</span>
                <span class="py-[5px] px-0.5 rounded-lg bg-error-rgba text-error font-medium uppercase text-xs"
                    v-if="medication.endDate && log.givenAt > medication.endDate">{{
                        t("health.treatment.historyModal.afterEnd") }}</span>
                <div class="flex gap-0.5">
                    <Button :disabled="savingLogIds.has(log.id)" variant="ghost" size="min"
                        :aria-label="t('health.cta.editMedTime')"
                        @click="openModal('edit', treatment, medication, log)">
                        <Pen :size="13" />
                    </Button>
                    <Button :disabled="savingLogIds.has(log.id)" variant="ghost" size="min"
                        :aria-label="t('common.button.delete')" @click="deleteDose(log)">
                        <X :size="13" />
                    </Button>
                </div>
            </div>
            <p class="px-1.5 py-1 text-sm text-text-secondary">{{
                t("health.treatment.historyModal.bottomText") }}</p>
        </div>
    </FreeModal>
</template>

<style scoped>
.list-modal {
    max-width: 500px;
    overflow: hidden;
}

.list-modal :deep(.dialog-box) {
    padding: 0;
    background: var(--color-bg);
    gap: 0;
    color: var(--color-text-softer);
}

.scroll-container {
    max-height: 90dvh;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--color-border);
    }
}
</style>