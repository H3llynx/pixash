<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute } from 'vue-router';
import { useMedia } from '../composables/useMedia.ts';
import LanguageSwitcher from '../features/language/components/LanguageSwitcher.vue';
import { usePets } from '../features/pets/composables/usePets.ts';
import ThemeSwitcher from '../features/theme/components/ThemeSwitcher.vue';
import UserPicture from '../features/user/components/UserPicture.vue';
import { useAuth } from '../features/user/composables/useAuth.ts';
import { ROUTES } from '../router/config.ts';
import Logo from './Logo.vue';

const { user } = useAuth();
const { hasPets } = usePets();
const { isMd } = useMedia();
const { t } = useI18n();
const route = useRoute();

const isAfterOpenAppBtn = ref(false);

let openAppObserver: IntersectionObserver | undefined;

onMounted(() => {
    const openAppBtn = document.getElementById('openAppBtn');
    if (!openAppBtn) return;

    openAppObserver = new IntersectionObserver(([entry]) => {
        isAfterOpenAppBtn.value = !entry.isIntersecting;
    });
    openAppObserver.observe(openAppBtn);
});

onUnmounted(() => {
    openAppObserver?.disconnect();
});
</script>

<template>
    <header
        :class="{ 'md:pl-8': route.path !== ROUTES.auth && route.path !== ROUTES.landing, 'flex gap-1 justify-between default-padding items-start': true }">
        <Logo />
        <div :class="[hasPets ? 'z-2' : 'z-3', 'flex relative items-center justify-end flex-wrap']">
            <template v-if="!user && isMd">
                <RouterLink v-if="route.path === ROUTES.landing" :to="ROUTES.auth"
                    :class="[isAfterOpenAppBtn ? 'text-bg' : 'text-text-secondary', isAfterOpenAppBtn && 'bg-accent hover:bg-interactive', 'mx-1.5 w-max rounded px-2 py-[10px] rounded-xl']">
                    {{ t("common.header.login")
                    }}
                </RouterLink>
                <RouterLink v-if="route.path === ROUTES.auth" :to="ROUTES.landing"
                    class="text-text-secondary mx-1.5 w-max">
                    {{ t("common.text.about") }}
                </RouterLink>
            </template>
            <div class="flex gap-0.5">
                <UserPicture v-if="user" />
                <ThemeSwitcher />
                <LanguageSwitcher />
            </div>
        </div>
    </header>
</template>