<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import Button from '../../../components/Button.vue';
import { useMedia } from '../../../composables/useMedia';
import { ROUTES } from '../../../router/config';
import { useTheme } from '../../theme/composables/useTheme';
import DarkScreen from '../assets/dashboard-dark.png';
import LightScreen from '../assets/dashboard-light.png';
import Pixie from '../assets/pix.webp';
import Sasha from '../assets/sasha.webp';

const { t } = useI18n();
const { theme } = useTheme();
const { isLg } = useMedia();

const scrollToCalendar = () => {
    document.querySelector('#calendarSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>

<template>
    <section :class="{ 'bg-bg-2': theme === 'light', 'py-2 lg:py-4': true }">
        <div class="text-center lg:text-left flex flex-col lg:flex-row gap-1.5 w-full py-2">
            <div class="lg:w-3/5 flex flex-col gap-1.5">
                <h2>{{ t("landing.hero.h2")
                }}
                </h2>
                <h1 class="text-4xl md:text-6xl">{{ t("landing.hero.h1") }}</h1>
                <p class="text-text-softer">{{ t("landing.hero.p") }}</p>
                <div class="flex gap-1 pt-0.5 pb-1.5 m-auto lg:m-0">
                    <RouterLink :to="ROUTES.auth"
                        class="px-2 py-[10px] font-medium rounded-xl bg-accent text-bg hover:bg-interactive">
                        {{ t("landing.hero.cta.openApp") }}
                    </RouterLink>
                    <Button @click="scrollToCalendar" size=md variant="tertiary" class="rounded-xl">
                        {{ t("landing.hero.cta.learnMore") }}
                    </Button>
                </div>
            </div>
            <div
                class="text-left md:w-3/5 lg:w-2/5 px-1 md:px-2 lg:px-0 pt-6 pb-2 lg:pt-0 m-auto shrink-0 flex items-start relative">
                <div class="relative flex-1 -mt-4">
                    <img :src="Sasha" :alt="t('landing.hero.alt.sasha')"
                        class="-rotate-6 rounded-xl shadow-xl border border-6 border-border" />
                    <span
                        :class="[theme === 'light' ? 'bg-bg' : 'bg-bg-2', 'absolute max-w-[50vw] bottom-[80%] left-2/3 w-max py-0.5 px-1 rounded-t-2xl rounded-r-2xl border-2 border-accent']">
                        {{ t("landing.hero.bubbles.sasha") }}</span>
                </div>
                <div class="relative flex-1 self-bottom">
                    <img :src="Pixie" :alt="t('landing.hero.alt.pixie')"
                        class="ml-auto rotate-6 rounded-xl shadow-xl border border-6 border-border" />
                    <span
                        :class="[theme === 'light' ? 'bg-bg' : 'bg-bg-2', 'absolute top-[80%] max-w-[70vw] lg:w-16 xl:w-max right-1/3 lg:right-2/3 w-max py-0.5 px-1 rounded-b-2xl rounded-l-2xl border-2 border-interactive']">
                        {{ t("landing.hero.bubbles.pixie") }}</span>
                </div>
            </div>
        </div>
        <div v-if="isLg" class="max-w-4xl m-auto p-1 md:p-2 bg-color-gradient rounded-3xl shadow-xl">
            <img :src="theme === 'dark' ? LightScreen : DarkScreen" :alt="t('landing.hero.alt.dashboard')"
                class="w-full rounded-xl" />
        </div>
    </section>
</template>