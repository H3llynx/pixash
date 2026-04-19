<script setup lang="ts">
import Button from '../../../components/Button.vue';
import { tsToDate } from '../../../utils';
import PetIndicator from '../../pets/components/PetIndicator.vue';
import { usePets } from '../../pets/composables/usePet';
import type { PetEvent, VaccineExtended } from '../types';
import { showTypes } from '../utils';

const { pets, vaccines, selectVaccine } = usePets();

const props = defineProps<{ event: PetEvent }>();

const pet = pets.value.filter(pet => pet.id === props.event.petId)[0];
const title = props.event.eventType === "vaccine" ? showTypes(props.event.types!, pet) : props.event.title;
const date = tsToDate(props.event.ts, "date");

const handleClick = (event: PetEvent) => {
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
        <PetIndicator :pet="pet" />
    </Button>
</template>