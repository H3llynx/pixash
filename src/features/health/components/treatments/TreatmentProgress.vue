<script setup lang="ts">
import { Pill } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Loading from '../../../../components/loading/Loading.vue';
import { tsToDate } from '../../../../utils';
import { usePets } from '../../../pets/composables/usePets';
import type { TreatmentExtended } from '../../types';
import { getTreatmentProgress } from '../../utils';
import ProgressBar from './ProgressBar.vue';

const { selectTreatment, healthLoading, selectedTreatment } = usePets();
const { t } = useI18n();

const props = defineProps<{ treatment: TreatmentExtended; color: string }>();

const progress = computed(() => getTreatmentProgress(props.treatment));
</script>

<template>
    <Button tabindex="0" role="button" variant="ghost" @click="selectTreatment(treatment)" size="sm"
        class="w-full md:max-w-md cursor-pointer">
        <div class="rounded-xl w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
            <Loading v-if="healthLoading && (selectedTreatment === treatment)" />
            <Pill v-else />
        </div>
        <div class="text-left w-full">
            <h3>{{ treatment.name }}</h3>
            <p v-if="treatment.notes" class="text-text-secondary">{{ treatment.notes }}</p>
            <div class="text-sm text-text-secondary mt-0.5">
                <div class="text-xs">
                    <span v-if="!treatment.endDate">{{ t("common.text.started") }}</span>
                    <span>{{ tsToDate(treatment.startDate, "date") }}</span>
                    <span v-if="treatment.endDate"> - {{ tsToDate(treatment.endDate, "date") }}</span>
                </div>
                <ProgressBar v-if="progress" :progress="progress" :color="color" />
            </div>
        </div>
        <span v-if="!treatment.endDate" class="tag bg-separator text-text-secondary">{{ t("health.treatment.ongoing")
        }}</span>
    </Button>
</template>

<style scoped>
button {
    gap: 1rem;
    padding-block: 1rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-2);
    justify-content: start;
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        inset: 0;
        background-image: var(--background-image-card);
        background-size: 150% 100%;
        opacity: 0;
        z-index: -1;
        transition: 1s ease;
    }
}

@media (width >=48rem) {

    h3,
    p {
        font-size: clamp(0.85rem, 0.5vw, 1rem);
    }
}

@media (hover: hover) and (pointer: fine) {
    button:hover {
        transform: scale(1.02);

        &::before {
            animation: move-overlay 10s ease-out infinite;
            opacity: 1;
        }
    }
}
</style>