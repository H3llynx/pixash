<script setup lang="ts">
import { computed, ref } from 'vue';
import Calendar from '../components/Calendar.vue';
import Header from '../components/Header.vue';
import EventList from '../features/health/components/EventList.vue';
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

const currentMonth = ref<Date>(new Date());
const currentMonthName = ref<string>("");
const vaccinesThisMonth = computed(() =>
    vaccines.value.filter(vaccine => tsToDate(vaccine.dueOn, "isThatMonth", currentMonth.value))
);
</script>

<template>
    <Header type="calendar" />
    <main>
        <div class="flex flex-col gap-1.5 md:default-padding lg:grid lg:grid-cols-2">
            <Calendar :events="vaccinesToShow" @update-month="currentMonth = $event"
                @update-monthName="currentMonthName = $event" />
            <EventList :title="currentMonthName" :events="vaccinesThisMonth" location="calendar" />
        </div>
        <VaccineForm />
    </main>
</template>