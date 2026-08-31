<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useMedia } from '../../composables/useMedia';
import LanguageSwitcher from '../../features/language/components/LanguageSwitcher.vue';
import PetSelector from '../../features/pets/components/PetSelector.vue';
import { usePets } from '../../features/pets/composables/usePets';
import ThemeSwitcher from '../../features/theme/components/ThemeSwitcher.vue';
import UserPicture from '../../features/user/components/UserPicture.vue';
import { ROUTES } from '../../router/config';
import Logo from '../Logo.vue';
import HistoryHeaderTitle from './HistoryHeaderTitle.vue';
import VetHeaderTitle from './VetHeaderTitle.vue';

const { t } = useI18n();
const { isMd } = useMedia();
const { hasPets } = usePets();
const route = useRoute();
</script>

<template>
    <header>
        <div class="flex gap-0.5 justify-between default-padding">
            <Logo class="flex mb-1" />
            <VetHeaderTitle v-if="route.path === ROUTES.vet" />
            <HistoryHeaderTitle v-if="route.path === ROUTES.history" />
            <h2 v-if="route.path === ROUTES.calendar && isMd" class="text-2xl md:text-3xl my-auto">{{
                t("common.header.calendar")
                }}</h2>
            <div :class="[hasPets ? 'z-2' : 'z-3', 'flex gap-0.5 relative items-start']">
                <ThemeSwitcher />
                <UserPicture />
                <LanguageSwitcher />
            </div>
        </div>
        <PetSelector v-if="route.path !== ROUTES.calendar" />
    </header>
</template>