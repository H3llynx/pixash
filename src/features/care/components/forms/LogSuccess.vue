<script setup lang="ts">
import { Check } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Button from '../../../../components/Button.vue';
import { ROUTES } from '../../../../router/config.ts';
import type { PetExtended } from '../../../pets/types.ts';
import type { PetEvent } from '../../types.ts';
import { showAntiparasites } from '../../utils.ts';
import DueCard from '../events/DueCard.vue';

const { t } = useI18n();
const route = useRoute();

defineProps<{
    pet: PetExtended
    log: PetEvent
    onClose: () => void
}>();
</script>

<template>
    <div class="default-padding flex flex-col items-center gap-1 text-center">
        <div class="rounded-full w-5 h-5 bg-accent-rgba text-4xl flex shrink-0 justify-center items-center">
            <Check :size="30" />
        </div>
        <h1>{{ t("common.text.done") }}</h1>
        <p v-if="log.treated" class="md:max-w-2/3 mx-auto">
            {{ t("health.antiparasitics.logged", {
                parasites: showAntiparasites(log.treated),
                name: pet.name
            }) }}
        </p>
        <div class="w-full md:max-w-2/3">
            <DueCard v-if="log.dueOn" :title="t('events.nextAntiparasitic')" :event="log" icon />
        </div>
        <Button @click="onClose">{{ route.path === ROUTES.calendar ? t("health.cta.backCal")
            : t("health.cta.backDash") }}</Button>
    </div>
</template>