<script setup lang="ts">
import { CalendarCheck, MapPinned } from '@lucide/vue';
import { computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Loading from '../../../../components/loading/Loading.vue';
import { tsToDate } from '../../../../utils.ts';
import PetIndicator from '../../../pets/components/PetIndicator.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useEvents } from '../../composables/useEvents.ts';
import type { AntiparasiteLogExtended, PetEvent, VaccineExtended, VisitExtended } from '../../types.ts';
import DateTag from './DateTag.vue';
import EventIcon from './EventIcon.vue';
import MarkDoneModal from './MarkDoneModal.vue';

const { logs, vaccines, vetVisits, selectVaccine, selectVisit, selectLog, vets, careLoading } = usePets();
const { t } = useI18n();
const { useEventData, selectedEvent, nextDueModalOpen } = useEvents();

const props = defineProps<{ event: PetEvent }>();
const { pet, vet, title } = useEventData(toRef(props, "event"));

const date = computed(() => props.event.dueOn ?? props.event.date ?? props.event.ts);

const handleClick = (event: PetEvent) => {
    if (event.eventType === "vaccine") {
        const vaccine = vaccines.value.find(v => v.id === event.id) as VaccineExtended;
        selectVaccine(vaccine);
        selectedEvent.value = vaccine;
    } else if (event.eventType === "visit") {
        const visit = vetVisits.value.find(v => v.id === event.id) as VisitExtended;
        selectVisit(visit);
        selectedEvent.value = visit;
    } else if (event.type === "antiparasite") {
        const log = logs.value.find(l => l.id === event.id) as AntiparasiteLogExtended;
        selectLog(log);
        selectedEvent.value = log;
    } else {
        selectedEvent.value = null;
    }
};
</script>
<template>
    <div tabindex="0" role="button" :class="{
        'animate-pulse': careLoading && selectedEvent?.id === event.id,
        'card border border-border bg-bg-rgba default-transition hover:scale-105 hover:bg-bg-2 cursor-pointer flex-row md:max-w-md gap-1.5 justify-between': true
    }" @click="handleClick(event)" @keydown.enter="handleClick(event)">
        <div class="flex gap-0.5 w-full min-w-0 h-full">
            <EventIcon :event="event" />
            <div class="flex-1 min-w-0 flex flex-col">
                <div class="flex gap-0.5 items-start">
                    <h4>{{ title }}</h4>
                    <DateTag :date="date" class="ml-auto"
                        :withMissed="event.eventType === 'vaccine' || event.type === 'antiparasite'" />
                </div>
                <div>
                    <p class="text-text-secondary mb-0.5">
                        {{ tsToDate(event.ts, "date") }}</p>
                    <Button
                        v-if="event.eventType === 'vaccine' || event.eventType === 'log' && event.type === 'antiparasite'"
                        size="xxs" variant="tertiary" @click="nextDueModalOpen = true"
                        @click.stop="nextDueModalOpen = true" @keydown.enter.stop>
                        <CalendarCheck :size="16" />{{ t("health.cta.markDone") }}
                    </Button>
                </div>
                <p v-if="event.vet" class="mt-auto pt-1 text-xs text-text-softer flex items-center gap-[5px]">
                    <Loading v-if="!vets.length" />
                    <MapPinned v-else :size="16" /> {{ vet }}
                </p>
            </div>
        </div>
        <PetIndicator :pet="pet!" />
    </div>
    <MarkDoneModal :event="event" />
</template>

<style scoped>
@media (width >=48rem) {

    h4,
    p {
        font-size: clamp(0.85rem, 0.5vw, 1rem);
    }
}
</style>