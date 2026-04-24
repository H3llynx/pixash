<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useMedia } from '../composables/useMedia';
import VetHeaderTitle from '../features/health/components/VetHeaderTitle.vue';
import ThemeSwitcher from '../features/theme/composants/ThemeSwitcher.vue';
import Greetings from '../features/user/components/Greetings.vue';
import UserPicture from '../features/user/components/UserPicture.vue';
import { ROUTES } from '../router/config';
import Logo from './Logo.vue';

const { t } = useI18n();
const { isMd } = useMedia();

const route = useRoute();

</script>

<template>
    <header
        :class="{ 'md:pl-21': route.path !== ROUTES.auth, 'bg-brand-dark md:bg-bg-2 md:border-b md:border-border': route.path === ROUTES.calendar }">
        <Greetings v-if="route.path === ROUTES.dashboard" />
        <VetHeaderTitle v-if="route.path === ROUTES.vet" />
        <h2 v-if="route.path === ROUTES.calendar && isMd" class="text-2xl md:text-3xl my-auto">{{
            t("common.header.calendar")
            }}</h2>
        <Logo v-if="route.path === ROUTES.auth || (route.path === ROUTES.calendar && !isMd)" />
        <div class="flex gap-0.5 relative z-2">
            <ThemeSwitcher />
            <UserPicture />
        </div>
    </header>
</template>