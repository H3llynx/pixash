<script setup lang="ts">
import type { DatesSetArg, EventClickArg, EventInput, EventMountArg } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/vue3';
import { computed } from 'vue';
import { usePets } from '../../../pets/composables/usePets';

const props = defineProps<{
    events?: EventInput
}>();

const emit = defineEmits<{
    updateMonth: [date: Date]
    updateMonthName: [name: string]
    dateClick: [date: string, x: number, y: number]
}>();

const { selectVaccine, selectVisit, selectedDate, selectedLog } = usePets();

const eventColors: Record<string, string> = {
    visit: "var(--color-brand-light)",
    vaccine: "var(--color-gold)",
    log: "var(--color-separator)"
};

const calendarOptions = computed(() => ({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    events: props.events,
    height: "auto",
    headerToolbar: {
        left: "title",
        right: "today,prev,next"
    },
    eventDidMount(info: EventMountArg) {
        const type = info.event.extendedProps.event.eventType;
        info.el.style.backgroundColor = eventColors[type] || "gray";
        info.el.style.opacity = info.isPast ? "0.5" : "1";
    },
    datesSet(info: DatesSetArg) {
        emit("updateMonth", info.view.currentStart);
        emit("updateMonthName", info.view.title);
    },
    dateClick(info: DateClickArg) {
        const isSameDay = selectedDate.value === info.dateStr;
        if (isSameDay) {
            emit('dateClick', info.dateStr, 0, 0);  // parent handles toggle
            return;
        }
        selectedDate.value = info.dateStr;
        const rect = info.dayEl.getBoundingClientRect();
        const x = rect.left + window.scrollX + rect.width / 2;
        const y = rect.top + window.scrollY + 25;
        emit('dateClick', info.dateStr, x, y);
    },
    eventClick(info: EventClickArg) {
        if (info.event.extendedProps.event.eventType === "vaccine") selectVaccine(info.event.extendedProps.event);
        else if (info.event.extendedProps.event.eventType === "visit") selectVisit(info.event.extendedProps.event);
        else if (info.event.extendedProps.event.eventType === "log") {
            if (info.event.extendedProps.event.type === "antiparasitic")
                selectedLog.antiparasitic = info.event.extendedProps.event;
        }
    }
}));
</script>

<template>
    <FullCalendar :options="calendarOptions" />
</template>

<style scoped>
.fc {
    max-width: 100%;
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
    padding-top: 1rem;
    position: relative;
    z-index: 0;
}

:deep(.fc-toolbar-title) {
    font-size: x-large;
    color: var(--color-gold);
    padding-inline: 1rem;
}

:deep(.fc-button) {
    background: transparent;
    text-transform: capitalize;

    &:disabled {
        background: transparent;
        color: var(--color-text-secondary)
    }
}

:deep(.fc-button:not(:disabled):hover) {
    background-color: var(--color-brand-rgba);
}

:deep(.fc-daygrid-day, .fc-day-today) {
    border-radius: 10px;
    cursor: pointer;

    &:hover {
        background-color: var(--color-brand-rgba);
    }
}

:deep(.fc-daygrid-day.fc-day-today) {
    background: var(--color-bg-rgba);
}

:deep(.fc-event) {
    border: none;
    border-radius: 0.75rem;
    padding: 2px 4px;
    cursor: pointer;
    font-size: smaller;
}

:deep(.fc-event-title) {
    color: var(--color-text);
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
        background: transparent;
        color: var(--color-text-text);
        margin-inline: 2rem;
    }

    :deep(.fc-button) {
        color: var(--color-brand)
    }
}
</style>