<script setup lang="ts">
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/vue3';
import type { VaccineTypes } from '../features/health/types';
import { showTypes } from '../features/health/utils';
import { usePets } from '../features/pets/composables/usePet';
import { tsToDate } from '../utils';

const { selectedPet } = usePets();
const vaccines = selectedPet.value?.vaccines
    .filter(vaccine => vaccine.dueOn)
    .map(vaccine => ({
        title: showTypes(vaccine.types as VaccineTypes["id"][], selectedPet.value!),
        date: tsToDate(vaccine.dueOn!, "input")
    }));

const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: vaccines,
    dateClick(info: any) {
        alert('Next vaccine date : ' + info.dateStr)
    }
}
</script>

<template>
    <FullCalendar :options="calendarOptions" />
</template>
