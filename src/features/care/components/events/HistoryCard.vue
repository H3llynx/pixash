<script setup lang="ts">
import { Check, Ellipsis, MapPinned, Weight } from '@lucide/vue';
import { computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Loading from '../../../../components/loading/Loading.vue';
import { tsToDate } from '../../../../utils.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import { prefersKg } from '../../../pets/utils.ts';
import { useEvents } from '../../composables/useEvents.ts';
import type { PetEvent } from '../../types.ts';
import { showAntiparasites } from '../../utils.ts';
import EventIcon from './EventIcon.vue';
import TypeTag from './TypeTag.vue';

const { careLoading, vets, pets } = usePets();
const { t } = useI18n();
const { useEventData, selectedEvent, handleEventClick } = useEvents();

const props = defineProps<{ event: PetEvent }>();

const { vet, title } = useEventData(toRef(props, "event"));
const date = computed(() => {
    if (props.event.givenAt) return props.event.givenAt;
    else return props.event.ts
});
const weight = computed(() => {
    const pet = pets.value.find(pet => pet.id === props.event.petId);
    if (!pet || !props.event.weight) return null
    else {
        const unit = prefersKg(pet) ? "kg" : "g";
        const unitFactor = prefersKg(pet) ? 1 / 1000 : 1;
        return `${Math.round(props.event.weight * unitFactor * 100) / 100} ${unit}`
    };
});
</script>

<template>
    <div :class="{
        'animate-pulse': careLoading && selectedEvent?.id === event.id,
        'rounded-xl border border-border gap-0.5 flex justify-between items-start text-left p-0.25 w-full bg-bg-2': true
    }">
        <div class="flex gap-0.5 w-full min-w-0 h-full px-0.5 py-1">
            <EventIcon :event="event" />
            <div class="flex flex-col justify-content w-full">
                <div class="flex gap-0.5 flex-1">
                    <div class="w-1/2 flex flex-col">
                        <p class="text-text-secondary text-xs">
                            {{ tsToDate(date, "date") }}</p>
                        <h4 class="text-sm mt-0.25">{{ title }}</h4>
                        <ul class="text-text-secondary text-xs mt-0.5 flex flex-wrap gap-x-0.5" v-if="event.treated">
                            <li v-for="treated in showAntiparasites(event.treated, true)" :key="treated"
                                class="inline-flex shrink-0 gap-0.25">
                                <Check :size="14" />{{ treated }}
                            </li>
                        </ul>
                    </div>
                    <div class="flex flex-col justify-content gap-1 flex-1 items-end">
                        <TypeTag :event="event" class="ml-auto" />
                        <span v-if="event.notes" class="text-text-secondary text-xs italic">{{ event.notes }}</span>
                        <div v-if="event.weight" class="flex gap-0.5 items-center">
                            <Weight :size="20" />
                            <span class="text-xl">{{ weight }}</span>
                        </div>
                    </div>
                </div>
                <p v-if="event.vet" class="mt-auto pt-0.5 text-xs text-text-softer flex items-center gap-[5px]">
                    <Loading v-if="!vets.length" class="my-0.5" />
                    <MapPinned v-else :size="16" /> {{ vet }}
                </p>
            </div>
        </div>
        <Button variant="ghost" size="min" :aria-label="t('common.button.edit')" @click="handleEventClick(event)">
            <Ellipsis :size="18" />
        </Button>
    </div>
</template>