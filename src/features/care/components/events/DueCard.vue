<script setup lang="ts">
import { CalendarCheck2 } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { tsToDate } from '../../../../utils.ts';
import PetIcon from '../../../pets/components/PetIcon.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useEvents } from '../../composables/useEvents.ts';
import type { PetEvent } from '../../types.ts';
import DateTag from './DateTag.vue';
import MarkDoneModal from './MarkDoneModal.vue';

const { pets } = usePets();
const { nextDueModalOpen } = useEvents();
const { t } = useI18n();

const props = defineProps<{
    title: string;
    event: PetEvent;
    cta?: boolean;
    icon?: boolean;
}>();

const timestamp = computed(() => props.event.dueOn ?? props.event.date ?? props.event.ts);
const date = computed(() => props.event.dueOn ? tsToDate(props.event.dueOn, "date") : tsToDate(props.event.date, "date"));
const pet = computed(() => pets.value.find(pet => pet.id = props.event.petId));
</script>

<template>
    <div class="card border border-border flex-col justify-between min-w-1/2 shrink-0 md:min-w-1/3 lg:min-w-9">
        <div class="text-left flex flex-col h-full">
            <h3>{{ title }}</h3>
            <p class="font-medium mb-1">{{ date }}</p>
            <div class="flex gap-1 justify-between items-center mt-auto">
                <DateTag :date="timestamp" withMissed />
                <Button
                    v-if="cta && (event.eventType === 'vaccine' || event.eventType === 'log' && event.type === 'antiparasite')"
                    size="rounded" variant="secondary" @click="nextDueModalOpen = true"
                    @click.stop="nextDueModalOpen = true" @keydown.enter.stop :aria-label="t('health.cta.markDone')">
                    <CalendarCheck2 :size="16" />
                </Button>
                <div v-if="icon" class="rounded-full w-3 h-3 text-3xl flex shrink-0 justify-center items-center">
                    <PetIcon :pet="pet!" />
                </div>
            </div>
        </div>
    </div>
    <MarkDoneModal :event="event" />
</template>

<style scoped>
h3 {
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 5px;
    letter-spacing: 1px;
    font-size: clamp(0.75rem, 0.5vw, 1rem);
}
</style>