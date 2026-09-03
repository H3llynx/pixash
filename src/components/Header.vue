<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import LanguageSwitcher from '../features/language/components/LanguageSwitcher.vue';
import { usePets } from '../features/pets/composables/usePets.ts';
import ThemeSwitcher from '../features/theme/components/ThemeSwitcher.vue';
import UserPicture from '../features/user/components/UserPicture.vue';
import { ROUTES } from '../router/config.ts';
import Logo from './Logo.vue';

const { t } = useI18n();
const { hasPets } = usePets();
const route = useRoute();
</script>

<template>
    <header :class="{ 'md:pl-5': route.path !== ROUTES.auth }" class="flex flex-col gap-1.5">
        <div class="flex gap-0.5 justify-between default-padding">
            <Logo class="flex mb-1" />
            <div :class="[hasPets ? 'z-2' : 'z-3', 'flex gap-0.5 relative items-start']">
                <ThemeSwitcher />
                <UserPicture />
                <LanguageSwitcher />
            </div>
        </div>
        <div v-if="route.path === ROUTES.history" class="default-padding">
            <h2 class="text-2xl md:text-3xl">{{ t("common.header.historyH2") }}</h2>
            <span class="tracking-wide font-extralight">{{ t("common.header.historySpan") }}</span>
        </div>
    </header>
</template>