<script setup lang="ts">
import Button from '../../../components/Button.vue';
import { tsToDate } from '../../../utils';
import PetIndicator from '../../pets/components/PetIndicator.vue';
import { usePets } from '../../pets/composables/usePet';
import type { VaccineExtended } from '../types';
import { showTypes } from '../utils';

const { pets, selectVaccine } = usePets();

const props = defineProps<{ event: VaccineExtended }>();

const pet = pets.value.filter(pet => pet.id === props.event.petId)[0];
const title = showTypes(props.event.types, pet);
const date = tsToDate(props.event.dueOn, "date") as string;

</script>
<template>
    <Button variant="card" size="card" @click="selectVaccine(event)">
        <div>
            <h4>{{ title }}</h4>
            <p class="text-text-secondary">{{ date }}</p>
        </div>
        <PetIndicator :pet="pet" />
    </Button>
</template>