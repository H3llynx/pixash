<script setup lang="ts">
import type { EventInput } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/vue3';

const props = defineProps<{
    events?: EventInput
}>();
const emit = defineEmits<{
    updateMonth: [date: Date]
    updateMonthName: [name: string]
}>();

const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    events: props.events,
    height: "auto",
    headerToolbar: {
        left: "title",
        right: "prev,next"
    },
    datesSet(info: any) {
        emit("updateMonth", info.view.currentStart);
        emit("updateMonthName", info.view.title);
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
    max-width: 100%;
    background-color: var(--color-brand-dark);
    color: var(--color-brand-light);
    padding: 1rem 1rem 0rem 1rem;
    position: relative;
    z-index: 0;
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
    cursor: pointer;
}

:deep(.fc-event-title) {
    color: var(--color-brand-dark);
}

:deep(.fc-scrollgrid-section-header th) {
    background: none;
    font-weight: 200;
    font-size: small;
    color: var(--color-text-secondary);
    height: 50px;
}

:deep(.fc-daygrid-day-frame) {
    aspect-ratio: 1;
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

@media (width >=48rem) {
    .fc {
        background-color: var(--color-bg-3);
        color: var(--color-text-text);
        border-radius: 0.75rem;
        border: 1px solid var(--color-border);
    }

    :deep(.fc-button) {
        color: var(--color-brand)
    }
}
</style>