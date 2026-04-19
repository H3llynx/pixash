<script setup lang="ts">
import { computed } from 'vue';
import Button from '../../../components/Button.vue';
import { tsToDate } from '../../../utils';
import PetIndicator from '../../pets/components/PetIndicator.vue';
import { usePets } from '../../pets/composables/usePet';
import type { PetEvent, VaccineExtended } from '../types';
import { showTypes } from '../utils';

const { pets, vaccines, selectPet, selectVaccine } = usePets();

const props = defineProps<{ event: PetEvent }>();

const pet = computed(() => pets.value.find(p => p.id === props.event.petId));
const title = computed(() => props.event.eventType === "vaccine"
    ? showTypes(props.event.types!, pet.value!)
    : props.event.title
);
const date = computed(() => tsToDate(props.event.ts, "date"));

const handleClick = (event: PetEvent) => {
    if (!pet.value) return;
    selectPet(pet.value);
    if (event.eventType === "vaccine") {
        const vaccine = vaccines.value.find(v => v.id === event.id) as VaccineExtended;
        selectVaccine(vaccine);
    }
}

</script>
<template>
    <Button variant="card" size="card" @click="handleClick(event)">
        <div>
            <h4>{{ title }}</h4>
            <p class="text-text-secondary">{{ date }}</p>
        </div>
        <PetIndicator :pet="pet!" />
    </Button>
</template>