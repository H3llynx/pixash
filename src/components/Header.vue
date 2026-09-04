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
    <header :class="{ 'md:pl-8': route.path !== ROUTES.auth, 'flex gap-0.5 justify-between default-padding': true }">
        <Logo />
        <div :class="[hasPets ? 'z-2' : 'z-3', 'flex gap-0.5 relative items-start']">
            <ThemeSwitcher />
            <UserPicture />
            <LanguageSwitcher />
        </div>
    </header>
</template>