<script setup lang="ts">
import { BriefcaseMedical, MapPinned, Syringe } from '@lucide/vue';
import { computed } from 'vue';
import Button from '../../../components/Button.vue';
import { tsToDate } from '../../../utils';
import PetIndicator from '../../pets/components/PetIndicator.vue';
import { usePets } from '../../pets/composables/usePet';
import type { PetEvent, VaccineExtended, VisitExtended } from '../types';
import { showTypes } from '../utils';

const { pets, vaccines, vetVisits, selectPet, selectVaccine, selectVisit } = usePets();

const props = defineProps<{ event: PetEvent }>();
const pet = computed(() => pets.value.find(p => p.id === props.event.petId));
const title = computed(() => props.event.eventType === "vaccine"
    ? showTypes(props.event.types!, pet.value!)
    : props.event.title
);

const handleClick = (event: PetEvent) => {
    if (!pet.value) return;
    selectPet(pet.value);
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
    <Button variant="card" size="card" @click="handleClick(event)">
        <div class="flex gap-0.5">
            <Syringe v-if="event.eventType === 'vaccine'" class="shrink-0 text-brand-light" :size="20" />
            <BriefcaseMedical v-else class="shrink-0 text-brand-light" :size="20" />
            <div>
                <h4>{{ title }}</h4>
                <p class="text-text-secondary">{{ tsToDate(event.ts, "date") }}</p>
                <p v-if="event.vet" class="text-xs text-brand-light mt-0.75 flex items-center gap-[5px]">
                    <MapPinned :size="16" /> {{ event.vet }}
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
        font-size: clamp(0.9rem, 0.5vw, 1rem);
    }
}
</style>