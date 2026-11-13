<script setup lang="ts">
import { Check } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from '../../theme/composables/useTheme';
import Sasha from '../assets/sasha.webp';
import TreatmentDark from '../assets/treatment-dark.png';
import TreatmentLight from '../assets/treatment-light.png';

const { theme } = useTheme();
const { t } = useI18n();
</script>

<template>
    <section id="calendarSection"
        class="md:px-6 pt-2 pb-4 flex flex-col md:flex-row-reverse gap-2 md:gap-1.5 items-center">
        <div class="flex flex-col gap-1">
            <div class="flex gap-1 items-center">
                <img :src="Sasha" alt="" class="w-3 h-3 rounded-full shadow-lg">
                <h2>{{ t('landing.treatments.h2') }}</h2>
            </div>
            <h1 class="text-3xl md:text-4xl">{{ t('landing.treatments.h1') }}</h1>
            <p class="text-text-softer">{{ t('landing.treatments.p') }}</p>
            <ul>
                <li class="flex gap-0.25 items-center text-text-softer">
                    <Check color="var(--color-accent)" :size="22" />{{ t('landing.treatments.li1') }}
                </li>
                <li class="flex gap-0.25 items-center text-text-softer">
                    <Check color="var(--color-accent)" :size="22" />{{ t('landing.treatments.li2') }}
                </li>
                <li class="flex gap-0.25 items-center text-text-softer">
                    <Check color="var(--color-accent)" :size="22" />{{ t('landing.treatments.li3') }}
                </li>
            </ul>
        </div>
        <img :src="theme === 'light' ? TreatmentLight : TreatmentDark" alt=""
            class="w-md md:w-2/5 rounded-xl border-15 border-accent-rgba">
    </section>
</template>