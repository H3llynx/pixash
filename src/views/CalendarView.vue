<script setup lang="ts">
import Calendar from '../components/Calendar.vue';
import Header from '../components/Header.vue';
import UpcomingEvents from '../features/health/components/EventList.vue';
import VaccineForm from '../features/health/components/VaccineForm.vue';
import { showTypes } from '../features/health/utils';
import { usePets } from '../features/pets/composables/usePet';
import { tsToDate } from '../utils';

const { pets, vaccines } = usePets();
const vaccinesToShow = vaccines.value
    .filter(vaccine => vaccine.dueOn)
    .map(vaccine => ({
        title: showTypes(vaccine.types, pets.value.find(pet => pet.id === vaccine.petId)),
        date: tsToDate(vaccine.dueOn!, "input")
    }));
</script>

<template>
    <Header type="calendar" />
    <main>
        <Calendar :events="vaccinesToShow" />
        <UpcomingEvents />
        <VaccineForm />
    </main>
</template>