<script setup lang="ts">
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/vue3';
import { showTypes } from '../features/health/utils';
import { usePets } from '../features/pets/composables/usePet';
import { tsToDate } from '../utils';

const { selectedPet } = usePets();
const vaccines = selectedPet.value?.vaccines
    .filter(vaccine => vaccine.dueOn)
    .map(vaccine => ({
        title: showTypes(vaccine.types, selectedPet.value!),
        date: tsToDate(vaccine.dueOn!, "input")
    }));

const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    events: vaccines,
    height: "auto",
    headerToolbar: {
        left: "title",
        right: "prev,next"
    },
    dateClick(info: any) {
        alert('Next vaccine date : ' + info.dateStr)
    }
}
</script>

<template>
    <FullCalendar :options="calendarOptions" />
</template>

<style scoped>
.fc {
    background-color: var(--color-loading-bg);
    color: var(--color-brand-light);
    padding: 1rem;
}

:deep(.fc-toolbar-title) {
    font-size: x-large;
    color: var(--color-gold);
}

:deep(.fc-button) {
    background: transparent;
}

:deep(.fc-button:hover) {
    background-color: var(--color-brand-rgba);
}

:deep(.fc-daygrid-day.fc-day-today) {
    background: var(--color-brand-rgba);
}

:deep(.fc-event) {
    background-color: var(--color-gold);
    border: none;
    border-radius: 4px;
    padding: 2px 4px;
}

:deep(.fc-scrollgrid-section-header th) {
    background: none;
    font-weight: 200;
    font-size: small;
    color: var(--color-text-secondary);
    height: 40px;
}

:deep(.fc-button),
:deep(.fc-scrollgrid),
:deep(.fc-scrollgrid td),
:deep(.fc-scrollgrid-section-header th),
:deep(.fc-scrollgrid-sync-table td) {
    border: none;
}

:deep(.fc-daygrid-day-number) {
    width: 100%;
    text-align: center;
    font-size: smaller;
}

:deep(.fc-daygrid-day-frame) {
    height: 40px;
}
</style>