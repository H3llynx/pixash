<script setup lang="ts">
import { computed, ref } from 'vue';
import Calendar from '../components/Calendar.vue';
import Header from '../components/Header.vue';
import EventList from '../features/health/components/EventList.vue';
import VaccineForm from '../features/health/components/VaccineForm.vue';
import { showTypes } from '../features/health/utils';
import { usePets } from '../features/pets/composables/usePet';
import { tsToDate } from '../utils';

const { pets, vaccines, vetVisits } = usePets();
const calendarEvents = computed(() => [
    ...vaccines.value.filter(vaccine => vaccine.dueOn)
        .map(vaccine => ({
            title: showTypes(vaccine.types, pets.value.find(pet => pet.id === vaccine.petId)),
            date: tsToDate(vaccine.dueOn!, "input")
        })),
    ...vetVisits.value.map(visit => ({
        title: visit.title,
        date: tsToDate(visit.date, "input")
    }))
]);

const currentMonth = ref<Date>(new Date());
const currentMonthName = ref<string>("");
const eventsThisMonth = computed(() => [
    ...vaccines.value.filter(vaccine => tsToDate(vaccine.dueOn, "isThatMonth", currentMonth.value)).map(v => ({ ...v, ts: v.dueOn!, eventType: "vaccine" })),
    ...vetVisits.value.filter(visit => tsToDate(visit.date, "isThatMonth", currentMonth.value)).map(v => ({ ...v, ts: v.date!, eventType: "visit" }))
].sort((a, b) => a.ts.seconds - b.ts.seconds));

</script>

<template>
    <Header type="calendar" />
    <main>
        <div class="flex flex-col items-start gap-1.5 md:default-padding lg:grid lg:grid-cols-2">
            <Calendar :events="calendarEvents" @update-month="currentMonth = $event"
                @update-monthName="currentMonthName = $event" />
            <EventList :title="currentMonthName" :events="eventsThisMonth" location="calendar" />
        </div>
        <VaccineForm />
    </main>
</template>