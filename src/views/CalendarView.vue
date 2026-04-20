<script setup lang="ts">
import { computed, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import Header from '../components/Header.vue';
import Calendar from '../features/health/components/Calendar.vue';
import EventList from '../features/health/components/EventList.vue';
import { showTypes } from '../features/health/utils';
import { usePets } from '../features/pets/composables/usePet';
import { tsToDate } from '../utils';

const { pets, vaccines, vetVisits, selectedDate } = usePets();
const calendarEvents = computed(() => [
    ...vaccines.value.filter(vaccine => vaccine.dueOn)
        .map(vaccine => ({
            id: vaccine.id,
            title: showTypes(vaccine.types, pets.value.find(pet => pet.id === vaccine.petId)),
            date: tsToDate(vaccine.dueOn!, "input"),
            event: vaccine,
        })),
    ...vetVisits.value.map(visit => ({
        id: visit.id,
        title: visit.title,
        date: tsToDate(visit.date, "input"),
        event: visit,
    }))
]);

const currentMonth = ref<Date>(new Date());
const currentMonthName = ref<string>("");

const eventsThisMonth = computed(() => [
    ...vaccines.value.filter(vaccine => tsToDate(vaccine.dueOn, "isThatMonth", currentMonth.value)),
    ...vetVisits.value.filter(visit => tsToDate(visit.date, "isThatMonth", currentMonth.value))
].sort((a, b) => a.ts.seconds - b.ts.seconds));

onBeforeRouteLeave(() => {
    selectedDate.value = "null";
});
</script>

<template>
    <Header type="calendar" />
    <main class="lg:my-auto">
        <div class="flex flex-col lg items-start gap-1.5 md:default-padding lg:grid lg:grid-cols-2">
            <Calendar :events="calendarEvents" @update-month="currentMonth = $event"
                @update-monthName="currentMonthName = $event" />
            <EventList :title="currentMonthName" :events="eventsThisMonth" location="calendar" />
        </div>
    </main>
</template>