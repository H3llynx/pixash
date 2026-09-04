<script setup lang="ts">
import type { DatesSetArg, EventClickArg, EventInput, EventMountArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/vue3';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePets } from '../../../pets/composables/usePets';

const { selectVaccine, selectVisit, selectLog, loading, careLoading } = usePets();
const { locale } = useI18n();

const props = defineProps<{
    events?: EventInput
}>();

const emit = defineEmits<{
    updateMonth: [date: Date]
    updateMonthName: [name: string]
    dateClick: [date: string, x: number, y: number]
}>();

const eventColors: Record<string, string> = {
    visit: "var(--color-purple)",
    vaccine: "var(--color-gold)",
    log: "var(--color-border-light)",
};

const calendarOptions = computed(() => ({
    locale: locale.value,
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    events: props.events,
    height: "auto",
    headerToolbar: {
        left: "title",
        right: "dayGridMonth,dayGridWeek,today,prev,next"
    },
    eventDidMount(info: EventMountArg) {
        const type = info.event.extendedProps.event.eventType;
        if (eventColors[type]) info.el.style.backgroundColor = eventColors[type];
        info.el.style.opacity = info.isPast ? "0.4" : "1";
        if (type === "treatment") {
            info.el.classList.add("treatment-event");
        };
    },
    datesSet(info: DatesSetArg) {
        emit("updateMonth", info.view.currentStart);
        emit("updateMonthName", info.view.title);
    },
    dateClick(info: DateClickArg) {
        const rect = info.dayEl.getBoundingClientRect();
        const x = rect.left + window.scrollX + rect.width / 2;
        const y = rect.top + window.scrollY + 25;
        emit("dateClick", info.dateStr, x, y);
    },
    eventClick(info: EventClickArg) {
        if (info.event.extendedProps.event.eventType === "vaccine") selectVaccine(info.event.extendedProps.event);
        else if (info.event.extendedProps.event.eventType === "visit") selectVisit(info.event.extendedProps.event);
        else if (info.event.extendedProps.event.eventType === "log") selectLog(info.event.extendedProps.event)
    }
}));
</script>

<template>
    <div :class="{ 'animate-pulse': loading || careLoading }">
        <FullCalendar :options="calendarOptions" />
    </div>
</template>

<style scoped>
.fc {
    max-width: 100%;
    padding-top: 1rem;
    padding-inline: 0.5rem;
    position: relative;
    z-index: 0;
}

:deep(.fc-toolbar-title) {
    font-size: x-large;
    padding-inline: 1rem;
}

:deep(.fc-button) {
    background: transparent;
    text-transform: capitalize;
    border-radius: 24px !important;
    margin-inline: 0.25rem;
    color: var(--color-text-tertiary);

    &:disabled {
        background: transparent;
        color: var(--color-text-secondary);
        cursor: default;
    }
}

:deep(.fc-button:not(:disabled):hover) {
    background-color: var(--color-interactive);
}

:deep(.fc-button-active) {
    background-color: var(--color-accent) !important;
}

:deep(.fc-daygrid-day, .fc-day-today) {
    border-radius: 10px;
    cursor: pointer;

    &:hover {
        background-color: var(--color-interactive-rgba);
    }
}

:deep(.fc-daygrid-day.fc-day-today) {
    background: var(--color-border);
    color: var(--color-accent-softer);
}

:deep(.fc-event) {
    border: none;
    border-radius: 0.75rem;
    padding: 2px 4px;
    cursor: pointer;
    font-size: smaller;

    &:hover {
        background: var(--color-bg-rgba) !important;
    }
}

:deep(.fc-event-title) {
    color: var(--color-text);

    &:hover {
        color: var(--color-white);
    }
}

:deep(.fc-scrollgrid-section-header th) {
    background: none;
    font-weight: 200;
    font-size: small;
    color: var(--color-text-secondary);
    height: 50px;
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

:deep(.treatment-event .fc-event-title) {
    color: rgb(48, 131, 124);
    font-size: 0.65rem;
    font-style: italic;
}

:deep(.treatment-event) {
    display: flex;
    align-items: flex-end;
    pointer-events: none;
    border: 1px solid var(--color-border);
}

:deep(.fc-dayGridWeek-view .fc-daygrid-day-frame) {
    min-height: 30vh;
    border-inline: 1px solid var(--color-border-light);
}

@media (width >=48rem) {
    .fc {
        margin-inline: 2rem;
    }
}

@media (width >=64rem) {
    :deep(.fc-dayGridWeek-view .fc-daygrid-day-frame) {
        min-height: 50vh;
    }
}

@media (width < 48rem) {
    :deep(.fc-header-toolbar) {
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    :deep(.fc-toolbar-chunk:first-child) {
        width: 100%;
    }
}
</style>