<script setup lang="ts">
import { Check } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import { useMedia } from '../../../composables/useMedia';
import { useTheme } from '../../theme/composables/useTheme';
import CalendarDark from '../assets/calendar-dark.png';
import CalendarLight from '../assets/calendar-light.png';
import CalendarSmDark from '../assets/calendar-sm-dark.png';
import CalendarSmLight from '../assets/calendar-sm-light.png';
import Pixie from '../assets/pix.webp';

const { theme } = useTheme();
const { t } = useI18n();
const { isLg } = useMedia();
</script>


<template>
    <section id="calendarSection" class="md:px-6 py-4 flex flex-col lg:flex-row gap-1.5 items-center">
        <div class="flex flex-col gap-1">
            <div class="flex gap-1 items-center">
                <img :src="Pixie" alt="" class="w-3 h-3 rounded-full shadow-lg">
                <h2>{{ t('landing.calendar.h2') }}</h2>
            </div>
            <h1 class="text-3xl md:text-4xl">{{ t('landing.calendar.h1') }}</h1>
            <p class="text-text-softer">{{ t('landing.calendar.p') }}</p>
            <ul>
                <li class="flex gap-0.25 items-center text-text-softer">
                    <Check color="var(--color-accent)" :size="22" />{{ t('landing.calendar.li1') }}
                </li>
                <li class="flex gap-0.25 items-center text-text-softer">
                    <Check color="var(--color-accent)" :size="22" />{{ t('landing.calendar.li2') }}
                </li>
                <li class="flex gap-0.25 items-center text-text-softer">
                    <Check color="var(--color-accent)" :size="22" />{{ t('landing.calendar.li3') }}
                </li>
            </ul>
        </div>
        <img v-if="isLg" :src="theme === 'light' ? CalendarLight : CalendarDark" :alt="t('landing.calendar.alt')"
            class="w-1/2 rounded-xl border border-border-light">
        <img v-else :src="theme === 'light' ? CalendarSmLight : CalendarSmDark" :alt="t('landing.calendar.alt')"
            class="w-full rounded-xl border border-border" />
    </section>
</template>