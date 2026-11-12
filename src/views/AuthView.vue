<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SashaPixie from '../assets/sasha-pixie.png';
import Header from '../components/Header.vue';
import { useMedia } from '../composables/useMedia.ts';
import AuthForm from '../features/user/components/AuthForm.vue';
import { ROUTES } from '../router/config.ts';

const { isMd } = useMedia();
const { t } = useI18n();
</script>

<template>
    <Header />
    <section class="m-auto max-w-full pb-6 h-full">
        <AuthForm />
    </section>
    <img :src="SashaPixie" alt="" class="fixed -bottom-5 xl:-bottom-3 my-auto w-full -z-1 h-[60%] object-cover" />
    <RouterLink v-if="!isMd" :to="ROUTES.landing"
        class="sticky bottom-0 text-sm bg-accent-softer text-grey-dark w-full text-center p-0.5">
        {{ t("common.text.about") }} 🐾
    </RouterLink>
</template>

<style scoped>
img {
    filter: drop-shadow(0px 16px 60px var(--color-green));
}
</style>