<script setup lang="ts">
import { Plus } from '@lucide/vue';
import type { ChartData, ChartOptions } from 'chart.js';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { getChartColor } from '../../../../utils.ts';
import { usePetDetails } from '../../../pets/composables/usePetDetails.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import type { PetExtended } from '../../../pets/types.ts';
import { useTheme } from '../../../theme/composables/useTheme.ts';
import type { WeightLogExtended } from '../../types.ts';

const props = defineProps<{
    pet: PetExtended
    logs: WeightLogExtended[];
}>();

const { t, locale } = useI18n();
const { theme } = useTheme();
const { isAddingCare } = usePets();
const { unitFactor, preferredUnit } = usePetDetails(props.pet);

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
);

const sorted = computed(() => {
    if (!props.logs) return [];
    return [...props.logs].sort((a, b) => a.measuredAt.seconds - b.measuredAt.seconds);
});
const displayed = computed(() => sorted.value.slice(-6));
const chartData = computed<ChartData<"line">>(() => {
    const labels = displayed.value.map(log => log.measuredAt.toDate().toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "2-digit"
    }));
    const data = displayed.value.map(log => log.weight * unitFactor);
    theme.value;
    return {
        labels,
        datasets: [
            {
                label: `${t("pet.profile.labels.weight")} ${preferredUnit.value})`,
                data,
                borderColor: getChartColor("--color-accent"),
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: getChartColor("--color-bg"),
                pointRadius: 4,
                pointHoverRadius: 5
            }
        ]
    }
});

const chartOptions = computed<ChartOptions<"line">>(() => {
    theme.value;
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                usePointStyle: true,
                boxPadding: 4,
                boxWidth: 8,
                backgroundColor: getChartColor("--color-bg-2"),
                titleColor: getChartColor("--color-text"),
                bodyColor: getChartColor("--color-text"),
                borderColor: getChartColor("--color-border"),
                borderWidth: 0.5,
                padding: 10,
                callbacks: {
                    labelColor: () => ({
                        borderColor: getChartColor("--color-accent"),
                        backgroundColor: getChartColor("--color-accent"),
                    }),
                },
                titleFont: {
                    family: '"Plus Jakarta Sans", sans-serif',
                    size: 13,
                    weight: 'bold'
                },
                bodyFont: {
                    family: '"Plus Jakarta Sans", sans-serif',
                    size: 12
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: getChartColor("--color-text-secondary") },
                border: { color: getChartColor("--color-border-light") },
            },
            y: {
                title: {
                    display: true,
                    text: chartData.value.datasets[0].label,
                    color: getChartColor("--color-text-secondary"),
                },
                grid: { display: false },
                ticks: { color: getChartColor("--color-text-secondary") },
                border: { color: getChartColor("--color-border-light") },
            }
        }
    }
});
</script>

<template>
    <article class="pet-section">
        <h2>{{ t("dashboard.title.weightTracking") }}</h2>
        <div class="card w-full text-text" v-if="logs.length">
            <div class="flex gap-1 justify-between items-start">
                <Button @click="isAddingCare.weight = true" variant="tertiary" size="xxs">
                    {{ t("health.cta.logWeight") }}
                </Button>
                <div class="ml-auto text-right">
                    <p class="text-2xl font-medium">{{ chartData.datasets[0].data.at(-1) }} {{
                        preferredUnit
                    }}</p>
                    <p v-if="displayed.length" class="text-text-secondary text-xs">{{ t("common.text.lastLogged") }} {{
                        displayed.at(-1)?.measuredAt.toDate().toLocaleDateString(locale, {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }) }}</p>
                </div>
            </div>
            <div class="h-8">
                <Line :data="chartData" :options="chartOptions" />
            </div>
        </div>
        <div v-else class="flex flex-col gap-1">
            <p class="text-text-secondary text-sm">{{ t("common.text.noWeightLog") }}</p>
            <Button variant="add" size="lg" class="md:max-w-xs" @click="isAddingCare.weight = true">
                <Plus /> {{ t("common.button.add") }}
            </Button>
        </div>
    </article>
</template>