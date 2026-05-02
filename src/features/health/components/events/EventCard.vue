<script setup lang="ts">
import { MapPinned, Stethoscope, Syringe } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import EventCardSkeleton from '../../../../components/loading/EventCardSkeleton.vue';
import Loading from '../../../../components/loading/Loading.vue';
import { tsToDate } from '../../../../utils';
import PetIndicator from '../../../pets/components/PetIndicator.vue';
import { usePets } from '../../../pets/composables/usePets';
import type { PetEvent, VaccineExtended, VisitExtended } from '../../types';
import { showTypes } from '../../utils';
import DateTag from './DateTag.vue';

const { pets, vaccines, vetVisits, selectVaccine, selectVisit, vets, healthLoading } = usePets();
const { locale } = useI18n();

const props = defineProps<{ event: PetEvent }>();
const pet = computed(() => pets.value.find(p => p.id === props.event.petId));
const title = computed(() => props.event.eventType === "vaccine"
    ? showTypes(props.event.types!, pet.value!)
    : props.event.title
);

const vet = computed(() => {
    if (!vets.value?.length) return null;
    return vets.value?.find(vet => vet.id === props.event.vet)?.name ?? props.event.vet
});

const handleClick = (event: PetEvent) => {
    if (event.eventType === "vaccine") {
        const vaccine = vaccines.value.find(v => v.id === event.id) as VaccineExtended;
        selectVaccine(vaccine);
    } else {
        const visit = vetVisits.value.find(v => v.id === event.id) as VisitExtended;
        selectVisit(visit);
    }
}

</script>
<template>
    <EventCardSkeleton v-if="healthLoading" />
    <Button v-else variant="card" size="card" @click="handleClick(event)"
        :class="{ 'opacity-50': tsToDate(event.ts, 'isPast') }">
        <div class="flex gap-0.5 w-full min-w-0 h-full">
            <Syringe v-if="event.eventType === 'vaccine'" class="shrink-0 text-brand-light" :size="20" />
            <Stethoscope v-else class="shrink-0 text-brand-light" :size="20" />
            <div class="flex-1 min-w-0 flex flex-col">
                <div class="flex gap-0.5 items-start">
                    <h4>{{ title }}</h4>
                    <DateTag :event="event" class="ml-auto" />
                </div>
                <p class="text-text-secondary mb-0.75">
                    {{ event.ts.toDate().toLocaleDateString(locale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }) }}</p>
                <p v-if="event.vet" class="mt-auto text-xs text-brand-light flex items-center gap-[5px]">
                    <Loading v-if="!vets.length" />
                    <MapPinned v-else :size="16" /> {{ vet }}
                </p>
            </div>
        </div>
        <PetIndicator :pet="pet!" />
    </Button>
</template>

<style scoped>
@media (width >=48rem) {

    h4,
    p {
        font-size: clamp(0.85rem, 0.5vw, 1rem);
    }
}
</style>