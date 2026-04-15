<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import ThemeSwitcher from '../features/theme/composants/ThemeSwitcher.vue';
import Greetings from '../features/user/components/Greetings.vue';
import UserPicture from '../features/user/components/UserPicture.vue';
import Logo from './Logo.vue';

defineProps<{ type: "dashboard" | "calendar" | "auth" }>();
const { t } = useI18n();
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMd = breakpoints.greaterOrEqual("md");

</script>

<template>
    <header
        :class="{ 'flex text-brand justify-between md:pl-18': true, 'bg-brand-dark md:bg-transparent': type === 'calendar' }">
        <Greetings v-if="type === 'dashboard'" />
        <Logo v-if="type !== 'dashboard'" class="md:hidden" />
        <h2 v-if="type === 'calendar' && isMd" class="text-2xl md:text-3xl my-auto">{{ t("calendar.header") }}</h2>
        <div class="flex gap-0.5 relative z-2">
            <ThemeSwitcher />
            <UserPicture />
        </div>
    </header>
</template>