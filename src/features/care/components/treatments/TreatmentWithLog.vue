<script setup lang="ts">
import { Ellipsis, NotepadText } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import ProgressBar from '../../../../components/ProgressBar.vue';
import { tsToDate } from '../../../../utils.ts';
import PetTag from '../../../pets/components/PetTag.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import type { PetExtended } from '../../../pets/types.ts';
import { useAllPetsView } from '../../composables/useAllPetsView.ts';
import type { TreatmentExtended } from '../../types.ts';
import { getTreatmentColor, getTreatmentProgress } from '../../utils.ts';
import MedicationDetails from './MedicationDetails.vue';

const { selectTreatment, pets, treatmentLoading, selectedTreatment } = usePets();
const { petViewed } = useAllPetsView();
const { t } = useI18n();

const props = withDefaults(defineProps<{
    treatment: TreatmentExtended;
    colorIndex: number;
    tag?: boolean
}>(), { tag: false });

const progress = computed(() => getTreatmentProgress(props.treatment));
const color = computed(() => getTreatmentColor(props.colorIndex));
const pet = computed(() => pets.value.find(pet => pet.id === props.treatment.petId));
</script>

<template>
    <div :class="{ 'animate-pulse': treatmentLoading && selectedTreatment?.id === treatment.id, 'card card-border': true }"
        v-if="pet">
        <div class="flex gap-1 justify-between">
            <h3>{{ treatment.name }}</h3>
            <PetTag v-if="tag && !petViewed" class="ml-auto"
                :pet="pets.find((pet: PetExtended) => pet.id === treatment.petId)!" :color="false" />
            <Button variant="ghost" size="xs" @click="selectTreatment(treatment)"
                :aria-label="t('health.cta.viewTreatment')">
                <Ellipsis :size="18" />
            </Button>
        </div>
        <div class="text-sm text-text-secondary">
            <div class="flex gap-[5px] mb-0.25 items-center">
                <span>📆</span>
                <span>{{ tsToDate(treatment.startDate, "date") }}</span>
                <span v-if="treatment.endDate"> - {{ tsToDate(treatment.endDate, "date") }}</span>
                <span v-else class="ml-auto tag border border-border bg-border-light text-text-softer">{{
                    t("health.treatment.ongoing")
                }}</span>
            </div>
            <ProgressBar v-if="progress" :progress="progress" :color="color" />
        </div>
        <p v-if="treatment.notes" class="text-sm italic flex gap-0.5 items-center my-0.5">
            <NotepadText />
            {{ treatment.notes }}
        </p>
        <MedicationDetails :pet="pet" :treatment="treatment" :colorIndex="colorIndex" />
    </div>
</template>

<style scoped>
details[open] summary {
    border-bottom: 1px solid var(--color-border-light);

    .chevron {
        transform: rotate(180deg);
    }
}
</style>