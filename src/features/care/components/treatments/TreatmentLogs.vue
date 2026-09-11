<script setup lang="ts">
import { Pen, X } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import type { PetExtended } from '../../../pets/types.ts';
import { useTreatments } from '../../composables/useTreatments.ts';
import type { MedicineDb, TreatmentExtended } from '../../types.ts';
import { getDailyDose, getTreatmentBackground, getTreatmentColor } from '../../utils.ts';

const props = defineProps<{
    pet: PetExtended
    medication: MedicineDb
    treatment: TreatmentExtended
    colorIndex: number
}>();

const { openModal, getTodayLoggedList, getDailyDosesToLog, getDailyMissedDoses, deleteDose, savingLogIds, savingNewLog, logDose } = useTreatments();
const { t, locale } = useI18n();

const getSortedLoggedList = (pet: PetExtended, treatment: TreatmentExtended, medication: MedicineDb) =>
    [...getTodayLoggedList(pet, treatment, medication)].sort((a, b) => a.givenAt.toMillis() - b.givenAt.toMillis());
</script>

<template>
    <div class="flex gap-0.5 mt-0.5 flex-wrap" :style="{ '--custom-color': getTreatmentColor(colorIndex), }">
        <div v-for="log in getSortedLoggedList(props.pet, props.treatment, medication)" :key="log.id"
            :class="{ 'log p-0.5 rounded-xl flex gap-1 justify-between items-center': true, 'opacity-40 animate-pulse': savingLogIds.has(log.id) }"
            :style="{
                color: getTreatmentColor(colorIndex), backgroundColor: getTreatmentBackground(colorIndex)
            }">
            <p>
                {{ log.givenAt.toDate().toLocaleString(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: '2-digit',
                    minute: '2-digit'
                }) }}</p>
            <div class="flex gap-[3px] flex-col">
                <Button :disabled="savingLogIds.has(log.id)" variant="ghost" size="min"
                    :aria-label="t('health.cta.editMedTime')" @click="openModal('edit', treatment, medication, log)">
                    <Pen :size="13" />
                </Button>
                <Button :disabled="savingLogIds.has(log.id)" variant="ghost" size="min"
                    :aria-label="t('common.button.delete')" @click="deleteDose(log)">
                    <X :size="13" />
                </Button>
            </div>
        </div>
        <Button :disabled="savingNewLog" v-for="number in getDailyDosesToLog(props.pet, props.treatment, medication)"
            :key="number" variant="card" size="xs" @click="logDose(treatment, medication)"
            :class="{ 'dose': true, 'missed': getDailyMissedDoses(pet, treatment, medication) && number === 1 }">
            {{ t("health.cta.logDose") }} {{ getDailyDose(medication.frequency) !== undefined ? number +
                getTodayLoggedList(props.pet, props.treatment, medication).length
                : "" }}
        </Button>
    </div>
</template>

<style scoped>
.dose,
.log {
    flex: 1;
    min-width: 48%;
    min-height: 3rem;
    font-size: small;
}

.log {
    border: 1px solid var(--custom-color);
}

button.missed:not(:disabled) {
    background: var(--color-error);
    color: white;
}

@media (width >=48rem) {

    .dose,
    .log {
        min-width: 32%;
    }
}

@media (hover: hover) and (pointer: fine) {
    .dose:not(:disabled):hover {
        background-color: var(--custom-color);
        color: var(--color-white);
    }
}
</style>