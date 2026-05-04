<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { useI18n } from 'vue-i18n';
import type { PetExtended } from '../../../pets/types';
import { getChartColor, prefersKg } from '../../../pets/utils';
import { useTheme } from '../../../theme/composables/useTheme';
import type { WeightLogExtended } from '../../types';

const { t, locale } = useI18n();
const { theme } = useTheme();

const props = defineProps<{
    pet: PetExtended
    logs: WeightLogExtended[];
}>();

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const unit = computed(() => prefersKg(props.pet) ? "kg" : "g");
const sorted = computed(() => {
    if (!props.logs) return [];
    return [...props.logs].sort((a, b) => a.measuredAt.seconds - b.measuredAt.seconds);
});

const chartData = computed<ChartData<"bar">>(() => {
    const labels = sorted.value.map(log => log.measuredAt.toDate().toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "2-digit"
    }));
    const unitFactor = prefersKg(props.pet) ? 1 / 1000 : 1;
    const data = sorted.value.map(log => log.weight * unitFactor);
    theme.value;
    return {
        labels,
        datasets: [
            {
                label: `${t("pet.profile.labels.weight")} ${unit.value})`,
                data,
                borderColor: getChartColor("--color-brand-light"),
                borderRadius: { topLeft: 12, topRight: 12 },
                backgroundColor: getChartColor("--color-brand-rgba"),
                borderWidth: 1
            }
        ]
    }
});

const chartOptions = computed<ChartOptions<"bar">>(() => {
    theme.value;
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: getChartColor("--color-bg-3"),
                titleColor: getChartColor("--color-text"),
                bodyColor: getChartColor("--color-text"),
                borderColor: getChartColor("--color-border"),
                borderWidth: 0.5,
                padding: 10,
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
                border: { color: getChartColor("--color-separator") },
            },
            y: {
                title: {
                    display: true,
                    text: chartData.value.datasets[0].label,
                    color: getChartColor("--color-text-secondary"),
                },
                grid: { display: false },
                ticks: { color: getChartColor("--color-text-secondary") },
                border: { color: getChartColor("--color-separator") },
            }
        }
    }
});
</script>

<template>
    <section class="pet-section mb-4 md:mb-1 md:px-0">
        <h2>{{ t("dashboard.title.weightTracking") }}</h2>
        <div class="profile-card w-full text-text" v-if="logs.length">
            <div class="ml-auto text-right">
                <p class="text-2xl font-medium text-btn-ghost-text">{{ chartData.datasets[0].data.at(-1) }} {{ unit
                    }}</p>
                <p v-if="sorted.length" class="text-text-secondary text-xs">{{ t("common.text.lastLogged") }} {{
                    sorted.at(-1)?.measuredAt.toDate().toLocaleDateString(locale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }) }}</p>
            </div>
            <div class="h-12">
                <Bar :data="chartData" :options="chartOptions" />
            </div>
        </div>
        <p v-else class="text-text-secondary text-sm">{{ t("common.text.noWeightLog") }}</p>
    </section>
</template>