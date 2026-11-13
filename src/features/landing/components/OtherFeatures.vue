<script setup lang="ts">
import { CircleDot, History, PawPrint, Scale, ShieldCheck, Stethoscope } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from '../../theme/composables/useTheme';
import Pixie from '../assets/pixie.webp';

const { theme } = useTheme();
const { t } = useI18n();

const otherFeatures = [
    { name: "lump", hasCaption: false, icon: CircleDot },
    { name: "weight", hasCaption: true, icon: Scale },
    { name: "insuranceChip", hasCaption: false, icon: ShieldCheck },
    { name: "vets", hasCaption: false, icon: Stethoscope },
    { name: "history", hasCaption: false, icon: History },
    { name: "multiPet", hasCaption: false, icon: PawPrint }
] as const;
</script>

<template>
    <section :class="{ 'md:px-6 pt-2 md:pt-3 pb-4': true, 'bg-bg-2': theme === 'light' }">
        <h1 class="text-3xl md:text-4xl text-center mb-2 md:px-2">{{ t('landing.features.h1') }}</h1>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
            <li v-for="feature in otherFeatures" :key="feature.name"
                :class="{ 'relative bg-bg rounded-xl p-2 border border-border shadow-lg': true, 'bg-bg-2': theme === 'dark' }">
                <component :is="feature.icon" class="p-0.5 bg-accent-rgba rounded-xl w-3 h-3 mb-1 text-accent-softer" />
                <h3>{{ t(`landing.features.${feature.name}.title`) }}</h3>
                <p class="mt-0.5 text-text-softer">{{ t(`landing.features.${feature.name}.description`) }}</p>
                <p v-if="feature.hasCaption" class="mt-1 text-sm text-text-softer">
                    {{ t(`landing.features.${feature.name}.caption`) }}
                </p>
                <img v-if="feature.name === 'weight'" :src="Pixie" class="w-7.5 absolute -bottom-0.75 -right-1" />
            </li>
        </ul>
    </section>
</template>