<script setup lang="ts">
import { Pill } from '@lucide/vue';
import { computed } from 'vue';
import Button from '../../../components/Button.vue';
import Loading from '../../../components/loading/Loading.vue';
import { usePets } from '../../pets/composables/usePets';
import type { TreatmentExtended } from '../types';
import { getTreatmentProgress } from '../utils';

const { selectTreatment, healthLoading, selectedTreatment } = usePets();

const props = defineProps<{ treatment: TreatmentExtended }>();

const progress = computed(() => getTreatmentProgress(props.treatment));
const isOngoing = computed(() => progress.value === null);
</script>

<template>
    <Button variant="ghost" @click="selectTreatment(treatment)" size="sm" class="w-full md:max-w-md ">
        <div class="rounded-xl w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
            <Loading v-if="healthLoading && (selectedTreatment === treatment)" />
            <Pill v-else />
        </div>
        <div class="text-left w-full">
            <h3>{{ treatment.name }}</h3>
            <p v-if="treatment.notes" class="text-text-secondary">{{ treatment.notes }}</p>
            <div v-if="!isOngoing" class="flex gap-0.5 items-center mt-0.5">
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
                </div>
                <span class="text-text-secondary text-sm">{{ progress }}%</span>
            </div>
            <p v-else class="text-text-secondary">Ongoing treatment</p>
        </div>
    </Button>
</template>

<style scoped>
button {
    gap: 1rem;
    padding-block: 1rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-2);
    justify-content: start;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: var(--color-separator);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--color-brand);
}

@media (width >=48rem) {

    h3,
    p {
        font-size: clamp(0.85rem, 0.5vw, 1rem);
    }
}
</style>