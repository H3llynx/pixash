<script setup lang="ts">
import { Check } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Button from '../../../components/Button.vue';
import { ROUTES } from '../../../router/config';
import type { PetExtended } from '../../pets/types';
import type { PetEvent } from '../types';
import { showAntiparasites } from '../utils';
import HealthCard from './events/HealthCard.vue';

const { t, locale } = useI18n();
const route = useRoute();

defineProps<{
    pet: PetExtended
    log: PetEvent
    onClose: () => void
}>();
</script>

<template>
    <div class="default-padding flex flex-col items-center gap-1 text-center">
        <div class="rounded-full w-5 h-5 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
            <Check :size="30" />
        </div>
        <h1>{{ t("common.text.done") }}</h1>
        <p v-if="log.treated" class="w-2/3 mx-auto">
            {{ t("common.text.antiparasiticLogged", {
                parasites: showAntiparasites(log.treated, locale, t),
                name: pet.name
            }) }}
        </p>
        <HealthCard v-if="log.dueOn" :title="t('events.nextAntiparasitic')" :pet="pet" :data="log" />
        <Button @click="onClose">{{ route.path === ROUTES.calendar ? t("common.button.backCal") :
            t("common.button.backDash") }}</Button>
    </div>
</template>