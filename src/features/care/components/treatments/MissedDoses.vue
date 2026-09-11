<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import type { PetExtended } from '../../../pets/types.ts';
import { useTreatments } from '../../composables/useTreatments.ts';
import type { MissedDoseRecord, TreatmentExtended } from '../../types';

const { openModal } = useTreatments();
const { t, locale } = useI18n();

defineProps<{
    pet: PetExtended
    treatment: TreatmentExtended
    missedDoses: MissedDoseRecord[]
}>();

</script>

<template>
    <div class="flex flex-col gap-0.5 text-sm">
        <div class="inline-flex gap-0.5 mb-0.5 text-text-secondary">
            <TriangleAlert :size="20" />
            <h5 class="uppercase tracking-wide">{{ t('health.treatment.missedDoses') }}</h5>
        </div>
        <div v-for="missed in missedDoses" :key="`${treatment.id}-${missed.medication.id}-${missed.date}`"
            class="inline-flex items-center gap-1 w-full p-0.75 rounded-xl bg-error-rgba border-l-3 border-error">
            <span>{{ missed.date.toLocaleDateString(locale) }}</span>
            <span class="flex w-1.5 h-1.5 rounded-full bg-error text-white items-center justify-center">{{
                missed.count
            }}</span>
            <button tabindex="0" @click="openModal('add', treatment, missed.medication, undefined, missed.date)"
                class="rounded-full border border-error-text text-error-text px-1 py-[3px] ml-auto hover:bg-error hover:text-white hover:border-error-border">Log</button>
        </div>
    </div>
</template>