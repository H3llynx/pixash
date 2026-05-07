<script setup lang="ts">
import { BugOff, MapPinned, Stethoscope, Syringe, Weight } from '@lucide/vue';
import { computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import EventCardSkeleton from '../../../../components/loading/EventCardSkeleton.vue';
import Loading from '../../../../components/loading/Loading.vue';
import { usePets } from '../../../pets/composables/usePets';
import { useEvents } from '../../composables/useEvents';
import type { PetEvent } from '../../types';
import { showAntiparasites } from '../../utils';
import TypeTag from './TypeTag.vue';

const { healthLoading, vets } = usePets();
const { locale, t } = useI18n();
const { useEventData } = useEvents();

const props = defineProps<{ event: PetEvent }>();
const { vet, title } = useEventData(toRef(props, "event"));
const date = computed(() => {
    if (props.event.givenAt) return props.event.givenAt;
    else return props.event.ts
});
</script>

<template>
    <EventCardSkeleton v-if="healthLoading" />
    <div v-else
        class="rounded-xl border border-border gap-1.5 justify-between items-start text-left p-1 w-full md:max-w-md bg-bg-3">
        <div class="flex gap-0.5 w-full min-w-0 h-full">
            <Syringe v-if="event.eventType === 'vaccine'" class="card-icon" :size="20" />
            <Stethoscope v-if="event.eventType === 'visit'" class="card-icon" :size="20" />
            <template v-else-if="event.eventType === 'log'">
                <BugOff v-if="event.type === 'antiparasite'" class="card-icon" :size="20" />
                <Weight v-if="event.type === 'weight'" class="card-icon" :size="20" />
            </template>
            <div class="flex flex-col justify-content w-full">
                <div class="flex gap-0.5 flex-1">
                    <div class="w-1/2">
                        <p class="text-text-secondary text-xs">
                            {{ date.toDate().toLocaleDateString(locale, {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            }) }}</p>
                        <h4 class="font-medium text-sm">{{ title }}</h4>
                        <p class="text-text-secondary text-xs" v-if="event.treated">{{ showAntiparasites(event.treated,
                            locale,
                            t) }}</p>
                    </div>
                    <div class="flex flex-col justify-content gap-1 flex-1 items-end">
                        <TypeTag :event="event" class="ml-auto" />
                        <span v-if="event.notes" class="text-text-secondary text-xs italic">{{ event.notes }}</span>
                    </div>
                </div>
                <p v-if="event.vet" class="mt-auto pt-0.5 text-xs text-brand-light flex items-center gap-[5px]">
                    <Loading v-if="!vets.length" class="my-0.5" />
                    <MapPinned v-else :size="16" /> {{ vet }}
                </p>
            </div>
        </div>
    </div>
</template>